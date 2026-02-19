import type { UserCredentials } from '../constants'

/**
 * Generate unique user test data based on role and timestamp
 */
export function generateUserTestData(role: 'coach' | 'client' | 'admin', timestamp: string): UserCredentials {
  const capitalizedRole = role.charAt(0).toUpperCase() + role.slice(1)

  return {
    email: `${role}_${timestamp}@test.com`,
    username: `${role}_${timestamp}`,
    firstName: `${capitalizedRole}${timestamp}`,
    lastName: `Test${timestamp}`,
    fullName: `${capitalizedRole}${timestamp} Test${timestamp}`,
    password: `${role}_password_${timestamp}`,
    role,
  }
}
