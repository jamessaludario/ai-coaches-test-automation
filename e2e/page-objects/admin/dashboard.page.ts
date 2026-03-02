import { adminRoutes, adminSelectors } from '../../constants'
import { BasePage } from '../base.page'

export class AdminDashboardPage extends BasePage {
  get heading() { return this.page.getByRole('heading', { name: adminSelectors.dashboard.heading }) }
  get welcomeMessage() { return this.page.getByText(adminSelectors.dashboard.welcomeMessage) }
  get addUserButton() { return this.page.getByRole('button', { name: adminSelectors.buttons.addNewUser }) }
  get cardMetrics() { return this.page.locator('div[data-slot="card"]') }

  getMetricCard(metric: string) { return this.cardMetrics.filter({ hasText: metric }) }
  getCalendarDay(day: string) { return this.page.locator('div[data-slot="calendar-day"]').getByText(day, { exact: true }) }
  getCreateUserDialog() { return this.page.getByRole('heading', { name: adminSelectors.dialogs.createUserFormDialog }) }

  async goto() { await this.navigate(adminRoutes.dashboard) }
  async clickAddUser() { await this.addUserButton.click() }
}
