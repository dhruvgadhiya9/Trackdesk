import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

// Gherkin: docs/prd/01-customers.md (UI side). Runs against the mock API (synthetic data).
test.describe('Customers screen @mock-only', () => {
  test('lists customers in a table', async ({ page }) => {
    await page.goto('/ops/customers');
    await expect(page.getByRole('heading', { name: 'Customers' })).toBeVisible();
    await expect(page.getByRole('table')).toBeVisible();
    await expect(page.getByRole('row')).toHaveCount(9); // header + 8 synthetic customers
  });

  test('shows the empty state', async ({ page }) => {
    await page.goto('/ops/customers?scenario=empty');
    await expect(page.getByTestId('empty-state')).toContainText('No customers yet');
  });

  test('shows the error state with retry', async ({ page }) => {
    await page.goto('/ops/customers?scenario=error');
    await expect(page.getByTestId('error-state')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Try again' })).toBeVisible();
  });

  test('shows the loading state', async ({ page }) => {
    await page.goto('/ops/customers?scenario=slow');
    await expect(page.getByTestId('loading-state').first()).toBeVisible();
  });

  test('creates a customer and validates the name', async ({ page }) => {
    await page.goto('/ops/customers');
    await page.getByRole('button', { name: 'Add customer' }).first().click();
    const dialog = page.getByRole('dialog', { name: 'Add customer' });
    await dialog.getByRole('button', { name: 'Save customer' }).click();
    await expect(dialog.getByText('Name is required')).toBeVisible();
    await dialog.getByLabel('Name').fill('Northside Academy');
    await dialog.getByRole('button', { name: 'Save customer' }).click();
    await expect(page.getByText('Customer "Northside Academy" created')).toBeVisible();
    await expect(page.getByRole('cell', { name: 'Northside Academy' })).toBeVisible();
  });

  test('has no WCAG 2.1 AA violations', async ({ page }) => {
    await page.goto('/ops/customers');
    await expect(page.getByRole('table')).toBeVisible();
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();
    expect(results.violations).toEqual([]);
  });

  test('visual snapshot @visual', async ({ page }) => {
    test.skip(!process.env.VISUAL, 'Visual baselines are generated on Linux CI (VISUAL=1).');
    await page.goto('/ops/customers');
    await expect(page.getByRole('table')).toBeVisible();
    await expect(page).toHaveScreenshot('customers.png', {
      fullPage: true,
      maxDiffPixelRatio: 0.01,
    });
  });
});
