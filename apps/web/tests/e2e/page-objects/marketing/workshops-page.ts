import type { Page } from 'playwright'
import type { workshopDateFilters } from '../../constants'
import type { NuxtGoto } from '../../helpers'
import { exploreWorkshopsContent, pageRoutes, timeouts, workshopModes, workshopScheduleContent } from '../../constants'
import { waitForCardsToRefresh } from '../../helpers'
import { escapeRegExp } from '../../utils'

/**
 * Workshops Page Object
 *
 * Handles workshop listing and filtering interactions.
 * For assertions, use helpers from `helpers/marketing-assertions.ts`
 */

type WorkshopMode = typeof workshopModes[number]['name']
type WorkshopDateFilter = typeof workshopDateFilters[number]['name']

export class WorkshopsPage {
  constructor(private readonly page: Page, private readonly goto: NuxtGoto) {}

  get searchInput() {
    return this.page.getByPlaceholder(exploreWorkshopsContent.searchPlaceholder)
  }

  get scheduleSearchInput() {
    return this.page.getByRole('textbox', { name: workshopScheduleContent.workshopSearchPlaceholder })
  }

  get locationInput() {
    return this.page.getByRole('combobox', { name: workshopScheduleContent.workshopLocationPlaceholder })
  }

  get workshopCards() {
    return this.page.locator('.card.relative')
  }

  async navigateToWorkshops() {
    await this.goto(pageRoutes.workshops, { waitUntil: 'networkidle' })
  }

  async navigateToSchedules() {
    await this.goto(pageRoutes.workshopSchedules, { waitUntil: 'networkidle' })
  }

  async searchWorkshops(searchTerm: string) {
    await this.searchInput.fill(searchTerm)
    await this.page.keyboard.press('Enter')
    await waitForCardsToRefresh(this.page, '.card.relative, .card', timeouts.ui.elementVisible)
  }

  async searchSchedules(searchTerm: string) {
    await this.scheduleSearchInput.fill(searchTerm)
    await this.page.keyboard.press('Enter')
    await waitForCardsToRefresh(this.page, '.card.relative, .card', timeouts.ui.elementVisible)
  }

  async clearScheduleSearch() {
    await this.scheduleSearchInput.fill('')
    await this.page.keyboard.press('Enter')
    await waitForCardsToRefresh(this.page, '.card.relative, .card', timeouts.ui.elementVisible)
  }

  async filterByLocation(location: string) {
    await this.locationInput.fill(location)
    await this.page.keyboard.press('Enter')
    await waitForCardsToRefresh(this.page, '.card.relative', timeouts.ui.elementVisible)
  }

  async clearLocationFilter() {
    await this.locationInput.fill('')
    await this.page.keyboard.press('Enter')
    await waitForCardsToRefresh(this.page, '.card.relative', timeouts.ui.elementVisible)
  }

  async filterByDateRange(filter: WorkshopDateFilter) {
    const filterButton = this.page.getByRole('button', { name: filter })
    await filterButton.click()
    await waitForCardsToRefresh(this.page, '.card.relative', timeouts.ui.elementVisible)
  }

  async toggleModeFilter(mode: WorkshopMode, check: boolean) {
    const checkbox = this.page.getByRole('checkbox', { name: mode })
    if (check) {
      await checkbox.check()
    }
    else {
      await checkbox.uncheck()
    }
    await waitForCardsToRefresh(this.page, '.card.relative', timeouts.ui.elementVisible)
  }

  async uncheckAllModes() {
    for (const mode of workshopModes) {
      const checkbox = this.page.getByRole('checkbox', { name: mode.name })
      await checkbox.uncheck()
    }
    await waitForCardsToRefresh(this.page, '.card.relative', timeouts.ui.elementVisible)
  }

  async clickFirstLearnMore() {
    const learnMoreLinks = this.page.getByRole(
      'link',
      { name: workshopScheduleContent.learnMoreButton },
    )
    await learnMoreLinks.first().click()
  }

  async clickWorkshopCard(workshopName: string) {
    const workshopCards = this.page.locator('.card').filter({
      has: this.page.getByRole('heading', { name: new RegExp(escapeRegExp(workshopName), 'i') }),
    })

    const cardCount = await workshopCards.count()
    if (cardCount > 0) {
      await workshopCards.first().click()
    }
    else {
      throw new Error(`Workshop card with name "${workshopName}" not found`)
    }
  }
}
