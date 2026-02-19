import type { Page } from 'playwright'
import { expect } from '@nuxt/test-utils/playwright'
import { dashboardContent, timeouts } from '../constants'
import { waitForDataTableLoad } from '../helpers'

/**
 * Client Page Assertions
 */

// Bookings Page
export async function expectClientBookingsPageLoaded(page: Page) {
  await expect(page.getByRole('heading', { name: 'Bookings', exact: true }))
    .toBeVisible({ timeout: timeouts.page.pageLoad })
}

export async function expectClientBookingsVisible(page: Page, searchQuery?: string) {
  await waitForDataTableLoad(page, searchQuery)
}

// Workshops Page
export async function expectClientWorkshopsPageLoaded(page: Page) {
  await expect(page.getByRole('heading', { name: /Workshops/i }))
    .toBeVisible({ timeout: timeouts.page.pageLoad })
}

export async function expectClientWorkshopVisible(page: Page, workshopName: string) {
  await waitForDataTableLoad(page, workshopName)
}

export async function expectClientWorkshopTableVisible(page: Page) {
  const dataTable = page.getByRole('table')
  const emptyState = page.getByText(/No workshops|No results/i)

  // Use .or() to handle either state without race condition
  await expect(dataTable.or(emptyState)).toBeVisible()
}

// Account Page
export async function expectClientAccountPageLoaded(page: Page) {
  await expect(page.getByRole('heading', { name: /profile|account/i }))
    .toBeVisible({ timeout: timeouts.page.pageLoad })
}

export async function expectClientAccountFieldsVisible(page: Page) {
  await expect(page.getByLabel(/username/i)).toBeVisible({ timeout: timeouts.ui.elementVisible })
  await expect(page.getByLabel(/email/i)).toBeVisible({ timeout: timeouts.ui.elementVisible })
}

export async function expectClientAccountSaveSuccess(page: Page) {
  await expect(page.getByText(/saved|updated.*successfully/i))
    .toBeVisible({ timeout: timeouts.notification.success })
}

// Dashboard Page
export async function expectClientDashboardVisible(page: Page, welcomeMessage: string | RegExp) {
  await expect(page.getByRole('heading', { name: /dashboard/i }))
    .toBeVisible({ timeout: timeouts.page.pageLoad })
  await expect(page.getByText(welcomeMessage))
    .toBeVisible({ timeout: timeouts.page.pageLoad })
}

// Shared section visibility helper
async function expectClientSectionVisible(page: Page, name: string) {
  await expect(page.getByRole('heading', { name, exact: true }))
    .toBeVisible({ timeout: timeouts.page.pageLoad })
}

export async function expectClientWorkshopsSectionVisible(page: Page) {
  await expectClientSectionVisible(page, 'Workshops')
}

export async function expectClientBookingsSectionVisible(page: Page) {
  await expectClientSectionVisible(page, 'Bookings')
}

export async function expectClientDashboardElements(page: Page, patterns: readonly (string | RegExp)[]) {
  for (const pattern of patterns) {
    await expect(page.getByText(pattern).first()).toBeVisible({ timeout: timeouts.ui.elementVisible })
  }
}

export async function expectClientMetricsVisible(page: Page, metrics: readonly (string | RegExp)[]) {
  for (const metric of metrics) {
    await expect(page.getByText(metric).first()).toBeVisible({ timeout: timeouts.ui.elementVisible })
  }
}

// Booking Details Page
export async function expectClientBookingDetailsVisible(page: Page) {
  await expect(page.getByText(/booking.*id/i).first()).toBeVisible({ timeout: timeouts.page.pageLoad })
  await expect(page.getByRole('heading', { level: 1 }).first()).toBeVisible({ timeout: timeouts.ui.elementVisible })
}

export async function expectClientBookingPaymentVisible(page: Page) {
  await expect(page.getByText(/payment.*summary|total.*amount/i))
    .toBeVisible({ timeout: timeouts.ui.elementVisible })
}

export async function expectClientBookingTabsVisible(page: Page) {
  await expect(page.getByRole('tab', { name: /details/i }))
    .toBeVisible({ timeout: timeouts.ui.elementVisible })
}

// Workshop Details Page
export async function expectClientWorkshopOverviewVisible(page: Page) {
  await expect(page.getByRole('heading', { level: 1 }))
    .toBeVisible({ timeout: timeouts.page.pageLoad })
}

export async function expectClientWorkshopMetricsVisible(page: Page) {
  const metrics = dashboardContent.client.workshopMetrics

  for (const metric of metrics) {
    await expect(page.getByText(metric).first()).toBeVisible({ timeout: timeouts.ui.elementVisible })
  }
}

export async function expectClientWorkshopTabsVisible(page: Page) {
  await expect(page.getByRole('tab', { name: /overview/i }))
    .toBeVisible({ timeout: timeouts.ui.elementVisible })
}
