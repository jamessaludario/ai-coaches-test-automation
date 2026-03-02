import { defaultWorkshop, timeouts } from '../../constants'
import { cleanupAuthFile, expect, test } from '../../fixtures'
import { navigateToFirstTableRow } from '../../helpers'
import { CoachDashboardPage } from '../../page-objects/coach/dashboard.page'
import { CoachWorkshopDetailPage } from '../../page-objects/coach/workshop-detail.page'

test.describe('Coach Workshops', () => {
  test.setTimeout(timeouts.workflow.extended)

  // eslint-disable-next-line no-empty-pattern
  test.afterAll(async ({}, testInfo) => {
    await cleanupAuthFile('coach', testInfo.workerIndex)
  })

  test('display workshop details page', async ({ authenticatedCoachPage }) => {
    const dashboard = new CoachDashboardPage(authenticatedCoachPage)
    await dashboard.goto()
    await dashboard.navigateToWorkshops()
    const workshopId = await navigateToFirstTableRow(authenticatedCoachPage, /\/workshops\/([^/]+)/)
    if (!workshopId) { test.skip(true, 'No workshops available'); return }
    await expect(authenticatedCoachPage.getByRole('heading', { level: 1 })).toBeVisible()
  })
})
