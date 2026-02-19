import { authContent, bookingContent, defaultWorkshop, timeouts, workshopContent, workshopDateFilters, workshopModes } from '../../constants'
import { expect, test } from '../../fixtures'
import {
  applyFilterAndProcess,
  createNuxtGoto,
  expectCardsContainText,
  expectWorkshopVisible,
  navigateToWorkshopScheduleDetails,
  validateModeFilter,
  verifyWorkshopDetails,
} from '../../helpers'
import { WorkshopsPage } from '../../page-objects'

test.describe('Workshops Page', () => {
  test.setTimeout(timeouts.workflow.extended)
  let workshopsPage: WorkshopsPage
  let goto: ReturnType<typeof createNuxtGoto>

  test.beforeEach(async ({ page }) => {
    goto = createNuxtGoto(page)
    workshopsPage = new WorkshopsPage(page, goto)
  })

  test('search for workshops', async ({ page }) => {
    await workshopsPage.navigateToWorkshops()
    await workshopsPage.searchWorkshops(defaultWorkshop.name)
    await expectWorkshopVisible(page, defaultWorkshop.name)
  })

  test('search workshops in schedules page', async () => {
    await workshopsPage.navigateToSchedules()
    await workshopsPage.searchSchedules(defaultWorkshop.name)
    await workshopsPage.clearScheduleSearch()
  })

  test('filter workshops by location', async ({ page }) => {
    await workshopsPage.navigateToSchedules()
    await workshopsPage.filterByLocation('Philippines')
    await expectCardsContainText(page, 'Philippines', 'text')
    await workshopsPage.clearLocationFilter()
  })

  test.describe('Filter by date range', () => {
    for (const filter of workshopDateFilters.map(filter => filter.name)) {
      test(`filter: ${filter}`, async ({ page }) => {
        // Need to ensure fresh state or navigation
        await workshopsPage.navigateToSchedules()
        await applyFilterAndProcess(page, filter, filter, filter)
      })
    }
  })

  test.describe('Filter by mode', () => {
    for (const mode of workshopModes) {
      test(`filter: ${mode.name}`, async ({ page }) => {
        await workshopsPage.navigateToSchedules()
        await workshopsPage.uncheckAllModes()
        await validateModeFilter(page, mode.name, mode.textLocator)
        // We might need to uncheck to clean up if we reuse state, but here we navigate fresh or uncheckAll.
        // Wait, `navigateToSchedules` might not reset checks if SPA navigation.
        // `uncheckAllModes` is called.
        // But `validateModeFilter` checks, validates, then unchecks.
        // So it should be fine.
      })
    }
  })

  test('display workshop details and redirect to booking', async ({ page }) => {
    await navigateToWorkshopScheduleDetails(page, goto, defaultWorkshop.name)
    await verifyWorkshopDetails(page, defaultWorkshop.name)

    const loginLink = page.getByRole('link', { name: 'Login' })
    const isLoggedIn = !(await loginLink.isVisible())

    await page.getByRole('link', { name: workshopContent.schedule.bookButton }).click()

    const expectedElement = isLoggedIn
      ? page.getByRole('button', { name: bookingContent.buttons.continueToPayment })
      : page.getByRole('textbox', { name: authContent.emailLabel })
    await expect(expectedElement).toBeVisible()
  })
})
