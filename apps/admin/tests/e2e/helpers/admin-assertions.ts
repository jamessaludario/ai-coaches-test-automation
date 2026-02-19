import type { Page } from 'playwright'
import { expect } from '@nuxt/test-utils/playwright'
import { adminRoutes, adminSelectors, timeouts } from '../constants'
import { searchWorkshopInTable, waitForDataTableLoad } from '../helpers'
import { escapeRegExp } from '../utils'

/**
 * Admin Page Assertions
 */

// =============================================================================
// DASHBOARD ASSERTIONS
// =============================================================================

export async function expectDashboardPageLoaded(page: Page) {
  // await page.waitForLoadState('networkidle') // Flaky
  await expect(page.getByRole('heading', { name: adminSelectors.dashboard.heading }))
    .toBeVisible({ timeout: timeouts.page.pageLoad })
  await expect(page.getByText(adminSelectors.dashboard.welcomeMessage))
    .toBeVisible({ timeout: timeouts.page.pageLoad })
}

export async function expectMetricsVisible(page: Page) {
  const cardMetrics = page.locator('div[data-slot="card"]')
  await Promise.all(
    Object.values(adminSelectors.dashboard.metrics).map(metric =>
      expect(cardMetrics.filter({ hasText: metric }))
        .toBeVisible({ timeout: timeouts.api.dataTableLoad }),
    ),
  )
}

export async function expectCalendarVisible(page: Page) {
  await Promise.all(
    adminSelectors.dashboard.calendar.days.map(day =>
      expect(page.getByText(day, { exact: true })).toBeVisible({ timeout: timeouts.api.dataTableLoad }),
    ),
  )
}

// =============================================================================
// VOUCHERS ASSERTIONS
// =============================================================================

export async function expectVouchersPageLoaded(page: Page) {
  await expect(page.getByRole('heading', { name: adminSelectors.vouchers.heading }))
    .toBeVisible({ timeout: timeouts.page.pageLoad })
  await waitForDataTableLoad(page)
}

export async function expectVoucherInTable(page: Page, voucherCode: string | RegExp, options?: { count?: number }) {
  const { count = 1 } = options || {}
  const cell = page.getByRole('cell', { name: voucherCode, exact: true })
  await expect(cell).toHaveCount(count, { timeout: timeouts.api.dataTableLoad })
  if (count > 0) {
    await expect(cell.first()).toBeVisible({ timeout: timeouts.api.dataTableLoad })
  }
}

export async function expectVoucherCreateFormOpen(page: Page) {
  await expect(page.getByRole('heading', { name: adminSelectors.dialogs.voucherFormDialog }))
    .toBeVisible({ timeout: timeouts.ui.modalOpen })
}

// =============================================================================
// BOOKINGS ASSERTIONS
// =============================================================================

export async function expectBookingsPageLoaded(page: Page) {
  await expect(page.getByRole('heading', { name: adminSelectors.bookings.heading }))
    .toBeVisible({ timeout: timeouts.page.pageLoad })
  await waitForDataTableLoad(page)
}

export async function expectBookingDetailPageLoaded(page: Page, bookingId: string) {
  const escapedBookingId = escapeRegExp(bookingId)
  const pattern = `${adminSelectors.bookings.detailHeading}\\s*${escapedBookingId}`
  await page.waitForURL(adminRoutes.bookingDetail(bookingId), { timeout: timeouts.page.navigation })
  await expect(page.getByText(new RegExp(pattern, 'i'))).toBeVisible({ timeout: timeouts.page.pageLoad })
}

export async function expectBookingDetailsTabVisible(page: Page, bookingWorkshop: string) {
  await expect(page.getByRole('tab', { name: adminSelectors.bookings.tabs.details }))
    .toBeVisible({ timeout: timeouts.api.dataTableLoad })
  await expect(page.getByRole('heading', { name: bookingWorkshop }).nth(1))
    .toBeVisible({ timeout: timeouts.page.pageLoad })
}

export async function expectBookingSeatsTabVisible(page: Page) {
  await expect(page.getByRole('tab', { name: adminSelectors.bookings.tabs.seats }))
    .toBeVisible({ timeout: timeouts.api.dataTableLoad })
  await expect(page.getByRole('heading', { name: adminSelectors.bookings.headings.seats }))
    .toBeVisible({ timeout: timeouts.page.pageLoad })
}

export async function expectBookingPaymentsTabVisible(page: Page) {
  await expect(page.getByRole('tab', { name: adminSelectors.bookings.tabs.payments }))
    .toBeVisible({ timeout: timeouts.api.dataTableLoad })
  await expect(page.getByRole('heading', { name: adminSelectors.bookings.headings.payments }))
    .toBeVisible({ timeout: timeouts.page.pageLoad })
}

// =============================================================================
// USERS ASSERTIONS
// =============================================================================

export async function expectUsersPageLoaded(page: Page) {
  await expect(page.getByRole('heading', { name: adminSelectors.users.heading }))
    .toBeVisible({ timeout: timeouts.page.pageLoad })
  await waitForDataTableLoad(page)
}

export async function expectUserInTable(page: Page, cellText: string | RegExp, options?: { count?: number }) {
  const exact = typeof cellText === 'string'
  const { count = 1 } = options || {}
  const cell = page.getByRole('cell', { name: cellText, exact })
  await expect(cell).toHaveCount(count, { timeout: timeouts.api.dataTableLoad })
  if (count > 0) {
    await expect(cell.first()).toBeVisible({ timeout: timeouts.api.dataTableLoad })
  }
}

export async function expectUserCreateFormOpen(page: Page) {
  await expect(page.getByRole('heading', { name: /(Create|Add).*User/i }))
    .toBeVisible({ timeout: timeouts.ui.modalOpen })
}

export async function expectUserDetailTabsVisible(page: Page) {
  const tablist = page.getByRole('tablist')
  await expect(tablist).toBeVisible({ timeout: timeouts.page.pageLoad })

  const tabs = [
    adminSelectors.users.tabs.details,
    adminSelectors.users.tabs.coachProfile,
    adminSelectors.users.tabs.workshops,
    adminSelectors.users.tabs.payouts,
  ]

  await Promise.all(
    tabs.map(tab =>
      expect(page.getByRole('tab', { name: tab }))
        .toBeVisible({ timeout: timeouts.ui.elementVisible }),
    ),
  )
}

export async function expectUserDetailPageLoaded(page: Page, userName?: string | RegExp) {
  await page.waitForURL(adminRoutes.usersRouteRegex, { timeout: timeouts.page.navigation })
  if (userName) {
    await expect(page.getByRole('textbox', { name: adminSelectors.forms.username }))
      .toHaveValue(userName, { timeout: timeouts.page.pageLoad })
  }
}

// =============================================================================
// WORKSHOPS ASSERTIONS
// =============================================================================

export async function expectWorkshopsPageLoaded(page: Page) {
  await expect(page.getByRole('heading', { name: adminSelectors.workshops.heading }))
    .toBeVisible({ timeout: timeouts.page.pageLoad })
  await waitForDataTableLoad(page)
}

export async function expectWorkshopInTable(page: Page, workshopName: string | RegExp) {
  const matchingRow = page.getByRole('row').filter({ hasText: workshopName })
  await expect(matchingRow.first()).toBeVisible({ timeout: timeouts.api.dataTableLoad })
}

export async function expectWorkshopDetailPageLoaded(page: Page, workshopName: string) {
  await page.waitForURL(adminRoutes.workshopsRouteRegex, { timeout: timeouts.page.navigation })
  await expect(page.getByRole('heading', { name: workshopName }))
    .toBeVisible({ timeout: timeouts.page.pageLoad })
}

export async function expectOverviewTabVisible(page: Page) {
  await expect(page.getByRole('heading', {
    name: adminSelectors.workshops.tabHeadings.overview,
  })).toBeVisible({ timeout: timeouts.page.pageLoad })
}

export async function expectCalendarTabVisible(page: Page) {
  await expect(page.getByRole('heading', {
    name: adminSelectors.workshops.tabHeadings.calendar,
  })).toBeVisible({ timeout: timeouts.page.pageLoad })
}

export async function expectResourcesTabVisible(page: Page) {
  await expect(page.getByRole('heading', {
    name: adminSelectors.workshops.tabHeadings.resources,
  })).toBeVisible({ timeout: timeouts.page.pageLoad })
}

export async function expectWorkshopCreated(page: Page, workshopTitle: string) {
  await searchWorkshopInTable(page, workshopTitle)
  await expectWorkshopInTable(page, workshopTitle)
}
