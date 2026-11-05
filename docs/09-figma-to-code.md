# Figma → Code Workflow

## The 6 steps
1. **Designer prepares the frame.** Apply the AI-readability checklist below and mark it "Ready for dev".
2. **Sync tokens.** If variables changed, run `FIGMA_TOKEN=… FIGMA_FILE_KEY=… pnpm tokens:sync`.
   This regenerates `packages/ui/src/tokens.ts`. Commit it in its own PR, with designer review.
3. **Map components.** Every Figma component instance must map to a `packages/ui` component. If one
   is missing, build it first (with a Storybook story covering every variant) in a separate PR.
4. **Generate the screen.** In Claude Code with Figma Dev Mode MCP connected, select the frame and
   use the screen prompt template below (or the `figma-screen-builder` agent).
5. **Verify.** Playwright visual test at 1280 and 1440, and a component test. Claude lists anything
   it could not match.
6. **Sign off.** Designer compares Storybook/preview with Figma and approves in the PR (human).

## AI-readability checklist (designer)
- [ ] Every colour, font, spacing and radius uses a **variable** (no detached values)
- [ ] Layers named semantically (`JobCard/Status`, not `Frame 427`)
- [ ] Auto layout everywhere; no absolute positioning except overlays
- [ ] Components used for every repeated element; variants named like code props (`variant=primary`, `size=sm`)
- [ ] Loading, empty and error states drawn as separate frames
- [ ] Desktop frames at 1280 and 1440; mobile at 390
- [ ] Real-looking but synthetic content (no real customer data)
- [ ] Interaction notes (hover, drag, focus) as annotations
- [ ] Frame named `<Surface> / <Screen Name>` (for example `Ops / Dispatch Board`)

## Reusable screen prompt template
```
Read the selected Figma frame "<Surface / Screen Name>".
Build it as <path, e.g. apps/web/app/(ops)/dispatch/page.tsx>.
Use only components from packages/ui and tokens from packages/ui/tokens.
Use types generated in packages/contracts from the OpenAPI spec (<DTO names>). Mock
data with the factory in packages/contracts/mocks.
Include loading, empty and error states. Make it responsive at 1280 and 1440 widths.
Write a Playwright visual test and a component test. List anything in the design you
could not match.
```
