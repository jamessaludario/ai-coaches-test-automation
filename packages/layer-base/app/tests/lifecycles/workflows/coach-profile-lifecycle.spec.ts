import type { UserCredentials } from '../constants'
import { coachProfileLifecycleConstants, timeouts } from '../constants'
import { test } from '../fixtures'
import {
  adminCreatesAndVerifiesUsers,
  approveCoachProfile,
  clientVerifiesCoachNotVisible,
  clientVerifiesCoachProfile,
  coachCompletesProfileConfiguration,
  completeUserOnboarding,
} from '../helpers'
import { generateUserTestData, getTimestamp } from '../utils'

/**
 * Complete Coach Profile Lifecycle Integration Tests
 * Tests the full workflow from user creation through profile approval to client verification
 */

test.describe('Complete Coach Profile Lifecycle', () => {
  test.setTimeout(timeouts.workflow.fullWorkflow)

  // Shared test data containers
  let clientData: UserCredentials
  let coachData: UserCredentials
  let clientPassword!: string
  let coachPassword!: string

  test('phase 1-6: Complete coach profile setup and verification workflow', async ({ page, browser }) => {
    const timestamp = getTimestamp()

    // Generate unique user data
    clientData = generateUserTestData('client', timestamp)
    coachData = generateUserTestData('coach', timestamp)

    // ==================== PHASE 1: USER GENERATION (ADMIN) ====================
    await test.step('Phase 1: Admin creates client and coach users', async () => {
      const passwords = await adminCreatesAndVerifiesUsers(page, [clientData, coachData])
      clientPassword = passwords[0]!
      coachPassword = passwords[1]!
      await page.close()
    })

    // ==================== PHASE 2: COACH ACCOUNT ONBOARDING ====================
    await test.step('Phase 2: Coach completes onboarding', async () => {
      const coachContext = await browser.newContext()
      const coachPage = await coachContext.newPage()

      await completeUserOnboarding(
        coachPage,
        coachData.email,
        coachPassword,
        {
          username: coachData.username,
          firstName: coachData.firstName,
          lastName: coachData.lastName,
          phoneNumber: '+639987654321',
        },
        coachProfileLifecycleConstants.routes.clientDashboard,
      )

      await coachPage.close()
      await coachContext.close()
    })

    // ==================== PHASE 3: CLIENT ACCOUNT ONBOARDING ====================
    await test.step('Phase 3: Client completes onboarding and searches for coach', async () => {
      const clientContext = await browser.newContext()
      const clientPage = await clientContext.newPage()

      await completeUserOnboarding(
        clientPage,
        clientData.email,
        clientPassword,
        {
          username: clientData.username,
          firstName: clientData.firstName,
          lastName: clientData.lastName,
          phoneNumber: '+639123456789',
        },
        coachProfileLifecycleConstants.routes.clientDashboard,
      )

      await clientPage.waitForLoadState('networkidle')
      await clientVerifiesCoachNotVisible(clientPage, coachData)

      await clientPage.close()
      await clientContext.close()
    })

    // ==================== PHASE 4: COACH PROFILE APPROVAL (ADMIN) ====================
    await test.step('Phase 4: Admin approves coach profile', async () => {
      const adminContext = await browser.newContext()
      const adminPage = await adminContext.newPage()

      await approveCoachProfile(adminPage, coachData.email, true)

      await adminPage.close()
      await adminContext.close()
    })

    // ==================== PHASE 5: COACH PROFILE CONFIGURATION ====================
    await test.step('Phase 5: Coach completes profile configuration', async () => {
      const coachContext = await browser.newContext()
      const coachPage = await coachContext.newPage()

      await coachCompletesProfileConfiguration(
        coachPage,
        coachData.email,
        coachPassword,
        coachProfileLifecycleConstants.sampleData,
        coachProfileLifecycleConstants.profile.sections,
        coachProfileLifecycleConstants.routes.coachProfile,
      )

      await coachPage.close()
      await coachContext.close()
    })

    // ==================== PHASE 6: CLIENT VERIFICATION ====================
    await test.step('Phase 6: Client verifies coach profile', async () => {
      const clientContext = await browser.newContext()
      const clientPage = await clientContext.newPage()

      await clientVerifiesCoachProfile(
        clientPage,
        clientData.email,
        clientPassword,
        coachData,
        {
          bio: coachProfileLifecycleConstants.sampleData.bio,
          experienceSection: coachProfileLifecycleConstants.profile.sections.experience,
          experienceTitle: coachProfileLifecycleConstants.sampleData.experience.title,
          certificationsSection: coachProfileLifecycleConstants.profile.sections.certifications,
          certificationTitle: coachProfileLifecycleConstants.sampleData.certification.title,
        },
      )

      await clientPage.close()
      await clientContext.close()
    })
  })
})
