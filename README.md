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

**Result: Offline library tools work; live n8n workflow execution unverified.** Inspected `claude/workflow-library-setup-sfsijo` at `5e368ef68745939989c03e5a5a15b1e97f9fbb51`.

Executed all three original offline checks with Node 24, no npm install:51 workflows/353 nodes valid; all 51 provenance checksums match; catalog current.

- Pinned source archive checked in a separate local folder.
- The root remains the same termly CLI scaffold; the actual additional product lives in workflow-library/.
- SETUP.md explicitly says the published 27,000-workflow collection was not fetched; this branch contains 51.

**Checks performed:**

- `node scripts/verify.mjs (51 workflows,353 nodes; exit 0)`
- `node scripts/checksums.mjs (51match; exit 0)`
- `node scripts/build-catalog.mjs --check (catalog current; exit 0)`

**Remaining requirements and limits:**

- These are importable inactive n8n templates and validation tooling, not an installed n8n server or proof of running automations.
- Real execution requires a separate n8n runtime, replacing credential placeholders and owner-owned integration/provider accounts.
- The wider 27,000 collection is absent; workflow provenance does not by itself establish a broad content redistribution licence.

**Licence:** Root package declares MIT; retain imported workflow provenance. No standalone root LICENSE; imported content rights need separate review.

**Next step:** Import a chosen inactive template into an isolated n8n instance, configure own credentials and verify the scenario before activation.

This check covers only the scope stated above. No deployment, repository visibility change or secret-value inspection occurred. Existing source and notices are retained; this PR changes only this README.
