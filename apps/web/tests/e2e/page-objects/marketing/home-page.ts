import type { Page } from 'playwright'
import type { NuxtGoto } from '../../helpers'
import { expect } from '@nuxt/test-utils/playwright'
import { homePageContent, pageRoutes, timeouts } from '../../constants'
import { BasePage } from '../../page-objects'

/**
 * Home Page Object
 *
 * Handles home page interactions.
 * For assertions, use helpers from `helpers/marketing-assertions.ts`
 */
export class HomePage extends BasePage {
  constructor(page: Page, private readonly goto: NuxtGoto) {
    super(page)
  }

  get mainHeading() {
    return this.page.getByRole('heading', { name: homePageContent.hero.mainHeading })
  }

  get tagline() {
    return this.page.getByText(homePageContent.hero.tagline).first()
  }

  get workshopTitle() {
    return this.page.getByRole('heading', { name: homePageContent.hero.workshopTitle })
  }

  get workshopSubtitle() {
    return this.page.getByRole('heading', { name: homePageContent.hero.workshopSubtitle })
  }

  get findCoachesLink() {
    return this.page.getByRole('tab', { name: homePageContent.navigation.findCoaches.text })
  }

  get workshopsLink() {
    return this.page.getByRole('tab', { name: homePageContent.navigation.workshops.text })
  }

  get contactLink() {
    return this.page.getByRole('link', { name: homePageContent.navigation.contact.text })
  }

  async navigateToHome() {
    await this.goto(pageRoutes.home, { waitUntil: 'networkidle' })
  }

  async navigateToConsultants() {
    await this.findCoachesLink.waitFor({ state: 'visible', timeout: timeouts.ui.elementVisible })
    await this.clickAndWait(this.findCoachesLink, pageRoutes.consultants)
  }

  async navigateToWorkshops() {
    await this.workshopsLink.waitFor({ state: 'visible', timeout: timeouts.ui.elementVisible })
    await this.clickAndWait(this.workshopsLink, pageRoutes.workshops)
  }

  async navigateToLegalPage(linkName: string, expectedHeading: string | RegExp) {
    const link = this.page.getByRole('link', { name: linkName })
    await link.scrollIntoViewIfNeeded()
    await link.click()
    await expect(this.page.getByRole('heading', { name: expectedHeading })).toBeVisible({ timeout: timeouts.page.navigation })
  }
}
