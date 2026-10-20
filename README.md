# termly

A small terminal CLI.

## Requirements

Node.js 22.6 or newer. The `dev` script runs TypeScript sources directly via
Node's built-in type stripping, so no watcher or bundler is needed.

## Install

```sh
npm install
```

## Use

During development, run the sources directly:

```sh
npm run dev -- start
npm run dev -- start api --port 8080 --verbose
```

Or build once and run the compiled binary:

```sh
npm run build
node dist/cli.js start
```

To get a real `termly` command on your `PATH`, link the package:

```sh
npm run build && npm link
termly start
```

## Commands

| Command | Description |
| --- | --- |
| `termly start [name]` | Start termly and run until interrupted |
| `termly --help` | Show usage |
| `termly --version` | Show the version |

### Options

| Flag | Default | Description |
| --- | --- | --- |
| `-p, --port <n>` | `3000` | Port to listen on |
| `--name <name>` | `termly` | Instance name |
| `-v, --verbose` | `false` | Print the resolved configuration |

## Configuration

Drop a `termly.config.json` in the working directory:

```json
{
  "name": "api",
  "port": 8080,
  "verbose": false
}
```

Precedence, lowest to highest: built-in defaults, `termly.config.json`, the
positional name, command-line flags.

## Exit codes

| Code | Meaning |
| --- | --- |
| `0` | Success |
| `1` | Runtime error |
| `2` | Usage error (unknown command, bad flag, no command given) |

## Development

```sh
npm run typecheck   # tsc --noEmit
npm test            # vitest run
npm run build       # emit dist/
```

`src/commands/start.ts` marks the spot where the real work belongs — the block
between the `--- real work goes here ---` comments. Everything around it
(argument parsing, config resolution, shutdown handling, exit codes) is done.

## Status (Codex, 2026-10-19)

**Result: partly.** Checked `claude/workflow-library-setup-sfsijo` at `5e368ef68745939989c03e5a5a15b1e97f9fbb51`.

- **Verified:** npm ci; npm run typecheck; npm test (25 passed); npm run build all succeeded. Started node dist/cli.js start and inspected src/commands/start.ts.
- **Limits / next step:** The command prints a listening address but only logs and waits for a signal; it does not create the claimed server/socket. A real terminal/session service remains to be implemented. The startup probe was stopped after a timeout, not counted as a successful server test.

Checks ran in a managed Linux environment; browser checks used Chromium over localhost. Results certify only the stated scope, not production readiness. No secret values, deployments or repository visibility changes were made. Upstream licences and notices are retained.
