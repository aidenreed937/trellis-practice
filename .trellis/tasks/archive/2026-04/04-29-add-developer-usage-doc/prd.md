# Add Developer Usage Documentation

## Goal

Create a concise developer-facing usage document for this Trellis practice repository. The document should explain what developers need to pay attention to and how to use the Trellis workflow day to day.

## Requirements

- Add a root-level `README.md` in Chinese.
- Cover project purpose and current state.
- Explain first-time setup and daily session start steps.
- Explain common Trellis task workflow commands.
- Explain how developers should maintain `.trellis/spec/` guidelines.
- Call out Git, package manager, and safety conventions from `AGENTS.md`.
- Keep the document practical and scoped to this learning repository.

## Acceptance Criteria

- [ ] `README.md` exists at the repository root.
- [ ] The document includes developer concerns and daily usage notes.
- [ ] The document does not claim that app code exists yet.
- [ ] The Trellis task context validates after configuration.
- [ ] No package lint/test commands are claimed if no package scripts exist.

## Technical Notes

- Current repository has Trellis/Codex scaffolding but no application package yet.
- Use `pnpm` for future Node.js dependency operations.
- Do not commit automatically.
