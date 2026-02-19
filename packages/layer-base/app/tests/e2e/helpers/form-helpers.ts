import type { Page } from 'playwright'
import { BOOKING_DATA, PAYMENT_DATA, timeouts } from '../constants'
import { expectToastMessage } from './assertions'

/**
 * Shared Form Helpers
 *
 * Generic form interaction helpers that can be used across all test modules
 */

/**
 * Fill form fields using exact label matching
 * Simple helper for basic form filling
 */
export async function fillForm(
  page: Page,
  fields: Record<string, string>,
) {
  for (const [label, value] of Object.entries(fields)) {
    await page.getByLabel(label, { exact: true }).fill(value)
  }
}

/**
 * Fill form fields using a label-to-selector mapping
 * More flexible helper for complex forms with regex/partial matching
 */
export async function fillFormFields(
  page: Page,
  fields: Record<string, string | undefined>,
  labelMap: Record<string, string | RegExp>,
) {
  for (const [label, value] of Object.entries(fields)) {
    if (value === undefined) {
      continue
    }

    if (!(label in labelMap)) {
      const validKeys = Object.keys(labelMap).join(', ')
      throw new Error(`Invalid form label: "${label}". Valid labels are: ${validKeys}`)
    }

    const selector = labelMap[label as keyof typeof labelMap]
    const input = page.getByLabel(selector)
    await input.fill(value)
  }
}

/**
 * Select an option from a dropdown (combobox)
 */
export async function selectDropdownOption(
  page: Page,
  dropdownLabel: string | RegExp,
  optionText: string,
  timeout: number = 10000,
) {
  const dropdown = page.getByRole('combobox', { name: dropdownLabel })
  await dropdown.click()

  const option = page.getByRole('option', { name: optionText })
  await option.waitFor({ state: 'visible', timeout })
  await option.click()
}

/**
 * Check if an element is visible (returns boolean instead of throwing)
 */
export async function isElementVisible(
  page: Page,
  roleOrTestId: string,
  roleType?: 'button' | 'link' | 'heading' | 'textbox' | 'checkbox' | 'radio' | 'combobox',
): Promise<boolean> {
  if (roleType) {
    return await page.getByRole(roleType, { name: roleOrTestId }).isVisible().catch(() => false)
  }
  return await page.getByTestId(roleOrTestId).isVisible().catch(() => false)
}

/**
 * Submit a form by clicking a button and waiting for a success toast
 */
export async function submitFormAndWaitForSuccess(
  page: Page,
  buttonName: string | RegExp,
  successMessage: string | RegExp,
) {
  await page.getByRole('button', { name: buttonName }).click()
  await expectToastMessage(page, successMessage)
}

/**
 * Fill standard address form
 */
export async function fillAddressForm(page: Page, data: typeof BOOKING_DATA = BOOKING_DATA) {
  await page.locator('#una-form-v-1-13-form-item').fill(data.unitNumber)
  await page.getByRole('textbox', { name: 'Address Line 1' }).fill(data.addressLine1)
  await page.getByRole('textbox', { name: 'Address Line 2' }).fill(data.addressLine2)
  await page.getByRole('textbox', { name: 'City/Town' }).fill(data.city)
  await page.getByRole('textbox', { name: 'State' }).fill(data.state)
  await page.getByRole('textbox', { name: 'Zip' }).fill(data.zip)
}

/**
 * Fill Stripe payment (Test Mode)
 */
export async function fillStripePayment(frame: any, page: Page, data: typeof PAYMENT_DATA.validCard = PAYMENT_DATA.validCard) {
  await frame.getByRole('textbox', { name: 'Credit or debit card number' }).fill(data.number)
  await frame.getByRole('textbox', { name: 'Credit or debit card expiration date' }).fill(data.expiry)
  await frame.getByRole('textbox', { name: 'Credit or debit card CVC/CVV' }).fill(data.cvc)
  await page.getByRole('button', { name: /Pay \$/i }).click()
}
/**
 * Wait for a modal (dialog) to open and become visible
 */
export async function waitForModalOpen(page: Page, modalTitle?: string | RegExp) {
  const dialog = modalTitle !== undefined ? page.getByRole('dialog', { name: modalTitle }) : page.getByRole('dialog')
  await dialog.waitFor({ state: 'visible', timeout: timeouts.ui.modalOpen })
}

/**
 * Wait for a modal (dialog) to close and become hidden
 */
export async function waitForModalClose(page: Page) {
  await page.getByRole('dialog').waitFor({ state: 'hidden', timeout: timeouts.ui.modalClose })
}

/**
 * Confirm a deletion by clicking a delete/confirm button
 */
export async function confirmDelete(page: Page) {
  await page.getByRole('button', { name: /delete|confirm/i }).click()
}
