import { invalidUsers, testUsers, timeouts } from '../../constants'
import { test } from '../../fixtures'
import { createNuxtGoto } from '../../helpers'
import { LoginPage } from '../../page-objects/auth/login.page'
import { expect } from '@playwright/test'

test.describe('Login', () => {
  test.setTimeout(timeouts.workflow.extended)

  test('login as client with valid credentials', async ({ page }) => {
    const goto = createNuxtGoto(page)
    const loginPage = new LoginPage(page)
    await loginPage.navigateToLogin(goto, '/b')
    await loginPage.fillCredentials(testUsers.client.email, testUsers.client.password)
    await loginPage.fillOTP()
    await page.waitForLoadState('networkidle')
    await expect(page).toHaveURL(/\/b/)
  })

  test('login as coach with valid credentials', async ({ page }) => {
    const goto = createNuxtGoto(page)
    const loginPage = new LoginPage(page)
    await loginPage.navigateToLogin(goto, '/c')
    await loginPage.fillCredentials(testUsers.coach.email, testUsers.coach.password)
    await loginPage.fillOTP()
    await page.waitForLoadState('networkidle')
    await expect(page).toHaveURL(/\/c/)
  })

  test('show error for invalid email format', async ({ page }) => {
    const goto = createNuxtGoto(page)
    const loginPage = new LoginPage(page)
    await loginPage.navigateToLogin(goto, '/')
    await loginPage.emailInput.fill(invalidUsers.wrongEmail.email)
    await loginPage.continueButton.click()
    await expect(loginPage.getErrorMessage(invalidUsers.wrongEmail.expectedError)).toBeVisible()
  })

  test('show error for empty fields', async ({ page }) => {
    const goto = createNuxtGoto(page)
    const loginPage = new LoginPage(page)
    await loginPage.navigateToLogin(goto, '/')
    await loginPage.continueButton.click()
    await expect(loginPage.getErrorMessage(invalidUsers.emptyFields.expectedError)).toBeVisible()
  })
})
