import react from '@trackdesk/config/eslint/react';

// Design-token rule (no raw hex / arbitrary Tailwind values) comes from the shared config.
export default [...react, { ignores: ['.next/**', 'next-env.d.ts', 'playwright-report/**', 'test-results/**'] }];
