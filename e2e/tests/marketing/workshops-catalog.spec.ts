import { authContent, bookingContent, defaultWorkshop, timeouts, workshopContent, workshopDateFilters, workshopModes } from '../../constants'
import { expect, test } from '../../fixtures'
import { createNuxtGoto, navigateToWorkshopScheduleDetails, waitForCardsToRefresh } from '../../helpers'
import { escapeRegExp } from '../../helpers/date.helper'
import { WorkshopsCatalogPage } from '../../page-objects/marketing/workshops-catalog.page'

test.describe('Workshops Catalog', () => {
  test.setTimeout(timeouts.workflow.extended)
  let workshopsPage: WorkshopsCatalogPage
  let goto: ReturnType<typeof createNuxtGoto>

  test.beforeEach(async ({ page }) => {
    goto = createNuxtGoto(page)
    workshopsPage = new WorkshopsCatalogPage(page, goto)
  })

  test('search for workshops', async ({ page }) => {
    await workshopsPage.navigateToWorkshops()
    await workshopsPage.searchWorkshops(defaultWorkshop.name)
    await expect(page.getByText(defaultWorkshop.name).first()).toBeVisible()
  })

  test('search workshops in schedules page', async () => {
    await workshopsPage.navigateToSchedules()
    await workshopsPage.searchSchedules(defaultWorkshop.name)
    await workshopsPage.clearScheduleSearch()
  })

  test('filter workshops by location', async ({ page }) => {
    await workshopsPage.navigateToSchedules()
    await workshopsPage.filterByLocation('Philippines')
    await workshopsPage.clearLocationFilter()
  })

  test.describe('Filter by mode', () => {
    for (const mode of workshopModes) {
      test(`filter: ${mode.name}`, async ({ page }) => {
        await workshopsPage.navigateToSchedules()
        await workshopsPage.uncheckAllModes()
        await workshopsPage.toggleModeFilter(mode.name, true)
        await workshopsPage.toggleModeFilter(mode.name, false)
      })
    }
  })
})
