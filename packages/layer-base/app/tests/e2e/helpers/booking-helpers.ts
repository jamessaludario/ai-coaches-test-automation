import type { Page } from '@playwright/test'
import { expect } from '@playwright/test'
import { BOOKING_DATA, RESOURCE_DATA, SCHEDULE_DATA, timeouts, WORKSHOP_DATA } from '../constants'
import { formatDisplayDate } from '../utils'

export async function navigateToBookingPage(page: Page) {
  await page.getByRole('link', { name: 'Bookings', exact: true }).click()
}

export async function navigateToBookingDetailsPage(page: Page, bookingId: string) {
  await page.getByRole('link', { name: bookingId }).click()
}

export async function navigateToBookingDetailsTab(page: Page) {
  await page.getByRole('tab', { name: 'Details' }).click()
}

export async function navigateToBookingResourcesTab(page: Page) {
  await page.getByRole('tab', { name: 'Resources' }).click()
}

export async function navigateToBookingSeatsTab(page: Page) {
  await page.getByRole('tab', { name: 'Seats' }).click()
}

export async function navigateToBookingPaymentsTab(page: Page) {
  await page.getByRole('tab', { name: 'Payments' }).click()
}

/**
 * Verify full booking information across tabs
 */
export async function verifyWorkshopBooking(
  page: Page,
  scheduleStartDate: Date,
  paymentStatus: string | RegExp,
  coachName: string,
) {
  // Details Tab
  await navigateToBookingDetailsTab(page)
  const totalAmount = WORKSHOP_DATA.price * BOOKING_DATA.numberOfSeats
  await expect(page.getByText(`$${totalAmount}`).first()).toBeVisible({ timeout: timeouts.ui.elementVisible })
  await expect(page.getByText(`${BOOKING_DATA.numberOfSeats}`, { exact: true })).toBeVisible({ timeout: timeouts.ui.elementVisible })
  await expect(page.getByText(SCHEDULE_DATA.level).first()).toBeVisible({ timeout: timeouts.ui.elementVisible })
  await expect(page.getByText(SCHEDULE_DATA.mode).first()).toBeVisible({ timeout: timeouts.ui.elementVisible })

  await expect(page.getByText(formatDisplayDate(scheduleStartDate)).first()).toBeVisible({ timeout: timeouts.ui.elementVisible })
  await expect(page.getByText(coachName).first()).toBeVisible({ timeout: timeouts.ui.elementVisible })
  await expect(page.getByText(SCHEDULE_DATA.country).first()).toBeVisible({ timeout: timeouts.ui.elementVisible })
  await expect(page.getByText('Multiplai Tech Voucher Code').first()).toBeVisible({ timeout: timeouts.ui.elementVisible })

  // Resources Tab
  await navigateToBookingResourcesTab(page)
  await expect(page.getByText(RESOURCE_DATA.title).first()).toBeVisible({ timeout: timeouts.ui.elementVisible })

  // Seats Tab
  await navigateToBookingSeatsTab(page)
  await expect(page.getByRole('table')).toBeVisible({ timeout: timeouts.ui.elementVisible })

  // Payments Tab
  await navigateToBookingPaymentsTab(page)
  await expect(page.getByText(paymentStatus)).toBeVisible({ timeout: timeouts.ui.elementVisible })
}
