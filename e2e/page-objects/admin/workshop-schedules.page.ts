import { adminRoutes, adminSelectors } from '../../constants'
import { BasePage } from '../base.page'

export class AdminWorkshopSchedulesPage extends BasePage {
  get heading() { return this.page.getByRole('heading', { name: adminSelectors.workshopSchedules.heading }) }
  get createButton() { return this.page.getByRole('button', { name: adminSelectors.workshopSchedules.addButton }) }
  get dataTable() { return this.page.getByRole('table') }

  async goto() {
    await this.navigate(adminRoutes.workshopSchedules)
    await this.heading.waitFor()
  }
}
