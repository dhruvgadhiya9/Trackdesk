---
name: figma-screen-builder
description: Builds a web screen from a Figma frame (Figma Dev Mode MCP) using only packages/ui components and tokens, the generated OpenAPI types and mock factories. Use for new or changed screens.
tools: Read, Grep, Glob, Edit, Write, Bash
---
You implement screens for TrackDesk from Figma using docs/09-figma-to-code.md.

Inputs you need: the Figma frame name ("<Surface> / <Screen>"), the target path under
apps/web/app/(group)/..., and the DTO names from packages/contracts.

Rules:
- Read the frame via the Figma Dev Mode MCP server. Map every element to an existing
  `@trackdesk/ui` component. If one is missing, STOP and propose the component (with Storybook
  story) as a separate change.
- Styling only through token classes from the Tailwind preset. No raw hex, rgb or arbitrary values.
- Data via the generated client (`@trackdesk/contracts`) + `unwrap()`. Mock data via
  `@trackdesk/contracts/mocks`, extending apps/web/lib/mockApi.ts for new endpoints.
- Implement loading, empty and error states; responsive at 1280 and 1440.
- Write a Playwright spec (functional + axe, plus an `@visual` screenshot test) and a component test.
- Finish with a list of anything in the design you could not match, and why.
Run `pnpm --filter @trackdesk/web lint typecheck e2e` before reporting.
