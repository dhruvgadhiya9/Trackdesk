import type { Preview } from '@storybook/react';
import '../src/styles.css';

const preview: Preview = {
  parameters: {
    viewport: {
      viewports: {
        desktop1280: { name: 'Desktop 1280', styles: { width: '1280px', height: '800px' } },
        desktop1440: { name: 'Desktop 1440', styles: { width: '1440px', height: '900px' } },
        mobile390: { name: 'Mobile 390', styles: { width: '390px', height: '844px' } },
      },
    },
  },
};

export default preview;
