import { timeouts } from '../../constants'
import { BasePage } from '../base.page'

export class CoachWorkshopDetailPage extends BasePage {
  get overviewTab() { return this.page.getByRole('tab', { name: /overview/i }) }
  get calendarTab() { return this.page.getByRole('tab', { name: /calendar/i }) }
  get historyTab() { return this.page.getByRole('tab', { name: /history/i }) }
  get invoicesTab() { return this.page.getByRole('tab', { name: /invoices/i }) }
  get payoutsTab() { return this.page.getByRole('tab', { name: /payouts/i }) }
  get resourcesTab() { return this.page.getByRole('tab', { name: /resources/i }) }
  get workshopTitle() { return this.page.getByRole('heading', { level: 1 }) }
  get totalSessionsMetric() { return this.page.getByText(/total.*sessions/i) }
  get totalParticipantsMetric() { return this.page.getByText(/total.*participants/i) }
  get totalBookingsMetric() { return this.page.getByText(/total.*bookings/i) }
  get totalRevenueMetric() { return this.page.getByText(/total.*revenue/i) }

  async navigateToWorkshop(workshopId: string) {
    await this.page.goto(`/c/workshops/${workshopId}`)
    await this.page.waitForLoadState('networkidle')
  }

  async navigateToCalendar() {
    await this.calendarTab.click()
    await this.page.waitForURL(/\/calendar$/, { timeout: timeouts.page.navigation })
  }
}
