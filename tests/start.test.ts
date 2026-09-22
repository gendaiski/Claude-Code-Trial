import { mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { beforeEach, describe, expect, it } from "vitest";
import { UsageError } from "../src/args.ts";
import {
  CONFIG_FILENAME,
  DEFAULT_CONFIG,
  loadConfigFile,
  resolveConfig,
  start,
  waitForShutdown,
  type StartContext,
} from "../src/commands/start.ts";

let dir: string;

beforeEach(async () => {
  dir = await mkdtemp(path.join(tmpdir(), "termly-test-"));
});

function context(lines: string[]): StartContext {
  return {
    cwd: dir,
    log: (message) => void lines.push(message),
    wait: async () => {},
  };
}

describe("loadConfigFile", () => {
  it("returns {} when the file is absent", async () => {
    expect(await loadConfigFile(dir)).toEqual({});
  });

  it("reads the file when present", async () => {
    await writeFile(path.join(dir, CONFIG_FILENAME), JSON.stringify({ port: 4000 }));
    expect(await loadConfigFile(dir)).toEqual({ port: 4000 });
  });

  it("rejects malformed JSON", async () => {
    await writeFile(path.join(dir, CONFIG_FILENAME), "{ nope");
    await expect(loadConfigFile(dir)).rejects.toThrow(UsageError);
  });

  it("rejects a non-object document", async () => {
    await writeFile(path.join(dir, CONFIG_FILENAME), "[1,2]");
    await expect(loadConfigFile(dir)).rejects.toThrow(UsageError);
  });
});

describe("resolveConfig", () => {
  it("falls back to the defaults", () => {
    expect(resolveConfig({}, {})).toEqual(DEFAULT_CONFIG);
  });

  it("lets the config file override the defaults", () => {
    expect(resolveConfig({ port: 4000 }, {}).port).toBe(4000);
  });

  it("lets flags override the config file", () => {
    expect(resolveConfig({ port: 4000 }, { port: "8080" }).port).toBe(8080);
  });

  it("lets a flag override the positional name", () => {
    expect(resolveConfig({}, { name: "flag" }, "positional").name).toBe("flag");
  });

  it("uses the positional name when no flag is given", () => {
    expect(resolveConfig({}, {}, "api").name).toBe("api");
  });

  it("rejects an out-of-range port", () => {
    expect(() => resolveConfig({}, { port: "0" })).toThrow(UsageError);
    expect(() => resolveConfig({}, { port: "70000" })).toThrow(UsageError);
    expect(() => resolveConfig({}, { port: "http" })).toThrow(UsageError);
  });

  it("rejects a valueless --port", () => {
    expect(() => resolveConfig({}, { port: true })).toThrow(UsageError);
  });
});

describe("start", () => {
  it("reports the resolved port and exits 0", async () => {
    const lines: string[] = [];
    const code = await start([], { port: "8080" }, context(lines));
    expect(code).toBe(0);
    expect(lines.join("\n")).toContain("port 8080");
    expect(lines.at(-1)).toBe("stopped");
  });

  it("picks up termly.config.json", async () => {
    await writeFile(path.join(dir, CONFIG_FILENAME), JSON.stringify({ name: "api", port: 4000 }));
    const lines: string[] = [];
    await start([], {}, context(lines));
    expect(lines.join("\n")).toContain('termly "api" listening on port 4000');
  });

  it("prints the resolved config when verbose", async () => {
    const lines: string[] = [];
    await start([], { verbose: true }, context(lines));
    expect(lines.join("\n")).toContain("resolved:");
  });

  it("rejects a second positional", async () => {
    await expect(start(["a", "b"], {}, context([]))).rejects.toThrow(UsageError);
  });
});

describe("waitForShutdown", () => {
  it("resolves on SIGINT and detaches both listeners", async () => {
    const before = { int: process.listenerCount("SIGINT"), term: process.listenerCount("SIGTERM") };

    const pending = waitForShutdown();
    expect(process.listenerCount("SIGINT")).toBe(before.int + 1);
    expect(process.listenerCount("SIGTERM")).toBe(before.term + 1);

    process.emit("SIGINT");
    await expect(pending).resolves.toBeUndefined();

    // Leaving the SIGTERM listener or the keep-alive timer behind would hang the CLI.
    expect(process.listenerCount("SIGINT")).toBe(before.int);
    expect(process.listenerCount("SIGTERM")).toBe(before.term);
  });

  it("resolves on SIGTERM", async () => {
    const pending = waitForShutdown();
    process.emit("SIGTERM");
    await expect(pending).resolves.toBeUndefined();
  });
});
