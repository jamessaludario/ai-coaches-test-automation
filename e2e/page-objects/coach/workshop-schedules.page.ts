import { timeouts } from '../../constants'
import { nuxtGoto } from '../../helpers'
import { BasePage } from '../base.page'

export class CoachWorkshopSchedulesPage extends BasePage {
  get pageHeading() { return this.page.getByRole('heading', { name: /workshop.*schedules|schedules/i }) }
  get overviewTab() { return this.page.getByRole('tab', { name: /overview/i }) }
  get bookingsTab() { return this.page.getByRole('tab', { name: /bookings/i }) }
  get resourcesTab() { return this.page.getByRole('tab', { name: /resources/i }) }
  get scheduleTitle() { return this.page.getByRole('heading', { level: 1 }) }
  get totalSeatsBookedMetric() { return this.page.getByText(/total.*seats.*booked|seats.*booked/i) }
  get totalBookingsMetric() { return this.page.getByText(/total.*bookings/i) }
  get totalRevenueMetric() { return this.page.getByText(/total.*revenue/i) }
  get dataTable() { return this.page.getByRole('table') }
  get searchInput() { return this.page.getByRole('textbox', { name: /search/i }).first() }
  get scheduleDialogHeading() { return this.page.getByRole('heading', { name: /schedule|new event|edit workshop schedule/i }) }
  get scheduleSubmitButton() { return this.page.getByRole('button', { name: /schedule|create|save|update/i }) }
  get scheduleDialogError() { return this.page.locator('[role="alert"]').filter({ hasText: /date|past|future/i }) }

  async gotoSchedulesList() { await nuxtGoto(this.page, '/c/workshop-schedules') }
  async navigateToSchedule(scheduleId: string) {
    await nuxtGoto(this.page, `/c/workshop-schedules/${scheduleId}`)
    await this.page.waitForLoadState('networkidle')
  }
  async navigateToBookings() {
    await this.bookingsTab.click()
    await this.page.waitForURL(/\/bookings$/, { timeout: timeouts.page.navigation })
  }
  async submitSchedule() { await this.scheduleSubmitButton.click() }
  async isScheduleSubmitEnabled() { return await this.scheduleSubmitButton.isEnabled().catch(() => false) }
  async isScheduleErrorVisible() { return await this.scheduleDialogError.isVisible().catch(() => false) }
  async isScheduleDialogOpen() { return await this.scheduleDialogHeading.isVisible().catch(() => false) }
}
