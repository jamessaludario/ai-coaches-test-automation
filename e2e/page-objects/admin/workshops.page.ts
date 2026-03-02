import type { WorkshopFormData } from '../../helpers/table.helper'
import { adminRoutes, adminSelectors, timeouts } from '../../constants'
import { clickRowAction, searchDataTable, waitForModalClose } from '../../helpers'
import { BasePage } from '../base.page'

export class AdminWorkshopsPage extends BasePage {
  get heading() { return this.page.getByRole('heading', { name: adminSelectors.workshops.heading }) }
  get createButton() { return this.page.getByRole('button', { name: adminSelectors.workshops.addButton }) }
  get searchInput() { return this.page.getByRole('textbox', { name: adminSelectors.dataTable.searchInput }) }
  get dataTable() { return this.page.getByRole('table') }

  getOverviewTabHeading() { return this.page.getByRole('heading', { name: adminSelectors.workshops.tabHeadings.overview }) }
  getCalendarTabHeading() { return this.page.getByRole('heading', { name: adminSelectors.workshops.tabHeadings.calendar }) }
  getResourcesTabHeading() { return this.page.getByRole('heading', { name: adminSelectors.workshops.tabHeadings.resources }) }

  async goto() {
    await this.navigate(adminRoutes.workshops)
    await this.heading.waitFor()
  }

  async gotoWorkshopDetail(workshopId: string) {
    await this.navigate(adminRoutes.workshopDetail(workshopId))
    await this.waitForPageLoad()
  }

  async searchWorkshop(query: string) { await searchDataTable(this.page, query) }

  async viewWorkshop(workshopIdentifier: string) {
    await clickRowAction(this.page, workshopIdentifier, 'manage')
    await this.page.waitForURL(adminRoutes.workshopsRouteRegex, { timeout: timeouts.page.navigation })
  }

  async clickOverviewTab() {
    await this.page.getByRole('tab', { name: adminSelectors.workshops.tabs.overview }).click()
    await this.getOverviewTabHeading().waitFor()
  }

  async clickCalendarTab() {
    await this.page.getByRole('tab', { name: adminSelectors.workshops.tabs.calendar }).click()
    await this.getCalendarTabHeading().waitFor()
  }

  async clickResourcesTab() {
    await this.page.getByRole('tab', { name: adminSelectors.workshops.tabs.resources }).click()
    await this.getResourcesTabHeading().waitFor()
  }

  async getFirstWorkshopCellText(columnIndex: number = 0): Promise<string | null> {
    const firstWorkshopCell = this.dataTable.locator('tbody').getByRole('row').first().getByRole('cell').nth(columnIndex)
    return await firstWorkshopCell.textContent()
  }
}
