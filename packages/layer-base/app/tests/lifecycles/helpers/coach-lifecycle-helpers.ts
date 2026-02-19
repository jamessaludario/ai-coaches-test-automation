import type { Locator, Page } from 'playwright'
import type { UserCredentials } from '../constants'
import { adminBaseUrl, coachProfileLifecycleConstants, sharedAdminRoutes, sharedAdminSelectors, timeouts } from '../constants'
import { expect } from '../fixtures'
import {
  clickTab,
  createNuxtGoto,
  expectCoachProfileVisible,
  expectToastMessage,
  loginAndExpectOnboarding,
  loginAsAdmin,
  loginUser,
  navigateToCoachProfile,
  searchDataTable,
  submitFormAndWaitForSuccess,
  waitForDataTableLoad,
} from '../helpers'
import { CoachProfilePage, LoginPage } from '../page-objects'

/**
 * Create a user via admin interface
 */
export async function createUserViaAdmin(
  page: Page,
  userData: UserCredentials,
): Promise<string> {
  await page.getByRole('button', { name: sharedAdminSelectors.users.createButton }).click()
  await expect(page.getByRole('dialog')).toBeVisible()

  await page.getByLabel(sharedAdminSelectors.forms.firstName).fill(userData.firstName)
  await page.getByLabel(sharedAdminSelectors.forms.lastName).fill(userData.lastName)
  await page.getByLabel(sharedAdminSelectors.forms.email).fill(userData.email)
  await page.getByLabel(sharedAdminSelectors.forms.username).fill(userData.username)

  await page.getByRole('button', { name: sharedAdminSelectors.buttons.generatePassword }).click()

  // Wait for password input to be populated
  const passwordInput = page.getByLabel(sharedAdminSelectors.forms.password, { exact: true })
  await passwordInput.waitFor({ state: 'visible', timeout: timeouts.ui.elementVisible })
  await expect(passwordInput).not.toHaveValue('', { timeout: timeouts.ui.elementVisible })
  const password = await passwordInput.inputValue()

  await submitFormAndWaitForSuccess(
    page,
    sharedAdminSelectors.buttons.continue,
    sharedAdminSelectors.notifications.userCreated,
  )
  await expect(page.getByRole('dialog')).not.toBeVisible()

  await expect(page.getByRole('heading', { name: `${userData.firstName} ${userData.lastName}` })).toBeVisible({ timeout: timeouts.page.pageLoad })

  return password
}

/**
 * Complete onboarding for a user
 */
export async function completeUserOnboarding(
  page: Page,
  email: string,
  password: string,
  userData: { username: string, firstName: string, lastName: string, phoneNumber: string },
  expectedRoute: RegExp,
) {
  const goto = createNuxtGoto(page)
  const loginPage = new LoginPage(page)
  await loginAndExpectOnboarding(goto, loginPage, email, password)

  await expect(
    page.getByRole('heading', { name: coachProfileLifecycleConstants.onboarding.heading }),
  ).toBeVisible()

  await page.getByLabel(coachProfileLifecycleConstants.profile.labels.username).fill(userData.username)
  await page.getByPlaceholder(coachProfileLifecycleConstants.profile.labels.firstName).fill(userData.firstName)
  await page.getByPlaceholder(coachProfileLifecycleConstants.profile.labels.lastName).fill(userData.lastName)

  const countryCombobox = page.getByRole('combobox', { name: coachProfileLifecycleConstants.profile.labels.country })
  await countryCombobox.click()

  await page.getByRole('option', { name: coachProfileLifecycleConstants.onboarding.countryOption }).click()
  await page.getByLabel(coachProfileLifecycleConstants.profile.labels.phoneNumber).fill(userData.phoneNumber)
  await page.getByRole('checkbox', { name: coachProfileLifecycleConstants.onboarding.termsCheckbox }).check()
  await page.getByRole('button', { name: coachProfileLifecycleConstants.onboarding.submitButton }).click()
  await page.waitForURL(expectedRoute, { timeout: timeouts.page.navigation })
}

/**
 * Approve coach profile via admin interface
 */
export async function approveCoachProfile(
  page: Page,
  coachEmail: string,
  addBio: boolean = true,
) {
  const goto = createNuxtGoto(page)
  const loginPage = new LoginPage(page)

  await loginAsAdmin(goto, loginPage)
  await page.goto(new URL(sharedAdminRoutes.users, adminBaseUrl).href)
  await page.waitForLoadState('networkidle')
  await waitForDataTableLoad(page)

  await searchDataTable(page, coachEmail)
  await expect(page.getByRole('cell', { name: coachEmail, exact: true })).toBeVisible()

  const row = page.getByRole('row').filter({ hasText: coachEmail }).first()
  await row.getByLabel('i-lucide-ellipsis').click()
  await page.getByRole('menuitem', { name: /manage/i }).click()
  await page.waitForURL(/\/users\/.*/, { timeout: 10000 })

  await clickTab(page, sharedAdminSelectors.users.tabs.coachProfile)

  await expect(page.getByText(coachProfileLifecycleConstants.adminApproval.statusPending).first()).toBeVisible()

  if (addBio) {
    const bioCard = page.locator('div[data-slot="card"]').filter({
      has: page.locator('h3', { hasText: 'Bio' }),
    })
    await expect(bioCard).toBeVisible()
    await bioCard.locator('.tiptap').fill(coachProfileLifecycleConstants.sampleData.adminBio)
    await bioCard.getByRole('button', { name: sharedAdminSelectors.buttons.save }).click()
    await expectToastMessage(page, /updated|success/i)
  }

  for (const switchName of coachProfileLifecycleConstants.profileSwitches) {
    const switchElement = page.getByRole('switch', { name: switchName })
    await expect(switchElement).toBeVisible({ timeout: timeouts.ui.elementVisible })
    if (await switchElement.getAttribute('data-state') !== 'checked') {
      await switchElement.click()
      await expect(switchElement).toHaveAttribute('data-state', 'checked', { timeout: timeouts.ui.elementVisible })
    }
  }

  expect(await page.getByText(coachProfileLifecycleConstants.adminApproval.statusCompleted, { exact: true }).count()).toBeGreaterThanOrEqual(4)

  const statusCard = page.locator('div[data-slot="card"]').filter({
    has: page.locator('h3', { hasText: 'Status' }),
  })
  await expect(statusCard).toBeVisible()
  await statusCard.getByRole('button', { name: sharedAdminSelectors.buttons.save }).click()
  await expectToastMessage(page, /updated|success/i)

  await expect(page.locator('span[badge="soft-success"]:has-text("APPROVED")')).toBeVisible({ timeout: timeouts.page.pageLoad })
}

/**
 * Fill a coach profile section (headline, bio, specializations)
 */
export async function fillCoachProfileSection(page: Page, sectionName: string | RegExp, value: string) {
  await page.getByRole('heading', { name: sectionName }).first().scrollIntoViewIfNeeded()
  const sectionCard = page.locator('div[data-slot="card"]').filter({
    has: page.locator('h3', { hasText: sectionName }),
  })
  await expect(sectionCard).toBeVisible({ timeout: timeouts.ui.elementVisible })

  const textbox = sectionName === coachProfileLifecycleConstants.profile.sections.bio ? sectionCard.locator('.tiptap') : sectionCard.getByRole('textbox')
  await textbox.fill(value)
  await sectionCard.getByRole('button', { name: sharedAdminSelectors.buttons.save }).click()
  await expectToastMessage(page, /updated|success/i)
}

/**
 * Add a table row entry to coach profile (certifications, experience)
 */
async function addTableRowEntry(
  page: Page,
  sectionHeading: string | RegExp,
  fillCallback: (lastRow: Locator) => Promise<void>,
) {
  const section = page.getByRole('heading', { name: sectionHeading })
  await section.scrollIntoViewIfNeeded()
  const sectionCard = page.locator('div[data-slot="card"]').filter({
    has: page.locator('h3', { hasText: sectionHeading }),
  })
  await expect(sectionCard).toBeVisible({ timeout: timeouts.ui.elementVisible })
  const table = sectionCard.locator('table')
  await expect(table).toBeVisible()
  const tableRows = table.locator('tbody tr')

  await sectionCard.getByRole('button', { name: /Add/i }).click()
  const lastRow = tableRows.last()
  await expect(lastRow).toBeVisible({ timeout: timeouts.ui.elementVisible })

  await fillCallback(lastRow)

  await sectionCard.getByRole('button', { name: sharedAdminSelectors.buttons.save }).click()
  await expectToastMessage(page, /updated|success/i)
}

/**
 * Add certification to coach profile
 */
export async function addCertification(
  page: Page,
  data: { title: string, organization: string, date: string, url: string },
) {
  await addTableRowEntry(
    page,
    coachProfileLifecycleConstants.profile.sections.certifications,
    async (lastRow) => {
      await lastRow.locator('input[name*="title"]').fill(data.title)
      await lastRow.locator('input[name*="issuingOrganization"]').fill(data.organization)
      await lastRow.locator('input[name*="issuingDate"]').fill(data.date)
      await lastRow.locator('input[name*="certificateUrl"]').fill(data.url)
    },
  )
}

/**
 * Add experience to coach profile
 */
export async function addExperience(
  page: Page,
  data: { title: string, company: string, years: string, months: string },
) {
  await addTableRowEntry(
    page,
    coachProfileLifecycleConstants.profile.sections.experience,
    async (lastRow) => {
      await lastRow.locator('input[name*="title"]').fill(data.title)
      await lastRow.locator('input[name*="company"]').fill(data.company)
      await lastRow.locator('input[name*="years"]').fill(data.years)
      await lastRow.locator('input[name*="months"]').fill(data.months)
    },
  )
}

/**
 * Add specializations to coach profile
 */
export async function addSpecializations(page: Page, specializations: readonly string[]) {
  const section = page.getByRole('heading', {
    name: coachProfileLifecycleConstants.profile.sections.specializations,
  })
  await section.scrollIntoViewIfNeeded()
  const sectionCard = page.locator('div[data-slot="card"]').filter({
    has: page.locator('h3', { hasText: coachProfileLifecycleConstants.profile.sections.specializations }),
  })
  await expect(sectionCard).toBeVisible({ timeout: timeouts.ui.elementVisible })
  const specializationsButton = sectionCard.getByRole('button', { name: 'Show popup' })
  await specializationsButton.click()
  for (const specialization of specializations) {
    const option = page.getByRole('option', { name: specialization, exact: true })
    const optionState = await option.getAttribute('data-state')
    if (optionState === 'unchecked') {
      await option.click()
    }
  }
  await sectionCard.getByRole('button', { name: sharedAdminSelectors.buttons.save }).click()
  await expectToastMessage(page, /updated|success/i)
}

/**
 * Add social account to coach profile
 */
export async function addSocialAccount(page: Page, platform: string, url: string) {
  const section = page.getByRole('heading', {
    name: coachProfileLifecycleConstants.profile.sections.socialAccounts,
  })
  await section.scrollIntoViewIfNeeded()

  const socialAccountSectionCard = page.locator('div[data-slot="card"]').filter({
    has: page.locator('h3', { hasText: coachProfileLifecycleConstants.profile.sections.socialAccounts }),
  })
  await expect(socialAccountSectionCard).toBeVisible({ timeout: timeouts.ui.elementVisible })

  const addButton = socialAccountSectionCard.getByRole('button', { name: /Add/i })
  await addButton.click()
  const lastRow = socialAccountSectionCard.locator('table').locator('tbody tr').last()
  await expect(lastRow).toBeVisible({ timeout: timeouts.ui.elementVisible })

  await lastRow.getByRole('combobox').click()
  await page.getByRole('option', { name: new RegExp(platform, 'i') }).click()
  await lastRow.getByRole('textbox').fill(url)
  await socialAccountSectionCard.getByRole('button', { name: sharedAdminSelectors.buttons.save }).click()
  await expectToastMessage(page, /updated|success/i)
}

/**
 * Admin creates and verifies multiple users
 */
export async function adminCreatesAndVerifiesUsers(
  page: Page,
  users: UserCredentials[],
): Promise<string[]> {
  const goto = createNuxtGoto(page)
  const loginPage = new LoginPage(page)

  await loginAsAdmin(goto, loginPage)
  await page.goto(new URL(sharedAdminRoutes.users, adminBaseUrl).href)
  await waitForDataTableLoad(page)

  const passwords: string[] = []

  // Create all users
  for (const userData of users) {
    const password = await createUserViaAdmin(page, userData)
    passwords.push(password)

    await page.goto(new URL(sharedAdminRoutes.users, adminBaseUrl).href)
    await waitForDataTableLoad(page)
  }

  // Verify all users created
  for (const userData of users) {
    await searchDataTable(page, userData.email)
    await expect(page.getByRole('cell', { name: userData.email, exact: true })).toBeVisible()
  }

  return passwords
}

/**
 * Coach completes full profile configuration
 */
export async function coachCompletesProfileConfiguration(
  page: Page,
  coachEmail: string,
  coachPassword: string,
  profileData: typeof coachProfileLifecycleConstants.sampleData,
  profileSections: typeof coachProfileLifecycleConstants.profile.sections,
  coachProfileRoute: string,
): Promise<void> {
  const goto = createNuxtGoto(page)
  const loginPage = new LoginPage(page)

  await loginUser(goto, loginPage, coachEmail, coachPassword)
  await page.goto(coachProfileRoute, { waitUntil: 'networkidle' })

  await fillCoachProfileSection(page, profileSections.headline, profileData.headline)
  await fillCoachProfileSection(page, profileSections.bio, profileData.bio)
  await addCertification(page, profileData.certification)
  await addExperience(page, profileData.experience)
  await addSpecializations(page, profileData.specializations)
  await addSocialAccount(page, profileData.socialAccount.platform, profileData.socialAccount.url)
}

/**
 * Client verifies coach profile is visible with all details
 */
export async function clientVerifiesCoachProfile(
  page: Page,
  clientEmail: string,
  clientPassword: string,
  coach: UserCredentials,
  expectedData: {
    bio: string
    experienceSection: string | RegExp
    experienceTitle: string
    certificationsSection: string | RegExp
    certificationTitle: string
  },
): Promise<void> {
  const goto = createNuxtGoto(page)
  const loginPage = new LoginPage(page)
  const coachProfilePage = new CoachProfilePage(page, goto)

  await loginUser(goto, loginPage, clientEmail, clientPassword)
  await coachProfilePage.navigateToCoachProfile(coach)
  await expectCoachProfileVisible(page, coach.fullName)

  await expect(page.getByText(expectedData.bio)).toBeVisible()
  await expect(page.getByRole('heading', { name: expectedData.experienceSection, exact: true })).toBeVisible()
  await expect(page.getByText(expectedData.experienceTitle)).toBeVisible()
  await expect(page.getByRole('heading', { name: expectedData.certificationsSection, exact: true })).toBeVisible()
  await expect(page.getByText(expectedData.certificationTitle)).toBeVisible()
}

/**
 * Client verifies coach profile is not visible (before approval)
 */
export async function clientVerifiesCoachNotVisible(
  page: Page,
  coach: UserCredentials,
): Promise<void> {
  const coachExisting = await navigateToCoachProfile(page, coach)
  if (coachExisting) {
    throw new Error('Coach profile should not be available to public')
  }
}
