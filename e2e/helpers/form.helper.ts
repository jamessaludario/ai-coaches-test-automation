import type { Locator, Page } from 'playwright'
import { BOOKING_DATA, PAYMENT_DATA, timeouts, workshopScheduleContent } from '../constants'
import { expectToastMessage } from './toast.helper'

export async function fillForm(page: Page, fields: Record<string, string>) {
  for (const [label, value] of Object.entries(fields)) {
    const input = page.getByLabel(new RegExp(label, 'i'))
    await input.fill(value)
  }
}

export async function fillFormFields(
  page: Page,
  data: Record<string, string | undefined>,
  labelMap: Record<string, string | RegExp>,
) {
  for (const [key, label] of Object.entries(labelMap)) {
    const value = data[key]
    if (value !== undefined) {
      const input = page.getByLabel(label)
      await input.fill(value)
    }
  }
}

export async function selectDropdownOption(page: Page, dropdownLabel: string | RegExp, optionText: string) {
  const dropdown = page.getByRole('combobox', { name: dropdownLabel })
  await dropdown.click()
  await page.getByRole('option', { name: optionText }).click()
}

export async function isElementVisible(page: Page, locator: Locator): Promise<boolean> {
  return await locator.isVisible().catch(() => false)
}

export async function submitFormAndWaitForSuccess(
  page: Page,
  buttonText: string | RegExp,
  successMessage: string | RegExp,
) {
  const submitButton = page.getByRole('button', { name: buttonText })
  await submitButton.click()
  await expectToastMessage(page, successMessage)
}

export async function fillAddressForm(page: Page, addressData = BOOKING_DATA) {
  await page.getByLabel(/unit.*number/i).fill(addressData.unitNumber)
  await page.getByLabel(/address.*line.*1/i).fill(addressData.addressLine1)
  await page.getByLabel(/address.*line.*2/i).fill(addressData.addressLine2)
  await page.getByLabel(/city/i).fill(addressData.city)
  await page.getByLabel(/state/i).fill(addressData.state)
  await page.getByLabel(/zip/i).fill(addressData.zip)
}

export async function fillStripePayment(page: Page, paymentInfo = PAYMENT_DATA.validCard) {
  const stripeFrame = page.frameLocator('iframe[name*="__privateStripeFrame"]').first()
  await stripeFrame.locator('[name="cardnumber"]').fill(paymentInfo.number)
  await stripeFrame.locator('[name="exp-date"]').fill(paymentInfo.expiry)
  await stripeFrame.locator('[name="cvc"]').fill(paymentInfo.cvc)
}

export async function waitForModalOpen(page: Page, headingText: string | RegExp) {
  await page.getByRole('heading', { name: headingText }).waitFor({
    state: 'visible',
    timeout: timeouts.ui.modalOpen,
  })
}

export async function waitForModalClose(page: Page) {
  await page.getByRole('dialog').waitFor({
    state: 'hidden',
    timeout: timeouts.ui.modalClose,
  })
}

export async function confirmDelete(page: Page, confirmText: string | RegExp = /confirm|delete|yes/i) {
  const confirmButton = page.getByRole('button', { name: confirmText })
  await confirmButton.click()
}

export async function hasNoWorkshopsFound(page: Page): Promise<boolean> {
  return await page.getByText(workshopScheduleContent.noWorkshopsFound).isVisible().catch(() => false)
}

export async function getVisibleCards(page: Page, selector: string): Promise<Locator[]> {
  const cards = await page.locator(selector).all()
  const visibilityChecks = await Promise.all(
    cards.map(card => card.isVisible().catch(() => false)),
  )
  return cards.filter((_, index) => visibilityChecks[index])
}

export function getLoadingIndicators(page: Page): Locator[] {
  return [
    page.getByText('Loading...'),
    page.getByRole('progressbar'),
    page.locator('[data-loading="true"]'),
    page.locator('.loading'),
  ]
}

export async function waitForLoadingHidden(page: Page, timeout = timeouts.ui.elementHidden) {
  const indicators = getLoadingIndicators(page)
  for (const indicator of indicators) {
    try {
      const isVisible = await indicator.isVisible().catch(() => false)
      if (isVisible) {
        await indicator.waitFor({ state: 'hidden', timeout })
      }
    }
    catch { /* loading already hidden */ }
  }
}

export async function waitForCardsToRefresh(page: Page, selector: string, timeout = timeouts.api.cardLoad) {
  try {
    await page.locator(selector).first().waitFor({ state: 'visible', timeout })
  }
  catch {
    /* no cards visible yet */
  }
  await waitForLoadingHidden(page, timeout)
}

export async function waitForCardsToLoad(page: Page, selector: string, timeout = timeouts.api.cardLoad) {
  await page.locator(selector).first().waitFor({ state: 'visible', timeout })
}

export async function selectFirstIfMultiple(locator: Locator): Promise<Locator> {
  const count = await locator.count()
  return count > 1 ? locator.first() : locator
}
