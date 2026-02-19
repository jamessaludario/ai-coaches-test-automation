import { homePageContent, timeouts } from '../../constants'
import { test } from '../../fixtures'
import { createNuxtGoto, expectHeadingsVisible, expectTextVisible, scrollToSection, scrollToText } from '../../helpers'
import { HomePage } from '../../page-objects'

test.describe('Workshop Sections Components', () => {
  test.setTimeout(timeouts.workflow.extended)
  let homePage: HomePage

  test.beforeEach(async ({ page }) => {
    const goto = createNuxtGoto(page)
    homePage = new HomePage(page, goto)
    await homePage.navigateToHome()
  })

  test('display AI Mastery workshop header', async ({ page }) => {
    // Top section usually visible, but scrolling ensures stability
    await scrollToSection(page, homePageContent.hero.workshopTitle)
    await expectHeadingsVisible(page, [homePageContent.hero.workshopTitle, homePageContent.hero.workshopSubtitle])
    await expectTextVisible(page, [homePageContent.hostedBy.text, homePageContent.hostedBy.poweredBy])
  })

  test('display workshop requirements', async ({ page }) => {
    await expectTextVisible(page, homePageContent.workshopRequirements)
  })

  test('display game-changer section', async ({ page }) => {
    await scrollToSection(page, homePageContent.homepageSections.gameChanger.heading)
    await expectTextVisible(page, [homePageContent.homepageSections.gameChanger.text, homePageContent.homepageSections.gameChanger.text2])
  })

  test('display all 6 business pillars with value propositions', async ({ page }) => {
    await scrollToSection(page, homePageContent.homepageSections.whatYoullMaster.heading)
    await expectHeadingsVisible(page, homePageContent.homepageSections.whatYoullMaster.pillars.map(pillar => pillar.name))
    await expectTextVisible(page, homePageContent.homepageSections.whatYoullMaster.pillars.map(pillar => pillar.value))
  })

  test('display AI Command Room section', async ({ page }) => {
    await scrollToText(page, homePageContent.homepageSections.whatYoullMaster.aicommandRoom.heading)
    await expectHeadingsVisible(page, [homePageContent.homepageSections.whatYoullMaster.aicommandRoom.heading])
    await expectTextVisible(page, [homePageContent.homepageSections.whatYoullMaster.aicommandRoom.text])
  })

  test('display attendee information section', async ({ page }) => {
    await scrollToSection(page, homePageContent.homepageSections.whoShouldAttend.heading)
    await expectHeadingsVisible(page, [homePageContent.homepageSections.whoShouldAttend.heading])
    await expectTextVisible(page, [homePageContent.homepageSections.whoShouldAttend.numberOfEmployees])
    await expectTextVisible(page, homePageContent.homepageSections.whoShouldAttend.benefits.map(benefit => benefit.name))
    await expectTextVisible(page, homePageContent.homepageSections.whoShouldAttend.benefits.map(benefit => benefit.value))
  })

  test('display secure your workshop date section', async ({ page }) => {
    await scrollToSection(page, homePageContent.homepageSections.secureYourWorkshopDate.heading)
    await expectHeadingsVisible(page, [homePageContent.homepageSections.secureYourWorkshopDate.heading])
    await expectTextVisible(page, [homePageContent.homepageSections.secureYourWorkshopDate.text])
  })

  test('display workshop outcome section', async ({ page }) => {
    await scrollToText(page, homePageContent.homepageSections.workshopOutcomes.outcomes[0].name)
    await expectHeadingsVisible(page, homePageContent.homepageSections.workshopOutcomes.outcomes.map(outcome => outcome.name))
    await expectTextVisible(page, homePageContent.homepageSections.workshopOutcomes.outcomes.map(outcome => outcome.value))
  })
})
