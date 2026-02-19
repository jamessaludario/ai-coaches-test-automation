import type { Page } from 'playwright'
import type { UserCredentials } from '../../constants'
import type { NuxtGoto } from '../../helpers'
import { workshopModes } from '../../constants'
import { navigateToCoachProfile, waitForCardsToRefresh } from '../../helpers'

/**
 * Coach Profile Page Object
 *
 * Handles coach profile page interactions.
 * For assertions, use helpers from `helpers/marketing-assertions.ts`
 */
export class CoachProfilePage {
  constructor(private readonly page: Page, private readonly goto: NuxtGoto) {}

  get coachHeading() {
    return this.page.getByRole('heading').first()
  }

  get locationFlag() {
    return this.page.locator('span[class*="i-flag"]').first()
  }

  get socialLinks() {
    return this.page.locator('a[target="_blank"]').filter({
      has: this.page.locator('[class*="i-simple-icons"]'),
    })
  }

  get workshopSearchInput() {
    return this.page.getByRole('textbox', { name: 'Search for a workshop' })
  }

  get workshopCards() {
    return this.page.locator('.card.relative, .card')
  }

  async navigateToCoachProfile(coach: UserCredentials) {
    await navigateToCoachProfile(this.page, coach)
  }

  async scrollToSchedules() {
    const schedulesHeading = this.page.getByRole('heading', { name: 'AI Schedules' })
    await schedulesHeading.scrollIntoViewIfNeeded()
  }

  async searchWorkshops(workshopName: string) {
    await this.workshopSearchInput.fill(workshopName)
    await this.page.keyboard.press('Enter')
    await waitForCardsToRefresh(this.page, '.card.relative, .card', 10000)
  }

  async toggleModeFilter(modeName: string, check: boolean) {
    const checkbox = this.page.getByRole('checkbox', { name: modeName })
    const isVisible = await checkbox.isVisible().catch(() => false)

    if (isVisible) {
      if (check) {
        await checkbox.check()
      }
      else {
        await checkbox.uncheck()
      }
      await waitForCardsToRefresh(this.page, '.card.relative, .card', 10000)
    }
  }

  async uncheckAllModes() {
    for (const mode of workshopModes.map(mode => mode.name)) {
      await this.toggleModeFilter(mode, false)
    }
  }
}
