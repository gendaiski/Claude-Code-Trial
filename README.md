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

## Status (Codex, 2026-10-20)

**Result: CLI scaffold works; application backend remains unimplemented.** Inspected `claude/project-startup-67e4ib` at `ad0577e94ec014c93a30ff859f42e1bbdb1ef6f4`.

Seven actual Node 24 checks passed: help, version, no-command usage, invalid command, invalid port, configuration precedence/SIGTERM shutdown, and a probe confirming no socket is opened.

- Pinned sources executed directly using Node type stripping with no dependency install.
- The start implementation explicitly marks 'real work goes here'; its 'listening' line only logs and waits for a shutdown signal.

**Checks performed:**

- `node src/cli.ts --help`
- `node src/cli.ts --version`
- `node src/cli.ts (expected exit 2)`
- `node src/cli.ts missing-command (expected exit 2)`
- `node src/cli.ts start --port 70000 (expected exit 2)`
- `Native start/config/SIGTERM and loopback probe (7/7 checks total)`

**Remaining requirements and limits:**

- No real server/socket, terminal/session engine or application workflow is implemented by the starter.
- Upstream npm ci/Vitest/typecheck/build were not run because dev dependencies are absent; no fresh dependency install attempted.

**Licence:** MIT declared in package.json; no separate LICENSE file in this branch.

**Next step:** Use as a working CLI skeleton; implement a real backend before labelling it a complete terminal system.

This check covers only the scope stated above. No deployment, repository visibility change or secret-value inspection occurred. Existing source and notices are retained; this PR changes only this README.
