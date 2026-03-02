import { defaultWorkshop, timeouts } from '../../constants'
import { cleanupAuthFile, expect, test } from '../../fixtures'
import { ClientWorkshopsPage } from '../../page-objects/client/workshops.page'

test.describe('Client Workshops', () => {
  test.setTimeout(timeouts.workflow.extended)
  let workshopsPage: ClientWorkshopsPage

  test.beforeEach(async ({ authenticatedClientPage }) => {
    workshopsPage = new ClientWorkshopsPage(authenticatedClientPage)
    await workshopsPage.goto()
  })

  // eslint-disable-next-line no-empty-pattern
  test.afterAll(async ({}, testInfo) => {
    await cleanupAuthFile('client', testInfo.workerIndex)
  })

  test('display workshops page', async ({ authenticatedClientPage }) => {
    await expect(workshopsPage.heading).toBeVisible({ timeout: timeouts.page.pageLoad })
  })

  test('search for workshops', async () => {
    await workshopsPage.searchWorkshops(defaultWorkshop.name)
  })
})
