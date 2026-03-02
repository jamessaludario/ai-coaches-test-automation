import type { Page } from 'playwright'
import { timeouts } from '../constants'

export async function waitForDialogOpen(page: Page, headingText: string | RegExp) {
  await page.getByRole('heading', { name: headingText }).waitFor({
    state: 'visible',
    timeout: timeouts.ui.modalOpen,
  })
}

export async function waitForDialogClose(page: Page) {
  await page.getByRole('dialog').waitFor({
    state: 'hidden',
    timeout: timeouts.ui.modalClose,
  })
}

export async function confirmDialog(page: Page, buttonText: string | RegExp = /confirm|yes|ok/i) {
  const confirmButton = page.getByRole('button', { name: buttonText })
  await confirmButton.click()
}

export async function cancelDialog(page: Page) {
  const cancelButton = page.getByRole('button', { name: /cancel|close/i })
  await cancelButton.click()
  await waitForDialogClose(page)
}

export async function isDialogOpen(page: Page): Promise<boolean> {
  return await page.getByRole('dialog').isVisible().catch(() => false)
}

export async function getDialogContent(page: Page): Promise<string | null> {
  const dialog = page.getByRole('dialog')
  const isVisible = await dialog.isVisible().catch(() => false)
  if (!isVisible) return null
  return await dialog.textContent()
}
