import type { Page } from 'playwright'
import type { NuxtGoto } from '../../helpers'
import { workshopContent } from '../../constants'
import { navigateToWorkshopDetails } from '../../helpers'

/**
 * Workshop Details Page Object
 *
 * Handles workshop details page interactions.
 * For assertions, use helpers from `helpers/marketing-assertions.ts`
 */
export class WorkshopDetailsPage {
  constructor(private readonly page: Page, private readonly goto: NuxtGoto) {}

  async navigateToWorkshopDetails(workshopName: string) {
    await navigateToWorkshopDetails(this.page, this.goto, workshopName)
  }

  async clickBrowseSchedules() {
    await this.page.getByRole('link', { name: workshopContent.details.browseSchedules }).first().scrollIntoViewIfNeeded()
    await this.page.getByRole('link', { name: workshopContent.details.browseSchedules }).first().click()
  }

  async goBackToWorkshops() {
    await this.page.getByRole('link', { name: workshopContent.details.backButton }).click()
  }

  async clickBookButton() {
    await this.page.getByRole('link', { name: workshopContent.details.bookButton }).click()
  }
}
