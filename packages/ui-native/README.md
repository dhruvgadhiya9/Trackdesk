# @trackdesk/ui-native

React Native equivalents of the essential `@trackdesk/ui` components for the field worker app
(`apps/mobile`). Styling comes only from `theme` (derived from `@trackdesk/ui/tokens`, the same
source as the web Tailwind preset). Raw colours and numbers are banned by the shared lint rule.

Components: `Text`, `Screen`, `Button`, `Card`, `JobStatusBadge` (all statuses incl. Overdue),
`JobListItem`, `TrackingIndicator` (required while background location is on), `EmptyState`,
`LoadingState`, `ErrorState`.
