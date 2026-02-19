import { homePageContent, timeouts } from '../../constants'
import { expect, test } from '../../fixtures'
import { createNuxtGoto, expectHomeHeroSection, expectHomeValuePropositions } from '../../helpers'
import { HomePage } from '../../page-objects'

test.describe('Home Page', () => {
  test.setTimeout(timeouts.workflow.extended)
  let homePage: HomePage

  test.beforeEach(async ({ page }) => {
    const goto = createNuxtGoto(page)
    homePage = new HomePage(page, goto)
    await homePage.navigateToHome()
  })

  test('display home page with content', async ({ page }) => {
    // Assert
    await expect(page).toHaveURL('/')
    await expectHomeHeroSection(page, homePageContent.hero.badges)
  })

  test('displays workshop value propositions', async ({ page }) => {
    await expectHomeValuePropositions(page, homePageContent.valueProps.sections)
  })

  test('navigates to key pages', async ({ page }) => {
    await homePage.navigateToConsultants()
    await expect(page).toHaveURL(/\/consultants/)
    await homePage.navigateToHome()
    await expect(page).toHaveURL(/\//) // strictly / or /?

    await homePage.navigateToWorkshops()
    await expect(page).toHaveURL(/\/workshops/)
    await homePage.navigateToHome()

    await expect(homePage.contactLink).toBeVisible()
  })
})
