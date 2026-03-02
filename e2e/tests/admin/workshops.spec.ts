import { timeouts, WORKSHOP_DATA } from '../../constants'
import { cleanupAuthFile, expect, test } from '../../fixtures'
import { AdminWorkshopsPage } from '../../page-objects/admin/workshops.page'
import { getTimestamp } from '../../helpers/date.helper'

test.describe('Admin Workshops Page', () => {
  test.setTimeout(timeouts.workflow.extended)
  let workshopsPage: AdminWorkshopsPage

  test.beforeEach(async ({ authenticatedAdminPage }) => {
    workshopsPage = new AdminWorkshopsPage(authenticatedAdminPage)
    await workshopsPage.goto()
  })

  // eslint-disable-next-line no-empty-pattern
  test.afterAll(async ({}, testInfo) => {
    await cleanupAuthFile('admin', testInfo.workerIndex)
  })

  test('display workshops page with data table', async () => {
    await expect(workshopsPage.heading).toBeVisible()
    await expect(workshopsPage.dataTable).toBeVisible()
  })

  test('navigate to workshop detail page', async ({ authenticatedAdminPage }) => {
    const workshopName = await workshopsPage.getFirstWorkshopCellText(1)
    if (!workshopName) { test.skip(true, 'No workshops available'); return }
    await workshopsPage.viewWorkshop(workshopName)
  })
})
