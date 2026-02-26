import type { Page } from 'playwright'
import { expect } from '@nuxt/test-utils/playwright'
import { dashboardContent, timeouts } from '../constants'

/**
 * Coach Page Assertions
 *
 * Reusable assertion functions for web coach pages.
 */
export async function expectCoachProfileSectionsVisible(page: Page) {
  const sections = [
    page.getByRole('heading', { name: /introduction.*video/i }),
    page.getByRole('heading', { name: /avatar/i }),
    page.getByRole('heading', { name: /display.*name/i }),
    page.getByRole('heading', { name: /headline/i }),
    page.getByRole('heading', { name: /bio/i }),
    page.getByRole('heading', { name: /certifications/i }),
    page.getByRole('heading', { name: /experience/i }),
    page.getByRole('heading', { name: /specializations/i }),
    page.getByRole('heading', { name: /social.*platforms/i }),
    page.getByRole('heading', { name: /username/i }),
    page.getByRole('heading', { name: /email/i }),
    page.getByRole('heading', { name: /phone.*number/i }),
    page.getByRole('heading', { name: /country/i }),
  ]

  for (const section of sections) {
    await expect(section.first()).toBeVisible({ timeout: timeouts.ui.elementVisible })
  }
}

export async function expectCoachBasicFieldsVisible(page: Page) {
  await expect(page.getByLabel(/username/i)).toBeVisible({ timeout: timeouts.ui.elementVisible })
  await expect(page.getByLabel(/email/i)).toBeVisible({ timeout: timeouts.ui.elementVisible })
}

export async function expectCoachProfileSaveSuccess(page: Page) {
  await expect(page.getByText(/saved|updated.*successfully/i))
    .toBeVisible({ timeout: timeouts.ui.elementVisible })
}

// Coach Dashboard Page
export async function expectCoachDashboardVisible(page: Page) {
  await expect(page.getByRole('heading', { name: dashboardContent.coach.heading }))
    .toBeVisible({ timeout: timeouts.page.pageLoad })
}

export async function expectCoachWorkshopsSectionVisible(page: Page) {
  await expect(page.getByRole('heading', { name: dashboardContent.coach.navigation.workshops.text, exact: true }))
    .toBeVisible({ timeout: timeouts.page.pageLoad })
}

export async function expectCoachBookingsSectionVisible(page: Page) {
  await expect(page.getByRole('heading', { name: dashboardContent.coach.navigation.bookings.text, exact: true }))
    .toBeVisible({ timeout: timeouts.page.pageLoad })
}

export async function expectCoachAccountProfileVisible(page: Page) {
  await expect(page.getByRole('link', { name: dashboardContent.coach.navigation.account.text }))
    .toBeVisible({ timeout: timeouts.ui.elementVisible })
}

export async function expectCoachMetricsVisible(page: Page, metrics: typeof dashboardContent.coach.metrics) {
  for (const metric of metrics) {
    await expect(page.locator('h3').filter({ hasText: metric }))
      .toBeVisible({ timeout: timeouts.ui.elementVisible })
  }
}

async function expectCoachSection(page: Page, sectionKey: keyof typeof dashboardContent.coach.sections, emptyStateKey: keyof typeof dashboardContent.coach.emptyStates) {
  const headingText = dashboardContent.coach.sections[sectionKey]
  const sectionHeading = page.getByRole('heading', { name: headingText })
  await expect(sectionHeading).toBeVisible({ timeout: timeouts.page.pageLoad })

  const cards = page.locator('div.card').filter({
    has: page.getByRole('heading', { name: headingText }),
  })

  const items = cards.locator('.flex.items-center.gap-4.p-4').filter({
    has: page.locator('time[datetime]'),
  })
  const itemCount = await items.count()

  if (itemCount > 0) {
    for (const item of await items.all()) {
      await expect(item).toBeVisible()
      await expect(item.locator('time[datetime]').first()).toBeVisible()
    }
  }
  else {
    await expect(page.getByText(dashboardContent.coach.emptyStates[emptyStateKey])).toBeVisible()
  }
}

export async function expectCoachUpcomingSessionsSection(page: Page) {
  await expectCoachSection(page, 'upcomingSessions', 'noSessions')
}

export async function expectCoachRecentBookingsSection(page: Page) {
  await expectCoachSection(page, 'recentBookings', 'noBookings')
}

export async function expectCoachAccountProfileSectionsVisible(page: Page) {
  for (const section of Object.values(dashboardContent.coach.accountProfileSections)) {
    await expect(page.getByRole('heading', { name: section }))
      .toBeVisible({ timeout: timeouts.ui.elementVisible })
  }
}

// Coach Booking Details Page
export async function expectCoachBookingDetailsVisible(page: Page) {
  await expect(page.getByText(/booking.*id/i).first()).toBeVisible({ timeout: timeouts.page.pageLoad })
  await expect(page.getByRole('heading', { level: 1 }).first()).toBeVisible({ timeout: timeouts.ui.elementVisible })
}

export async function expectCoachBookingPaymentVisible(page: Page) {
  await expect(page.getByText(/payment.*summary|total.*amount/i))
    .toBeVisible({ timeout: timeouts.ui.elementVisible })
}

export async function expectCoachBookingTabsVisible(page: Page) {
  await expect(page.getByRole('tab', { name: /details/i }))
    .toBeVisible({ timeout: timeouts.ui.elementVisible })
}

export async function expectCoachBookingInfoVisible(page: Page) {
  await expect(page.locator('span.badge', { hasText: /completed|confirmed|pending|cancelled/i }))
    .toBeVisible({ timeout: timeouts.ui.elementVisible })
}

// Coach Workshop Details Page
export async function expectCoachWorkshopOverviewVisible(page: Page) {
  await expect(page.getByRole('heading', { level: 1 }))
    .toBeVisible({ timeout: timeouts.page.pageLoad })
}

export async function expectCoachWorkshopMetricsVisible(page: Page) {
  const metrics = [
    page.getByText(/total.*sessions/i),
    page.getByText(/total.*participants/i),
    page.getByText(/total.*bookings/i),
    page.getByText(/total.*revenue/i),
  ]

  for (const metric of metrics) {
    await expect(metric).toBeVisible({ timeout: timeouts.ui.elementVisible })
  }
}
export async function expectCoachWorkshopTabsVisible(page: Page) {
  await expect(page.getByRole('tab', { name: /overview/i }))
    .toBeVisible({ timeout: timeouts.ui.elementVisible })
}

// Coach Workshop Schedule Page
export async function expectCoachWorkshopSchedulePageLoaded(page: Page) {
  await expect(page.getByRole('heading', { name: /workshop.*schedules|schedules/i }))
    .toBeVisible({ timeout: timeouts.page.pageLoad })
}

export async function expectCoachScheduleOverviewVisible(page: Page) {
  await expect(page.getByRole('heading', { level: 1 }))
    .toBeVisible({ timeout: timeouts.page.pageLoad })
}

export async function expectCoachScheduleMetricsVisible(page: Page) {
  const metrics = [
    page.getByText(/total.*seats.*booked|seats.*booked/i),
    page.getByText(/total.*bookings/i),
    page.getByText(/total.*revenue/i),
  ]

  let visibleCount = 0
  for (const metric of metrics) {
    const isVisible = await metric.isVisible().catch(() => false)
    if (isVisible) {
      visibleCount++
      await expect(metric.first()).toBeVisible()
    }
  }

  expect(visibleCount).toBeGreaterThan(0)
}

export async function expectCoachScheduleTabsVisible(page: Page) {
  await expect(page.getByRole('tab', { name: /overview/i }))
    .toBeVisible({ timeout: timeouts.ui.elementVisible })
}

export async function expectCoachScheduleDetailsVisible(page: Page) {
  const scheduleDetails = page.locator('div.card').filter({ hasText: /schedule.*details/i })
  const capacityInfo = page.locator('div.card').filter({ hasText: /capacity|max.*participants|available.*seats/i })

  const isDetailsVisible = await scheduleDetails.isVisible({ timeout: timeouts.ui.elementVisible }).catch(() => false)
  const isCapacityVisible = await capacityInfo.isVisible({ timeout: timeouts.ui.elementVisible }).catch(() => false)

  expect(isDetailsVisible || isCapacityVisible).toBe(true)
}
