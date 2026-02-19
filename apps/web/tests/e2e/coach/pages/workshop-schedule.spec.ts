import { timeouts, userRoutes } from '../../constants'
import { cleanupAuthFile, expect, test } from '../../fixtures'
import {
  expectCoachScheduleDetailsVisible,
  expectCoachScheduleMetricsVisible,
  expectCoachScheduleOverviewVisible,
  expectCoachScheduleTabsVisible,
  expectCoachWorkshopSchedulePageLoaded,
  navigateToFirstTableRow,
} from '../../helpers'
import { CoachWorkshopSchedulePage } from '../../page-objects'

/**
 * Coach Workshop Schedule - Page Tests
 *
 * Tests coach workshop schedule functionality
 */

test.describe('Coach Workshop Schedules', () => {
  test.setTimeout(timeouts.workflow.extended)
  let firstScheduleId: string | null = null

  test.beforeAll(async ({ authenticatedCoachPage }) => {
    const schedulePage = new CoachWorkshopSchedulePage(authenticatedCoachPage)
    await schedulePage.gotoSchedulesList()
    await expectCoachWorkshopSchedulePageLoaded(authenticatedCoachPage)

    firstScheduleId = await navigateToFirstTableRow(
      authenticatedCoachPage,
      userRoutes.coach.workshopScheduleDetails,
    )
  })

  // eslint-disable-next-line no-empty-pattern
  test.afterAll(async ({ }, testInfo) => {
    await cleanupAuthFile('coach', testInfo.workerIndex)
  })

  test.beforeEach(async ({ authenticatedCoachPage }) => {
    test.skip(!firstScheduleId, 'No schedules available')

    // Navigate to the schedule details page before each test
    const schedulePage = new CoachWorkshopSchedulePage(authenticatedCoachPage)
    await schedulePage.navigateToSchedule(firstScheduleId!)
  })

  test('display schedule details page', async ({ authenticatedCoachPage }) => {
    await expectCoachScheduleOverviewVisible(authenticatedCoachPage)
    await expectCoachScheduleTabsVisible(authenticatedCoachPage)
  })

  test('display schedule metrics and details', async ({ authenticatedCoachPage }) => {
    await expectCoachScheduleMetricsVisible(authenticatedCoachPage)
    await expectCoachScheduleDetailsVisible(authenticatedCoachPage)
  })

  test('navigate to schedule bookings', async ({ authenticatedCoachPage }) => {
    const schedulePage = new CoachWorkshopSchedulePage(authenticatedCoachPage)

    const bookingsTab = schedulePage.bookingsTab
    const hasBookingsTab = await bookingsTab.isVisible()
    if (hasBookingsTab) {
      await schedulePage.navigateToBookings()
      await expect(authenticatedCoachPage).toHaveURL(/\/bookings$/)
    }
  })
})
