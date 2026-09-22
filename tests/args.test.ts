import { describe, expect, it } from "vitest";
import { parseArgs, UsageError } from "../src/args.ts";

const opts = {
  booleans: ["verbose", "help"],
  aliases: { p: "port", v: "verbose", h: "help" },
} as const;

describe("parseArgs", () => {
  it("reads the command and trailing positionals", () => {
    const { command, positionals } = parseArgs(["start", "api"], opts);
    expect(command).toBe("start");
    expect(positionals).toEqual(["start", "api"]);
  });

  it("parses --key=value", () => {
    expect(parseArgs(["start", "--port=8080"], opts).flags).toEqual({ port: "8080" });
  });

  it("parses --key value", () => {
    expect(parseArgs(["start", "--port", "8080"], opts).flags).toEqual({ port: "8080" });
  });

  it("does not let a boolean flag swallow the next token", () => {
    const { command, flags } = parseArgs(["--verbose", "start"], opts);
    expect(command).toBe("start");
    expect(flags).toEqual({ verbose: true });
  });

  it("expands short aliases and clusters", () => {
    expect(parseArgs(["start", "-vh"], opts).flags).toEqual({ verbose: true, help: true });
    expect(parseArgs(["start", "-p", "9000"], opts).flags).toEqual({ port: "9000" });
  });

  it("treats everything after `--` as positional", () => {
    const { positionals, flags } = parseArgs(["start", "--", "--port", "8080"], opts);
    expect(positionals).toEqual(["start", "--port", "8080"]);
    expect(flags).toEqual({});
  });

  it("rejects a value on a boolean flag", () => {
    expect(() => parseArgs(["--verbose=yes"], opts)).toThrow(UsageError);
  });

  it("returns an undefined command for empty argv", () => {
    expect(parseArgs([], opts).command).toBeUndefined();
  });
});
