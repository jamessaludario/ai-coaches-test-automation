import { dashboardContent, timeouts } from '../../constants'
import { cleanupAuthFile, test } from '../../fixtures'
import {
  expectClientBookingsSectionVisible,
  expectClientDashboardElements,
  expectClientDashboardVisible,
  expectClientWorkshopsSectionVisible,
} from '../../helpers'
import { ClientDashboardPage } from '../../page-objects'

/**
 * Client Dashboard - Page Tests
 *
 * Tests client dashboard functionality
 */

test.describe('Client Dashboard', () => {
  test.setTimeout(timeouts.workflow.extended)
  let dashboard: ClientDashboardPage

  test.beforeEach(async ({ authenticatedClientPage }) => {
    dashboard = new ClientDashboardPage(authenticatedClientPage)
    await dashboard.goto()
  })

  // eslint-disable-next-line no-empty-pattern
  test.afterAll(async ({ }, testInfo) => {
    cleanupAuthFile('client', testInfo.workerIndex)
  })

  test('display dashboard content', async ({ authenticatedClientPage }) => {
    await expectClientDashboardVisible(authenticatedClientPage, dashboardContent.client.welcomeMessage)
    await expectClientDashboardElements(authenticatedClientPage, dashboardContent.client.elements)
  })

  test('navigate to workshops', async ({ authenticatedClientPage }) => {
    await dashboard.navigateToWorkshops()
    await expectClientWorkshopsSectionVisible(authenticatedClientPage)
  })

  test('navigate to bookings', async ({ authenticatedClientPage }) => {
    await dashboard.navigateToBookings()
    await expectClientBookingsSectionVisible(authenticatedClientPage)
  })
})
