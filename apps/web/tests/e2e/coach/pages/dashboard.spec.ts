import { dashboardContent, timeouts } from '../../constants'
import { cleanupAuthFile, test } from '../../fixtures'
import {
  expectCoachAccountProfileSectionsVisible,
  expectCoachBookingsSectionVisible,
  expectCoachDashboardVisible,
  expectCoachMetricsVisible,
  expectCoachWorkshopsSectionVisible,
} from '../../helpers'
import { CoachDashboardPage } from '../../page-objects'

/**
 * Coach Dashboard - Page Tests
 *
 * Tests coach dashboard workflows and navigation
 */

test.describe('Coach Dashboard', () => {
  test.setTimeout(timeouts.workflow.extended)
  let dashboard: CoachDashboardPage

  test.beforeEach(async ({ authenticatedCoachPage }) => {
    dashboard = new CoachDashboardPage(authenticatedCoachPage)
    await dashboard.goto()
  })

  // eslint-disable-next-line no-empty-pattern
  test.afterAll(async ({ }, testInfo) => {
    await cleanupAuthFile('coach', testInfo.workerIndex)
  })

  test('display dashboard content', async ({ authenticatedCoachPage }) => {
    await expectCoachDashboardVisible(authenticatedCoachPage)
    await expectCoachMetricsVisible(authenticatedCoachPage, dashboardContent.coach.metrics)
  })

  test('navigate to workshops', async ({ authenticatedCoachPage }) => {
    await dashboard.navigateToWorkshops()
    await expectCoachWorkshopsSectionVisible(authenticatedCoachPage)
  })

  test('navigate to bookings', async ({ authenticatedCoachPage }) => {
    await dashboard.navigateToBookings()
    await expectCoachBookingsSectionVisible(authenticatedCoachPage)
  })

  test('access account profile', async ({ authenticatedCoachPage }) => {
    await dashboard.navigateToAccount()
    await expectCoachAccountProfileSectionsVisible(authenticatedCoachPage)
  })
})
