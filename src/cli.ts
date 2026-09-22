#!/usr/bin/env node
import { realpathSync } from "node:fs";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import { parseArgs, UsageError } from "./args.ts";
import { start, waitForShutdown } from "./commands/start.ts";

const require = createRequire(import.meta.url);
const pkg = require("../package.json") as { version: string };

const HELP = `termly — a small terminal CLI

Usage
  termly <command> [options]

Commands
  start [name]        Start termly and run until interrupted

Options
  -p, --port <n>      Port to listen on (default: 3000)
      --name <name>   Instance name (default: termly)
  -v, --verbose       Print the resolved configuration
  -h, --help          Show this help
  -V, --version       Show the version

Configuration
  Values are read from termly.config.json in the working directory, then
  overridden by command-line flags.
`;

export async function run(argv: readonly string[]): Promise<number> {
  const { command, positionals, flags } = parseArgs(argv, {
    booleans: ["verbose", "help", "version"],
    aliases: { p: "port", v: "verbose", h: "help", V: "version" },
  });

  if (flags.version === true) {
    process.stdout.write(`${pkg.version}\n`);
    return 0;
  }

  if (flags.help === true || command === undefined) {
    process.stdout.write(HELP);
    return command === undefined && flags.help !== true ? 2 : 0;
  }

  switch (command) {
    case "start":
      return await start(positionals.slice(1), flags, {
        cwd: process.cwd(),
        log: (message) => process.stdout.write(`${message}\n`),
        wait: waitForShutdown,
      });
    case "help":
      process.stdout.write(HELP);
      return 0;
    default:
      throw new UsageError(`Unknown command: ${command}`);
  }
}

/**
 * True when this file was invoked directly. Both sides are resolved through
 * `realpath` so the npm bin symlink still matches.
 */
function isEntrypoint(): boolean {
  const invoked = process.argv[1];
  if (invoked === undefined) return false;
  try {
    return realpathSync(invoked) === realpathSync(fileURLToPath(import.meta.url));
  } catch {
    return false;
  }
}

if (isEntrypoint()) {
  try {
    process.exitCode = await run(process.argv.slice(2));
  } catch (error) {
    const usage = error instanceof UsageError;
    process.stderr.write(`termly: ${(error as Error).message}\n`);
    if (usage) process.stderr.write(`Run \`termly --help\` for usage.\n`);
    process.exitCode = usage ? 2 : 1;
  }
}
