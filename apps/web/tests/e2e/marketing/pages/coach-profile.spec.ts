import { defaultWorkshop, testUsers, timeouts, workshopModes } from '../../constants'
import { test } from '../../fixtures'
import { createNuxtGoto, expectCoachModeFilter, expectCoachProfileVisible, expectCoachWorkshopSearchResults } from '../../helpers'
import { CoachProfilePage } from '../../page-objects'

test.describe('Coach Profile Page', () => {
  test.setTimeout(timeouts.workflow.extended)
  let coachProfilePage: CoachProfilePage

  test.beforeEach(async ({ page }) => {
    const goto = createNuxtGoto(page)
    coachProfilePage = new CoachProfilePage(page, goto)
    await coachProfilePage.navigateToCoachProfile(testUsers.coach)
  })

  test('display complete coach profile information', async ({ page }) => {
    await expectCoachProfileVisible(page, testUsers.coach.fullName)
  })

  test('search for workshops on profile', async ({ page }) => {
    await coachProfilePage.scrollToSchedules()
    await coachProfilePage.searchWorkshops(defaultWorkshop.name)
    await expectCoachWorkshopSearchResults(page, defaultWorkshop.name)
  })

  test.describe('Workshop Mode Filters', () => {
    for (const { name, textLocator } of workshopModes) {
      test(`filter workshops by mode: ${name}`, async ({ page }) => {
        // coachProfilePage is initialized in beforeEach
        // const goto = createNuxtGoto(page)
        // const profilePage = new CoachProfilePage(page, goto)
        // Actually beforeEach sets 'coachProfilePage' variable. I can use it.
        // But 'coachProfilePage' is let-declared in outer scope.
        // I need to make sure I can access it. Yes.

        await coachProfilePage.scrollToSchedules()
        await coachProfilePage.uncheckAllModes()
        await coachProfilePage.toggleModeFilter(name, true)
        await expectCoachModeFilter(page, textLocator)
      })
    }
  })
})
