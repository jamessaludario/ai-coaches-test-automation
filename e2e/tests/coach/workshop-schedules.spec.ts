import { timeouts, userRoutes } from '../../constants'
import { cleanupAuthFile, expect, test } from '../../fixtures'
import { navigateToFirstTableRow } from '../../helpers'
import { CoachWorkshopSchedulesPage } from '../../page-objects/coach/workshop-schedules.page'

test.describe('Coach Workshop Schedules', () => {
  test.setTimeout(timeouts.workflow.extended)

  // eslint-disable-next-line no-empty-pattern
  test.afterAll(async ({}, testInfo) => {
    await cleanupAuthFile('coach', testInfo.workerIndex)
  })

  test('display schedule details page', async ({ authenticatedCoachPage }) => {
    const schedulePage = new CoachWorkshopSchedulesPage(authenticatedCoachPage)
    await schedulePage.gotoSchedulesList()
    const scheduleId = await navigateToFirstTableRow(authenticatedCoachPage, userRoutes.coach.workshopScheduleDetails)
    if (!scheduleId) { test.skip(true, 'No schedules available'); return }
    await expect(schedulePage.scheduleTitle).toBeVisible()
  })
})
