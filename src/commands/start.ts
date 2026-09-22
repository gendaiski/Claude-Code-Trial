import { readFile } from "node:fs/promises";
import path from "node:path";
import { UsageError, type FlagValue } from "../args.ts";

export const CONFIG_FILENAME = "termly.config.json";

export interface StartConfig {
  name: string;
  port: number;
  verbose: boolean;
}

export const DEFAULT_CONFIG: StartConfig = {
  name: "termly",
  port: 3000,
  verbose: false,
};

export interface StartContext {
  cwd: string;
  log: (message: string) => void;
  /** Blocks until shutdown. Overridden in tests so nothing hangs. */
  wait: () => Promise<void>;
}

/** Reads `termly.config.json` from `cwd`. Returns `{}` when the file is absent. */
export async function loadConfigFile(cwd: string): Promise<Partial<StartConfig>> {
  const file = path.join(cwd, CONFIG_FILENAME);

  let raw: string;
  try {
    raw = await readFile(file, "utf8");
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return {};
    throw error;
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch (error) {
    throw new UsageError(`${CONFIG_FILENAME} is not valid JSON: ${(error as Error).message}`);
  }

  if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
    throw new UsageError(`${CONFIG_FILENAME} must contain a JSON object`);
  }

  return parsed as Partial<StartConfig>;
}

function toPort(value: unknown, source: string): number {
  const port = typeof value === "number" ? value : Number(value);
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new UsageError(`${source} must be an integer between 1 and 65535, got: ${String(value)}`);
  }
  return port;
}

/** Precedence, lowest to highest: defaults, config file, positional name, flags. */
export function resolveConfig(
  fileConfig: Partial<StartConfig>,
  flags: Record<string, FlagValue>,
  positionalName?: string,
): StartConfig {
  const config: StartConfig = { ...DEFAULT_CONFIG };

  if (fileConfig.name !== undefined) config.name = String(fileConfig.name);
  if (fileConfig.port !== undefined) config.port = toPort(fileConfig.port, `${CONFIG_FILENAME} "port"`);
  if (fileConfig.verbose !== undefined) config.verbose = Boolean(fileConfig.verbose);

  if (positionalName !== undefined) config.name = positionalName;

  if (flags.name !== undefined) {
    if (flags.name === true) throw new UsageError("--name requires a value");
    config.name = String(flags.name);
  }
  if (flags.port !== undefined) {
    if (flags.port === true) throw new UsageError("--port requires a value");
    config.port = toPort(flags.port, "--port");
  }
  if (flags.verbose !== undefined) config.verbose = flags.verbose !== false;

  return config;
}

/**
 * Runs `termly start`. Resolves configuration, reports it, then blocks until
 * shutdown. Replace the body of the marked section with the real work.
 */
export async function start(
  positionals: readonly string[],
  flags: Record<string, FlagValue>,
  ctx: StartContext,
): Promise<number> {
  if (positionals.length > 1) {
    throw new UsageError(`Unexpected argument: ${positionals[1]}`);
  }

  const fileConfig = await loadConfigFile(ctx.cwd);
  const config = resolveConfig(fileConfig, flags, positionals[0]);

  if (config.verbose) {
    ctx.log(`config file: ${Object.keys(fileConfig).length > 0 ? path.join(ctx.cwd, CONFIG_FILENAME) : "(none)"}`);
    ctx.log(`resolved:    ${JSON.stringify(config)}`);
  }

  // --- real work goes here ---
  ctx.log(`termly "${config.name}" listening on port ${config.port}`);
  ctx.log("press ctrl-c to stop");
  await ctx.wait();
  // --- end real work ---

  ctx.log("stopped");
  return 0;
}

/** Default `wait`: resolves on the first SIGINT or SIGTERM. */
export function waitForShutdown(): Promise<void> {
  return new Promise((resolve) => {
    // Signal listeners do not ref the event loop, so without a ref'd handle
    // Node drains and exits (code 13, "unsettled top-level await") before any
    // signal can arrive. The interval is the thing keeping the process up.
    const keepAlive = setInterval(() => {}, 1 << 30);

    const done = (): void => {
      clearInterval(keepAlive);
      process.off("SIGINT", done);
      process.off("SIGTERM", done);
      resolve();
    };

    process.once("SIGINT", done);
    process.once("SIGTERM", done);
  });
}
