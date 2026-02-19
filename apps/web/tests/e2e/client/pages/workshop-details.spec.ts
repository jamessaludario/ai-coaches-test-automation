import { defaultWorkshop, timeouts } from '../../constants'
import { cleanupAuthFile, test } from '../../fixtures'
import {
  expectClientWorkshopMetricsVisible,
  expectClientWorkshopOverviewVisible,
  expectClientWorkshopsPageLoaded,
  expectClientWorkshopTabsVisible,
  navigateToCalendarTab,
  openWorkshopViaLink,
} from '../../helpers'
import { ClientWorkshopsPage } from '../../page-objects'

/**
 * Client Workshop Details - Page Tests
 *
 * Tests client workshop details functionality
 */

test.describe('Client Workshop Details', () => {
  test.setTimeout(timeouts.workflow.extended)

  test.beforeEach(async ({ authenticatedClientPage }) => {
    const workshopsPage = new ClientWorkshopsPage(authenticatedClientPage)
    await workshopsPage.goto()
    await expectClientWorkshopsPageLoaded(authenticatedClientPage)
    await openWorkshopViaLink(authenticatedClientPage, defaultWorkshop.name)
  })

  // eslint-disable-next-line no-empty-pattern
  test.afterAll(async ({ }, testInfo) => {
    await cleanupAuthFile('client', testInfo.workerIndex)
  })

  test('display workshop details page', async ({ authenticatedClientPage }) => {
    await expectClientWorkshopOverviewVisible(authenticatedClientPage)
    await expectClientWorkshopTabsVisible(authenticatedClientPage)
    await expectClientWorkshopMetricsVisible(authenticatedClientPage)
  })

  test('navigate to workshop calendar', async ({ authenticatedClientPage }) => {
    await navigateToCalendarTab(authenticatedClientPage)
  })
})
