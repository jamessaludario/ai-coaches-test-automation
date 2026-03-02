import { adminRoutes, adminSelectors } from '../../constants'
import { BasePage } from '../base.page'

export class AdminRolesPage extends BasePage {
  get heading() { return this.page.getByRole('heading', { name: adminSelectors.roles.heading }) }
  get createButton() { return this.page.getByRole('button', { name: adminSelectors.roles.addButton }) }
  get dataTable() { return this.page.getByRole('table') }

  async goto() {
    await this.navigate(adminRoutes.roles)
    await this.heading.waitFor()
  }
}
