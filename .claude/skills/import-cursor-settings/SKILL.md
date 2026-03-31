---
name: import-cursor-settings
description: Imports Cursor IDE settings (.cursor directory) into Claude Code — converts rules, commands, skills, and .cursorrules into .claude equivalents. Use when the user asks to import, migrate, or sync Cursor settings.
disable-model-invocation: true
allowed-tools: Read, Write, Edit, Glob, Grep, Bash
argument-hint: [path to project with .cursor (default: current directory)]
---

# Skill: Import Cursor Settings

## When to use

When migrating from Cursor to Claude Code, or syncing Cursor rules/commands/skills into the `.claude/` directory.
Triggered by: "import cursor", "migrate cursor settings", "sync cursor rules".

## Inputs

- Project path: `$ARGUMENTS` (defaults to current working directory)

## Source Locations

Search for Cursor config in this order:

1. `$ARGUMENTS/.cursor/` — project-level Cursor directory
2. `$ARGUMENTS/.cursorrules` — legacy root-level rules file
3. `~/.cursor/rules/` — global Cursor rules
4. `~/.cursor/commands/` — global Cursor commands

## Steps

### Step 1: Discover Cursor Config

```
# Check all possible sources
ls -la $ARGUMENTS/.cursor/ 2>/dev/null
ls -la $ARGUMENTS/.cursorrules 2>/dev/null
ls -la ~/.cursor/rules/ 2>/dev/null
ls -la ~/.cursor/commands/ 2>/dev/null
```

Report what was found. If nothing exists, inform the user and stop.

### Step 2: Import Rules (`.cursor/rules/*.mdc` → `.claude/rules/*.mdc`)

Cursor `.mdc` files and Claude `.mdc` files share the same format:

| Cursor frontmatter | Claude frontmatter | Notes |
|----|----|----|
| `description` | `description` | Direct copy |
| `globs` | `globs` | Direct copy |
| `alwaysApply` | `alwaysApply` | Direct copy |

For each `.cursor/rules/*.mdc` file:

1. Read the file
2. Check if `.claude/rules/` already has a file with the same name
3. If duplicate exists — compare content, merge if different, skip if identical
4. If new — copy directly (format is compatible)
5. Preserve the markdown body as-is

### Step 3: Import Legacy `.cursorrules`

If `.cursorrules` exists at project root (plain text, no frontmatter):

1. Read the file
2. Create `.claude/rules/cursorrules-legacy.mdc` with frontmatter:
   ```yaml
   ---
   description: "Imported from legacy .cursorrules file"
   globs: "**/*"
   alwaysApply: true
   ---
   ```
3. Append the original content as the markdown body
4. Review content for Cursor-specific instructions that don't apply to Claude and flag them

### Step 4: Import Commands (`.cursor/commands/*.md` → `.claude/commands/*.md`)

Cursor commands are plain `.md` files with no frontmatter. Claude commands support frontmatter.

For each `.cursor/commands/*.md` file:

1. Read the file
2. Check if `.claude/commands/` already has a file with the same name
3. Create the Claude version with added frontmatter:
   ```yaml
   ---
   name: <derived from filename>
   description: "Imported from Cursor command"
   disable-model-invocation: true
   ---
   ```
4. Append the original markdown body
5. Replace any Cursor-specific references (`@file`, `@folder`, `@codebase`) with Claude equivalents in comments

### Step 5: Import Skills (`.cursor/skills/*/SKILL.md` → `.claude/skills/*/SKILL.md`)

Cursor skills use folder-based `SKILL.md` with minimal frontmatter (`description`, `name`).

For each `.cursor/skills/*/SKILL.md`:

1. Read the SKILL.md and any supporting files (resources/, templates/)
2. Check if `.claude/skills/` already has a skill with the same name
3. Enhance frontmatter with Claude-specific fields:
   - Keep `name` and `description`
   - Add `allowed-tools` based on what the skill does (read-only → `Read, Grep, Glob`; modifying → add `Edit, Write, Bash`)
   - Add `disable-model-invocation: true` if the skill has side effects
4. Copy supporting files (resources/, templates/) into the Claude skill directory
5. Adapt any Cursor-specific syntax in the body

### Step 6: Import MCP Config (`.cursor/mcp.json`)

If `.cursor/mcp.json` exists:

1. Read the file
2. Flag it for the user — MCP config format may differ between Cursor and Claude
3. Show the user what MCP servers are configured and suggest equivalent `.claude/settings.json` entries

### Step 7: Report

Generate a summary table:

| Source | Destination | Status |
|--------|-------------|--------|
| `.cursor/rules/foo.mdc` | `.claude/rules/foo.mdc` | Imported / Merged / Skipped |
| `.cursorrules` | `.claude/rules/cursorrules-legacy.mdc` | Imported |
| `.cursor/commands/bar.md` | `.claude/commands/bar.md` | Imported |
| ... | ... | ... |

## Cursor → Claude Reference Mapping

| Cursor concept | Claude equivalent |
|----|----|
| `.cursor/rules/*.mdc` | `.claude/rules/*.mdc` (same format) |
| `.cursorrules` (root) | `.claude/rules/*.mdc` with `alwaysApply: true` |
| `.cursor/commands/*.md` | `.claude/commands/*.md` (add frontmatter) |
| `.cursor/skills/*/SKILL.md` | `.claude/skills/*/SKILL.md` (enhance frontmatter) |
| `.cursor/mcp.json` | `.claude/settings.json` `mcpServers` section |
| `.cursor/hooks.json` | `.claude/settings.json` `hooks` section |
| `@file` reference | Direct file read (no special syntax needed) |
| `@folder` reference | Glob patterns or directory read |
| `@codebase` reference | Grep/Glob search across project |

## Safety

- NEVER overwrite existing `.claude/` files without showing a diff and asking for confirmation
- NEVER delete source `.cursor/` files — import is a copy, not a move
- Flag any Cursor-specific instructions that may not translate (e.g., Cursor UI references, `@` symbols)
- If a rule conflicts with an existing Claude rule, present both versions and let the user choose
