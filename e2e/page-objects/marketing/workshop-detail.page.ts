import type { Page } from 'playwright'
import type { NuxtGoto } from '../../helpers/navigation.helper'
import { workshopContent } from '../../constants'
import { navigateToWorkshopDetails } from '../../helpers/navigation.helper'

export class WorkshopDetailPage {
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

  async clickScheduleRequestButton() {
    await this.page.getByRole('button', { name: workshopContent.details.scheduleRequestButton }).click()
  }
}
