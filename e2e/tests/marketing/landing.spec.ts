import { homePageContent, timeouts } from '../../constants'
import { expect, test } from '../../fixtures'
import { createNuxtGoto, expectHeadingsVisible, expectTextVisible, scrollToSection, scrollToText } from '../../helpers'
import { LandingPage } from '../../page-objects/marketing/landing.page'

test.describe('Landing Page', () => {
  test.setTimeout(timeouts.workflow.extended)
  let landingPage: LandingPage

  test.beforeEach(async ({ page }) => {
    const goto = createNuxtGoto(page)
    landingPage = new LandingPage(page, goto)
    await landingPage.navigateToHome()
  })

  test('display home page with content', async ({ page }) => {
    await expect(page).toHaveURL('/')
    for (const badge of homePageContent.hero.badges) {
      await expect(page.getByText(badge).first()).toBeVisible()
    }
  })

  test('displays workshop value propositions', async ({ page }) => {
    for (const section of homePageContent.valueProps.sections) {
      await expect(page.getByRole('heading', { name: section }).first()).toBeVisible({ timeout: timeouts.ui.elementVisible })
    }
  })

  test('navigates to key pages', async ({ page }) => {
    await landingPage.navigateToConsultants()
    await expect(page).toHaveURL(/\/consultants/)
    await landingPage.navigateToHome()
    await expect(page).toHaveURL(/\//)

    await landingPage.navigateToWorkshops()
    await expect(page).toHaveURL(/\/workshops/)
    await landingPage.navigateToHome()

    await expect(landingPage.contactLink).toBeVisible()
  })

  test('display AI Mastery workshop header', async ({ page }) => {
    await scrollToSection(page, homePageContent.hero.workshopTitle)
    await expectHeadingsVisible(page, [homePageContent.hero.workshopTitle, homePageContent.hero.workshopSubtitle])
    await expectTextVisible(page, [homePageContent.hostedBy.text, homePageContent.hostedBy.poweredBy])
  })

  test('display all 6 business pillars with value propositions', async ({ page }) => {
    await scrollToSection(page, homePageContent.homepageSections.whatYoullMaster.heading)
    await expectHeadingsVisible(page, homePageContent.homepageSections.whatYoullMaster.pillars.map(p => p.name))
    await expectTextVisible(page, homePageContent.homepageSections.whatYoullMaster.pillars.map(p => p.value))
  })

  test('display attendee information section', async ({ page }) => {
    await scrollToSection(page, homePageContent.homepageSections.whoShouldAttend.heading)
    await expectHeadingsVisible(page, [homePageContent.homepageSections.whoShouldAttend.heading])
    await expectTextVisible(page, [homePageContent.homepageSections.whoShouldAttend.numberOfEmployees])
  })

  test('display workshop outcome section', async ({ page }) => {
    await scrollToText(page, homePageContent.homepageSections.workshopOutcomes.outcomes[0].name)
    await expectHeadingsVisible(page, homePageContent.homepageSections.workshopOutcomes.outcomes.map(o => o.name))
  })
})
