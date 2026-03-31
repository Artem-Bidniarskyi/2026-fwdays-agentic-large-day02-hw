---
name: memory-bank-update
description: Updates the Memory Bank (docs/memory/) with recent changes, ensuring all technical details are accurate and up to date. Use when the user asks to update the memory bank, sync documentation, or refresh project context.
allowed-tools: Read, Grep, Glob, Bash, Edit
argument-hint: [what changed or "auto" to detect from git]
---

# Skill: Memory Bank Update

## When to use

After significant code changes: new features, refactors, architecture changes, dependency updates, or completed milestones.
Triggered by: "update memory bank", "sync docs", "refresh project docs".

## Inputs

- What changed: `$ARGUMENTS` (or auto-detect from git history)

## Memory Bank Structure

All files live in `docs/memory/`. Each has a distinct role:

| File | Role | Update when... |
|------|------|----------------|
| `projectbrief.md` | Repo scope, layout, goals | Repo structure or project scope changes |
| `productContext.md` | Product problems, audiences, UX | Product direction or user-facing features change |
| `systemPatterns.md` | Architecture, builds, dev patterns | Architecture, build pipeline, or code patterns change |
| `techContext.md` | Stack, versions, commands | Dependencies, tooling, or dev commands change |
| `activeContext.md` | Current focus (update often) | Task or branch changes |
| `progress.md` | Milestones and backlog | Features completed or new work items identified |
| `decisionLog.md` | Append-only decision log | Non-obvious technical decisions are made |

Extended docs (update only if deeply affected):
- `docs/technical/architecture.md` — diagrams, data flow, rendering pipeline
- `docs/technical/dev-setup.md` — onboarding steps
- `docs/product/domain-glossary.md` — term definitions
- `docs/product/PRD.md` — product requirements

## Steps

1. **Detect changes** — Run `git diff --stat HEAD~5` and `git log --oneline -10` to identify recent changes. If `$ARGUMENTS` specifies what changed, use that instead.

2. **Classify changes** — Map each change to the appropriate memory bank file(s):
   - New feature or completed work → `progress.md` + `activeContext.md`
   - Architecture or pattern change → `systemPatterns.md` + `decisionLog.md`
   - Dependency add/remove/upgrade → `techContext.md`
   - Build or tooling change → `techContext.md` + `systemPatterns.md`
   - Scope or structure change → `projectbrief.md`
   - Product or UX change → `productContext.md`
   - Non-obvious decision → `decisionLog.md` (append only)

3. **Read current state** — Read each file that needs updating to understand existing content.

4. **Verify against source** — Before writing any update, verify claims against actual code:
   - Version numbers → check `package.json`
   - Commands → check `scripts` in `package.json`
   - Architecture claims → check actual imports and file structure
   - Pattern claims → grep for actual usage

5. **Update files** — Apply changes:
   - `activeContext.md`: Replace current focus section with latest state
   - `progress.md`: Move completed items, add new backlog items
   - `techContext.md` / `systemPatterns.md`: Update facts in place, keep source verification tables current
   - `decisionLog.md`: **Append only** — add new entry with date, context, alternatives, and consequences
   - `projectbrief.md` / `productContext.md`: Update only if scope genuinely changed

6. **Cross-check AGENTS.md** — If changes affect information also in `AGENTS.md` (root), flag it for the user to update separately.

## Outputs

- List of updated Memory Bank files with summary of changes
- Any flagged inconsistencies between memory bank and actual code
- Reminder if `AGENTS.md` also needs updating

## Safety

- Do NOT remove manually curated content without asking
- Do NOT add speculative information — only verified facts from code
- Do NOT exceed 200 lines per file — summarize if needed
- `decisionLog.md` is **append-only** — never edit or remove existing entries
- Verify ALL technical claims against actual source code (see "Source verification" tables in each file)
- Keep factual claims traceable — reference the source file or config where the fact can be verified