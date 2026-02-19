import type { Page } from 'playwright'
import type { NuxtGoto } from '../../helpers'
import { expect } from '@nuxt/test-utils/playwright'
import { exploreWorkshopsContent, timeouts, workshopContent, workshopRoutes, workshopScheduleContent } from '../../constants'
import { nuxtGoto, waitForCardsToRefresh } from '../../helpers'

/**
 * Workshop Schedule Details Page Object
 *
 * Handles workshop schedule detail page interactions.
 * For assertions, use helpers from `helpers/marketing-assertions.ts`
 */
export class WorkshopScheduleDetailsPage {
  constructor(private readonly page: Page, private readonly goto: NuxtGoto) {}

  get bookButton() {
    return this.page.getByRole('link', { name: workshopContent.schedule.bookButton })
  }

  get workshopHeading() {
    return this.page.getByRole('heading').first()
  }

  get shareButton() {
    return this.page.getByRole('button', { name: workshopContent.schedule.shareButton })
  }

  get dateText() {
    return this.page.locator('text=/[A-Z][a-z]+ \\d{1,2}, \\d{4}/').first()
  }

  get priceText() {
    return this.page.getByText('$', { exact: false }).first()
  }

  get spotsAvailableText() {
    return this.page.getByText(workshopContent.schedule.spotText)
  }

  async navigateToScheduleDetails(workshopName: string) {
    await this.goto('/workshops', { waitUntil: 'networkidle' })

    const searchBox = this.page.getByPlaceholder(exploreWorkshopsContent.searchPlaceholder)
    await searchBox.fill(workshopName)
    await this.page.keyboard.press('Enter')
    await expect(this.page.getByText(workshopName)).toBeVisible()

    await waitForCardsToRefresh(this.page, '.card.relative', timeouts.wait.extraLong)
    await expect(this.page.getByText(workshopName)).toBeVisible({ timeout: timeouts.ui.elementVisible })
    await this.page.getByText(workshopName).first().click()
    await this.page.waitForURL(workshopRoutes.details, { timeout: timeouts.page.navigation })

    const browseSchedulesLink = this.page.getByRole('link', { name: workshopContent.details.browseSchedules }).first()
    await expect(browseSchedulesLink).toBeVisible({ timeout: timeouts.ui.elementVisible })
    await browseSchedulesLink.click()

    await expect(this.page.getByRole('heading', { name: workshopScheduleContent.workshopListHeading })).toBeVisible({ timeout: timeouts.ui.elementVisible })
    await this.page.getByRole('link', { name: workshopScheduleContent.learnMoreButton }).first().click()
  }

  async clickBookButton() {
    const bookBtn = this.bookButton.first()
    await bookBtn.click()
  }

  async gotoScheduleDetailsById(id: string) {
    await nuxtGoto(this.page, `/workshops/schedules/${id}`)
  }

  get coachSection() {
    return this.page.locator('section, div').filter({ has: this.page.getByRole('heading', { name: /Coach/i }) }).first()
  }

  async scrollToCoachSection() {
    await this.coachSection.scrollIntoViewIfNeeded()
  }

  async goBack() {
    await this.page.goBack()
  }
}
