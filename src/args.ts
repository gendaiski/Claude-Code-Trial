export type FlagValue = string | boolean;

export interface ParsedArgs {
  /** First non-flag token, if any. */
  command: string | undefined;
  /** Remaining non-flag tokens, plus everything after a bare `--`. */
  positionals: string[];
  flags: Record<string, FlagValue>;
}

export interface ParseOptions {
  /**
   * Flags that never consume the following token. Without this, `--verbose start`
   * would read `start` as the value of `--verbose`.
   */
  booleans?: readonly string[];
  /** Short name -> long name, e.g. `{ v: "verbose" }`. */
  aliases?: Readonly<Record<string, string>>;
}

export class UsageError extends Error {}

/**
 * Parses `--long`, `--long=value`, `--long value`, `-s`, and clustered short
 * flags (`-abc`). Tokens after a bare `--` are always positionals.
 */
export function parseArgs(argv: readonly string[], options: ParseOptions = {}): ParsedArgs {
  const booleans = new Set(options.booleans ?? []);
  const aliases = options.aliases ?? {};

  const positionals: string[] = [];
  const flags: Record<string, FlagValue> = {};

  const resolve = (name: string): string => aliases[name] ?? name;

  const setFlag = (rawName: string, value: FlagValue): void => {
    const name = resolve(rawName);
    if (typeof value === "string" && booleans.has(name)) {
      throw new UsageError(`Flag --${name} does not take a value`);
    }
    flags[name] = value;
  };

  for (let i = 0; i < argv.length; i++) {
    const token = argv[i]!;

    if (token === "--") {
      positionals.push(...argv.slice(i + 1));
      break;
    }

    if (token.startsWith("--")) {
      const body = token.slice(2);
      if (body.length === 0) continue;

      const eq = body.indexOf("=");
      if (eq !== -1) {
        setFlag(body.slice(0, eq), body.slice(eq + 1));
        continue;
      }

      const name = resolve(body);
      const next = argv[i + 1];
      if (!booleans.has(name) && next !== undefined && !next.startsWith("-")) {
        setFlag(name, next);
        i++;
      } else {
        setFlag(name, true);
      }
      continue;
    }

    if (token.startsWith("-") && token.length > 1) {
      const shorts = token.slice(1).split("");
      for (let s = 0; s < shorts.length; s++) {
        const short = shorts[s]!;
        const name = resolve(short);
        const isLast = s === shorts.length - 1;
        const next = argv[i + 1];
        if (isLast && !booleans.has(name) && next !== undefined && !next.startsWith("-")) {
          setFlag(name, next);
          i++;
        } else {
          setFlag(name, true);
        }
      }
      continue;
    }

    positionals.push(token);
  }

  return { command: positionals[0], positionals, flags };
}
