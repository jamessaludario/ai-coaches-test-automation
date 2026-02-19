import type {
  ResourceData,
  WorkshopFormData,
} from '@layer-base/e2e/helpers'
import type { Page } from '@playwright/test'
import {
  SCHEDULE_DATA,
  timeouts,
} from '@layer-base/e2e/constants'
import {
  createNuxtGoto,
  createResource,
  createSchedule,
  fillAddressForm,
  fillStripePayment,
  fillWorkshopForm,
  loginAsAdmin,
  loginAsCoach,
  loginUser,
  navigateToCalendarTab,
  navigateToCoachWorkshops,
  navigateToResourcesTab,
  openNewScheduleDialog,
  openWorkshopDialog,
  searchAndSelectWorkshop,
  searchWorkshopInTable,
} from '@layer-base/e2e/helpers'
import { LoginPage } from '@layer-base/e2e/page-objects'
import { escapeRegExp } from '@layer-base/e2e/utils'
import { expect } from '@playwright/test'

/**
 * Workshop Lifecycle Helpers
 *
 * Helper functions for workshop lifecycle integration tests
 */

/**
 * Phase 1: Admin creates workshop
 * Simplified to use shared workshop form helper
 */
export async function adminCreatesWorkshop(
  page: Page,
  workshopData: WorkshopFormData,
  adminBaseUrl: string,
  workshopsRoute: string,
): Promise<string> {
  const goto = createNuxtGoto(page)
  const loginPage = new LoginPage(page)

  await loginAsAdmin(goto, loginPage)
  await page.goto(new URL(workshopsRoute, adminBaseUrl).href)
  await page.waitForLoadState('networkidle')

  // Check if workshop already exists
  const workshopExists = await searchWorkshopInTable(page, workshopData.title)

  if (!workshopExists) {
    await openWorkshopDialog(page)
    await fillWorkshopForm(page, workshopData)
    await searchWorkshopInTable(page, workshopData.title)
  }

  // Click on workshop to verify creation
  await page.getByText(workshopData.title).first().click()
  const escapedTitle = escapeRegExp(workshopData.title)
  await expect(page.getByRole('paragraph').filter({ hasText: new RegExp(`^${escapedTitle}$`) })).toBeVisible()

  return workshopData.title
}

/**
 * Phase 2: Admin adds workshop resource
 */
export async function adminAddsWorkshopResource(
  page: Page,
  resourceData: ResourceData,
): Promise<void> {
  if (!(await navigateToResourcesTab(page))) {
    throw new Error('Failed to navigate to resources tab')
  }

  const resourceLocator = page.getByText(resourceData.title)
  const resourceExists = await resourceLocator.isVisible({ timeout: timeouts.ui.elementVisible }).catch(() => false)

  if (!resourceExists) {
    await page.getByRole('button', { name: /add resource|create resource/i }).click()
    await expect(page.getByRole('dialog', { name: /add.*resource/i })).toBeVisible({ timeout: timeouts.ui.elementVisible })
    await createResource(page, resourceData)
  }

  await expect(page.getByText(resourceData.title)).toBeVisible({ timeout: timeouts.ui.elementVisible })
}

/**
 * Phase 3: Coach schedules workshop
 */
export async function coachSchedulesWorkshop(
  page: Page,
  workshopTitle: string,
): Promise<Date> {
  const loginPage = new LoginPage(page)
  const goto = createNuxtGoto(page)

  await loginAsCoach(goto, loginPage)
  await navigateToCoachWorkshops(page)
  await searchAndSelectWorkshop(page, workshopTitle)
  await navigateToCalendarTab(page)
  await openNewScheduleDialog(page)

  const scheduleStartDate = await createSchedule(page, SCHEDULE_DATA)

  return scheduleStartDate
}

/**
 * Client login and navigate to workshop
 */
export async function clientNavigatesToWorkshop(
  page: Page,
  workshopTitle: string,
  homeRoute: string,
  workshopsPageObject: any,
): Promise<void> {
  const goto = createNuxtGoto(page)
  const loginPage = new LoginPage(page)
  await goto(homeRoute, { waitUntil: 'networkidle' })
  await loginUser(goto, loginPage)

  await workshopsPageObject.navigateToWorkshops()
  await workshopsPageObject.searchWorkshops(workshopTitle)
  await expect(page.getByText(workshopTitle).first()).toBeVisible()
  await workshopsPageObject.clickWorkshopCard(workshopTitle)
}

/**
 * Client selects workshop schedule
 */
export async function clientSelectsSchedule(
  page: Page,
  scheduleStartDate: Date,
  upcomingSessionsHeading: string,
  bookNowButtonText: string,
): Promise<void> {
  const upcomingSessions = page.getByRole('heading', { name: upcomingSessionsHeading })
  await expect(upcomingSessions).toBeVisible({ timeout: timeouts.ui.elementVisible })
  await upcomingSessions.scrollIntoViewIfNeeded()

  const scheduleCards = page.locator('.card').filter({
    has: page.locator('time[datetime]'),
  })
  const cardCount = await scheduleCards.count()
  expect(cardCount).toBeGreaterThan(0)

  let scheduleFound = false
  for (let i = 0; i < cardCount; i++) {
    const card = scheduleCards.nth(i)
    const cardStartDateLocator = card.locator('time[datetime]').nth(0)
    const cardStartDate = await cardStartDateLocator.getAttribute('datetime')
    const cardStartDateDate = new Date(cardStartDate ?? '')

    if (
      cardStartDateDate.getFullYear() === scheduleStartDate.getFullYear()
      && cardStartDateDate.getMonth() === scheduleStartDate.getMonth()
      && cardStartDateDate.getDate() === scheduleStartDate.getDate()
    ) {
      scheduleFound = true
      await card.getByRole('link', { name: bookNowButtonText }).click()
      await page.waitForLoadState('networkidle')
      break
    }
  }

  if (!scheduleFound) {
    throw new Error(`Schedule matching ${scheduleStartDate.toISOString()} not found. Expected date not in available schedules.`)
  }
}

export interface BookingContent {
  steps: string[]
  reviewSection: string[]
  buttons: {
    continueToPayment: string
    confirmBooking: string
  }
  paymentSection: {
    heading: string
    summary: string
  }
  confirmation: {
    heading: string
    paymentStatus: string
    bookingId: string
    manageButton: string
    downloadButton: string
  }
}

/**
 * Client completes booking flow
 */
export async function clientCompletesBooking(
  page: Page,
  bookingContent: BookingContent,
  workshopTitle: string,
  coachName: string,
  escapeRegExp: (str: string) => string,
): Promise<string> {
  // Verify booking sections
  for (const text of [...bookingContent.steps, ...bookingContent.reviewSection]) {
    await expect(page.getByText(text, { exact: true })).toBeVisible({ timeout: timeouts.ui.elementVisible })
  }

  // Fill address
  await fillAddressForm(page)
  await page.getByRole('button', { name: bookingContent.buttons.continueToPayment }).click()

  // Verify payment page
  await expect(page.getByRole('heading', { name: bookingContent.paymentSection.heading })).toBeVisible()
  await expect(page.getByRole('heading', { name: bookingContent.paymentSection.summary })).toBeVisible()

  // Complete payment
  const iframeLocator = page.locator('iframe[name^="__privateStripeFrame"]').first()
  await iframeLocator.waitFor({ timeout: timeouts.ui.elementVisible })
  // Get the frame using elementHandle().contentFrame() to get a real Frame
  const elementHandle = await iframeLocator.elementHandle()
  if (!elementHandle) {
    throw new Error('Stripe iframe element not found')
  }
  try {
    const stripeFrame = await elementHandle.contentFrame()
    if (!stripeFrame) {
      throw new Error('Stripe iframe not found')
    }
    await fillStripePayment(stripeFrame, page)
  }
  finally {
    await elementHandle.dispose()
  }

  // Verify confirmation
  const progressLabel = page.getByLabel('progress')
  await expect(page.getByRole('heading', { name: bookingContent.confirmation.heading })).toBeVisible({ timeout: timeouts.ui.elementVisible })
  await expect(page.getByText(bookingContent.confirmation.paymentStatus)).toBeVisible()
  await expect(page.getByText(bookingContent.confirmation.bookingId)).toBeVisible()
  await expect(progressLabel.getByText(workshopTitle)).toBeVisible()
  await expect(progressLabel.getByText(coachName)).toBeVisible()
  await expect(page.getByRole('link', { name: bookingContent.confirmation.manageButton })).toBeVisible()
  await expect(page.getByRole('button', { name: bookingContent.confirmation.downloadButton })).toBeVisible()

  const idLocator = page.getByText(/ID:/i).first();
  const text = await idLocator.textContent();
  const bookingId = text?.match(/ID:\s*(\S+)/)?.[1];
  expect(bookingId, 'Booking ID is not present in the URL').toBeDefined()
  await expect(page.getByText(new RegExp(escapeRegExp(bookingId!), 'i'))).toBeVisible({ timeout: timeouts.ui.elementVisible })

  await page.getByRole('link', { name: bookingContent.confirmation.manageButton }).click()
  await expect(page.getByText(`Booking ID: ${bookingId}`, { exact: true })).toBeVisible({ timeout: timeouts.ui.elementVisible })

  return bookingId!
}

/**
 * Verify workshop exists in admin
 */
export async function verifyWorkshopInAdmin(
  page: Page,
  workshopTitle: string,
  adminBaseUrl: string,
  workshopsRoute: string,
): Promise<boolean> {
  await page.goto(new URL(workshopsRoute, adminBaseUrl).href)
  await page.waitForLoadState('networkidle')

  const searchBox = page.getByRole('textbox', { name: /search/i })
  await searchBox.fill(workshopTitle)
  await page.keyboard.press('Enter')
  await page.locator('table').or(page.getByRole('status')).first().waitFor({ state: 'visible', timeout: timeouts.ui.elementVisible })

  return await page.getByText(workshopTitle).first().waitFor({ state: 'visible', timeout: timeouts.ui.elementVisible }).then(() => true).catch(() => false)
}
