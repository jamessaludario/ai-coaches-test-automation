import { timeouts } from '../../constants'
import { cleanupAuthFile, expect, test } from '../../fixtures'
import {
  expectCoachWorkshopMetricsVisible,
  expectCoachWorkshopOverviewVisible,
  expectCoachWorkshopTabsVisible,
  navigateToFirstTableRow,
} from '../../helpers'
import { CoachDashboardPage, CoachWorkshopDetailsPage } from '../../page-objects'

/**
 * Coach Workshop Details - Page Tests
 *
 * Tests coach workshop details functionality
 */

test.describe('Coach Workshop Details', () => {
  test.setTimeout(timeouts.workflow.extended)
  let firstWorkshopId: string | null = null

  test.beforeAll(async ({ authenticatedCoachPage }) => {
    const dashboard = new CoachDashboardPage(authenticatedCoachPage)
    await dashboard.goto()
    await dashboard.navigateToWorkshops()

    firstWorkshopId = await navigateToFirstTableRow(
      authenticatedCoachPage,
      /\/workshops\/([^/]+)/,
    )
  })

  // eslint-disable-next-line no-empty-pattern
  test.afterAll(async ({ }, testInfo) => {
    await cleanupAuthFile('coach', testInfo.workerIndex)
  })

  test.beforeEach(async ({ authenticatedCoachPage }) => {
    test.skip(!firstWorkshopId, 'No workshops available')

    // Navigate to workshop details page before each test
    const workshopDetailsPage = new CoachWorkshopDetailsPage(authenticatedCoachPage)
    await workshopDetailsPage.navigateToWorkshop(firstWorkshopId!)
  })

  test('display workshop details page', async ({ authenticatedCoachPage }) => {
    await expectCoachWorkshopOverviewVisible(authenticatedCoachPage)
    await expectCoachWorkshopTabsVisible(authenticatedCoachPage)
  })

  test('display workshop metrics', async ({ authenticatedCoachPage }) => {
    await expectCoachWorkshopMetricsVisible(authenticatedCoachPage)
  })

  test('navigate to workshop calendar', async ({ authenticatedCoachPage }) => {
    const workshopDetailsPage = new CoachWorkshopDetailsPage(authenticatedCoachPage)

    const calendarTab = workshopDetailsPage.calendarTab
    await expect(calendarTab).toBeVisible({ timeout: timeouts.ui.elementVisible })
    await calendarTab.click()
    await expect(authenticatedCoachPage).toHaveURL(/\/calendar$/)
  })
})
