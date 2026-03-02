import type { Page } from 'playwright'
import type { UserCredentials } from '../constants'
import type { LoginPage } from '../page-objects/auth/login.page'
import type { NuxtGoto } from './navigation.helper'
import { accountMenuContent, adminBaseUrl, loginRoutes, testUsers, timeouts } from '../constants'
import { escapeRegExp } from './date.helper'

export async function loginUser(goto: NuxtGoto, loginPage: LoginPage, email?: string, password?: string) {
  await loginPage.login(goto, email ?? testUsers.client.email, password ?? testUsers.client.password, loginRoutes.home)
  await loginPage.waitForRedirect(loginRoutes.home)
}

export async function loginAsCoach(goto: NuxtGoto, loginPage: LoginPage, email?: string, password?: string) {
  await loginPage.login(goto, email ?? testUsers.coach.email, password ?? testUsers.coach.password, loginRoutes.redirectToCoachDashboard)
  await loginPage.waitForRedirect(loginRoutes.redirectToCoachDashboard)
}

export async function loginAsClient(goto: NuxtGoto, loginPage: LoginPage, email?: string, password?: string) {
  await loginPage.login(goto, email ?? testUsers.client.email, password ?? testUsers.client.password, loginRoutes.redirectToClientDashboard)
  await loginPage.waitForRedirect(loginRoutes.redirectToClientDashboard)
}

export async function loginAsAdmin(goto: NuxtGoto, loginPage: LoginPage, email?: string, password?: string) {
  await loginPage.login(goto, email ?? testUsers.admin.email, password ?? testUsers.admin.password, loginRoutes.home, adminBaseUrl)
  await loginPage.waitForRedirect(loginRoutes.home, undefined, adminBaseUrl)
}

export async function loginAndExpectOnboarding(goto: NuxtGoto, loginPage: LoginPage, email?: string, password?: string) {
  await loginPage.login(goto, email ?? testUsers.client.email, password ?? testUsers.client.password, loginRoutes.onboarding)
  await loginPage.waitForRedirect(loginRoutes.onboarding)
}

export async function logout(page: Page, user: UserCredentials) {
  if (!user.fullName) throw new Error('User fullName is required for logout')
  const escapedName = escapeRegExp(user.fullName)
  const userProfileButton = page.getByRole('button', { name: new RegExp(escapedName, 'i') }).first()
  await userProfileButton.click()
  await page.getByRole('menuitem', { name: accountMenuContent.switchAccount }).click()
  await page.getByRole('menuitem', { name: accountMenuContent.logout }).click()
  await page.waitForURL(user.role === 'admin' ? adminBaseUrl + loginRoutes.login : loginRoutes.login, { timeout: timeouts.page.navigation })
}
