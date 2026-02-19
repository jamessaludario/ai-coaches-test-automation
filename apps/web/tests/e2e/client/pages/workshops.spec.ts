import { defaultWorkshop, timeouts } from '../../constants'
import { cleanupAuthFile, test } from '../../fixtures'
import {
  expectClientWorkshopsPageLoaded,
  expectClientWorkshopVisible,
} from '../../helpers'
import { ClientWorkshopsPage } from '../../page-objects'

/**
 * Client Workshops - Page Tests
 */
test.describe('Client Workshops', () => {
  test.setTimeout(timeouts.workflow.extended)
  let workshopsPage: ClientWorkshopsPage

  test.beforeEach(async ({ authenticatedClientPage }) => {
    workshopsPage = new ClientWorkshopsPage(authenticatedClientPage)
    await workshopsPage.goto()
  })

  // eslint-disable-next-line no-empty-pattern
  test.afterAll(async ({ }, testInfo) => {
    await cleanupAuthFile('client', testInfo.workerIndex)
  })

  test('display workshops page', async ({ authenticatedClientPage }) => {
    await expectClientWorkshopsPageLoaded(authenticatedClientPage)
  })

  test('search for workshops', async ({ authenticatedClientPage }) => {
    await workshopsPage.searchWorkshops(defaultWorkshop.name)
    await expectClientWorkshopVisible(authenticatedClientPage, defaultWorkshop.name)
  })
})
