import type { Locator, Page } from 'playwright'
import { expect } from '@nuxt/test-utils/playwright'

/**
 * Shared Assertion Helpers
 *
 * Reusable assertion functions for page objects and tests.
 * Organized by assertion type for easy navigation.
 */

// =============================================================================
// PAGE-LEVEL ASSERTIONS
// =============================================================================

/**
 * Assert that a toast message appears and then disappears
 */
export async function expectToastMessage(
  page: Page,
  message: string | RegExp,
  timeout = 5000,
) {
  const toast = page.getByRole('alert').locator('.toast-title').filter({ hasText: message })
  await expect(toast).toBeVisible({ timeout })
  await expect(toast).toBeHidden({ timeout: timeout * 2 })
}

/**
 * Assert that an element is visible within a specified timeout
 */
export async function expectElementVisible(
  page: Page,
  selector: string | RegExp | Locator,
  options: { timeout?: number, name?: string | RegExp, exact?: boolean } = {},
) {
  const { timeout = 10000, name } = options
  let locator: Locator

  if (typeof selector === 'string') {
    locator = page.locator(selector)
  }
  else if (selector instanceof RegExp) {
    locator = page.getByText(selector, { exact: options.exact })
  }
  else {
    locator = selector
  }

  if (name !== undefined) {
    locator = locator.filter({ hasText: name })
  }

  await expect(locator).toBeVisible({ timeout })
}

/**
 * Assert that multiple headings are visible on the page
 */
export async function expectHeadingsVisible(
  page: Page,
  headings: readonly (string | RegExp)[],
  options: { timeout?: number, strict?: boolean } = {},
) {
  const { timeout = 10000, strict = false } = options

  for (const heading of headings) {
    const headingLocator = page.getByRole('heading', { name: heading })
    const textLocator = page.getByText(heading, { exact: true })
    const element = strict ? headingLocator : headingLocator.or(textLocator)

    try {
      await expect(element).toBeVisible({ timeout })
    }
    catch (error) {
      throw new Error(`Heading not found: ${heading}. Original error: ${(error as Error).message}`)
    }
  }
}

/**
 * Assert that multiple text elements are visible on the page
 */
export async function expectTextVisible(
  page: Page,
  texts: readonly (string | RegExp)[],
  options: { timeout?: number } = {},
) {
  const { timeout = 10000 } = options

  for (const text of texts) {
    await expect(page.getByText(text)).toBeVisible({ timeout })
  }
}

// =============================================================================
// VALUE MATCHING HELPERS (returns boolean, not assertion)
// =============================================================================

/**
 * Check if input value matches expected value (returns boolean)
 */
export async function inputValueMatches(locator: Locator, expected?: string): Promise<boolean> {
  if (expected === undefined)
    return true
  if (await locator.count() === 0)
    return false
  const value = await locator.inputValue()
  return value.includes(expected)
}

/**
 * Check if combobox text matches expected value (returns boolean)
 */
export async function comboboxTextMatches(combobox: Locator, expected?: string): Promise<boolean> {
  if (expected === undefined)
    return true
  const selectValue = combobox.locator('span.select-value')
  if (await selectValue.count() === 0)
    return false
  const value = await selectValue.textContent()
  return value?.toLowerCase() === expected.toLowerCase()
}
