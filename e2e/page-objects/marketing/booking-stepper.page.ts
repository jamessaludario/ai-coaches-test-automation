import { bookingContent, timeouts } from '../../constants'
import { BasePage } from '../base.page'

export class BookingStepperPage extends BasePage {
  get continueToPaymentButton() {
    return this.page.getByRole('button', { name: bookingContent.buttons.continueToPayment })
  }

  get previousStepButton() {
    return this.page.getByRole('button', { name: bookingContent.buttons.previousStep })
  }

  get manageBookingButton() {
    return this.page.getByRole('link', { name: bookingContent.buttons.manageBooking })
  }

  get downloadInvoiceButton() {
    return this.page.getByRole('link', { name: bookingContent.buttons.downloadInvoice })
  }

  get confirmationHeading() {
    return this.page.getByText(bookingContent.confirmation.heading)
  }

  get bookingIdText() {
    return this.page.getByText(bookingContent.confirmation.bookingId)
  }

  async continueToPayment() {
    await this.continueToPaymentButton.click()
  }

  async goToPreviousStep() {
    await this.previousStepButton.click()
  }

  async manageBooking() {
    await this.manageBookingButton.click()
    await this.page.waitForLoadState('networkidle', { timeout: timeouts.page.networkIdle })
  }
}
