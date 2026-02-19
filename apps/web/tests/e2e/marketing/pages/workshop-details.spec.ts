import { defaultWorkshop, timeouts } from '../../constants'
import { test } from '../../fixtures'
import {
  createNuxtGoto,
  expectFutureSchedulesOnly,
  expectSchedulesUrl,
  expectWorkshopDetailsUrl,
  expectWorkshopDetailsVisible,
  expectWorkshopSections,
  expectWorkshopsUrl,
} from '../../helpers'
import { WorkshopDetailsPage } from '../../page-objects'

test.describe('Workshop Details Page', () => {
  test.setTimeout(timeouts.workflow.extended)
  let workshopDetailsPage: WorkshopDetailsPage

  test.beforeEach(async ({ page }) => {
    const goto = createNuxtGoto(page)
    workshopDetailsPage = new WorkshopDetailsPage(page, goto)
    await workshopDetailsPage.navigateToWorkshopDetails(defaultWorkshop.name)
  })

  test('display workshop content and key elements', async ({ page }) => {
    await expectWorkshopDetailsVisible(page, defaultWorkshop.name)
  })

  test('display workshop sections', async ({ page }) => {
    await expectWorkshopSections(page)
  })

  test('navigate to schedules and back', async ({ page }) => {
    await workshopDetailsPage.clickBrowseSchedules()
    await expectSchedulesUrl(page)
    await page.goBack()
    await expectWorkshopDetailsUrl(page)
    await workshopDetailsPage.goBackToWorkshops()
    await expectWorkshopsUrl(page)
  })

  test('only display future-dated schedules in Upcoming Sessions', async ({ page }) => {
    const result = await expectFutureSchedulesOnly(page)

    if (result.skipped) {
      test.skip(true, result.reason)
    }
  })
})
