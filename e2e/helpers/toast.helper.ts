import type { Locator, Page } from 'playwright'
import { expect } from '@nuxt/test-utils/playwright'
import { timeouts } from '../constants'

export async function expectToastMessage(page: Page, message: string | RegExp) {
  const toast = page.getByRole('status').or(page.locator('[role="alert"]'))
  await expect(toast.filter({ hasText: message }).first()).toBeVisible({
    timeout: timeouts.notification.success,
  })
}

export async function expectElementVisible(page: Page, locator: Locator, timeout = timeouts.ui.elementVisible) {
  await expect(locator).toBeVisible({ timeout })
}

export async function expectHeadingsVisible(page: Page, headings: readonly (string | RegExp)[]) {
  for (const heading of headings) {
    await expect(page.getByRole('heading', { name: heading }).first()).toBeVisible({
      timeout: timeouts.ui.elementVisible,
    })
  }
}

export async function expectTextVisible(page: Page, texts: readonly (string | RegExp)[]) {
  for (const text of texts) {
    await expect(page.getByText(text).first()).toBeVisible({
      timeout: timeouts.ui.elementVisible,
    })
  }
}

export async function inputValueMatches(page: Page, label: string | RegExp, expected: string | RegExp) {
  const input = page.getByLabel(label)
  await expect(input).toHaveValue(expected)
}

export async function comboboxTextMatches(page: Page, name: string | RegExp, expected: string | RegExp) {
  const combobox = page.getByRole('combobox', { name })
  await expect(combobox).toContainText(expected)
}
