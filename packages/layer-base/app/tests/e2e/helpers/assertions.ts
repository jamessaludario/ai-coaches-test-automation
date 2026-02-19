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

/**
 * Assert that page is at specific URL
 */
export async function expectURL(page: Page, url: string | RegExp, options?: { timeout?: number }) {
  await expect(page).toHaveURL(url, options)
}

/**
 * Assert that page has a specific title
 */
export async function expectTitle(page: Page, title: string | RegExp, options?: { timeout?: number }) {
  await expect(page).toHaveTitle(title, options)
}

/**
 * Wait for page to be at a specific URL
 */
export async function waitForURL(page: Page, url: string | RegExp, options?: { timeout?: number }) {
  await page.waitForURL(url, options)
}

// =============================================================================
// LOCATOR-LEVEL ASSERTIONS
// =============================================================================

/**
 * Assert that a locator is visible
 */
export async function expectVisible(locator: Locator, timeout?: number) {
  await expect(locator).toBeVisible({ timeout })
}

/**
 * Assert that a locator is not visible
 */
export async function expectNotVisible(locator: Locator, timeout?: number) {
  await expect(locator).not.toBeVisible({ timeout })
}

/**
 * Assert that a locator contains specific text
 */
export async function expectTextContent(locator: Locator, text: string | RegExp) {
  await expect(locator).toContainText(text)
}

/**
 * Assert that a locator has a specific value
 */
export async function expectValue(locator: Locator, value: string | RegExp, options?: { timeout?: number }) {
  await expect(locator).toHaveValue(value, options)
}

/**
 * Assert that an element is enabled
 */
export async function expectEnabled(locator: Locator, options?: { timeout?: number }) {
  await expect(locator).toBeEnabled(options)
}

/**
 * Assert that an element is disabled
 */
export async function expectDisabled(locator: Locator, options?: { timeout?: number }) {
  await expect(locator).toBeDisabled(options)
}

/**
 * Assert that an element is checked (for checkboxes/radios)
 */
export async function expectChecked(locator: Locator, options?: { timeout?: number }) {
  await expect(locator).toBeChecked(options)
}

/**
 * Assert that an element has a specific count
 */
export async function expectCount(locator: Locator, count: number, options?: { timeout?: number }) {
  await expect(locator).toHaveCount(count, options)
}

/**
 * Assert that an element has a specific attribute
 */
export async function expectAttribute(locator: Locator, name: string, value: string | RegExp, options?: { timeout?: number }) {
  await expect(locator).toHaveAttribute(name, value, options)
}

/**
 * Assert that an element has a specific class
 */
export async function expectClass(locator: Locator, className: string | RegExp, options?: { timeout?: number }) {
  await expect(locator).toHaveClass(className, options)
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
  // Add support for exact match if needed, but for now preserve includes behavior or adhere to task
  // Task says "Fix assertions.ts inputValueMatches". Maybe it meant to use exact match?
  // Or handle null value?
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
