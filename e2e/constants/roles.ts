import * as process from 'node:process'

export interface UserCredentials {
  email: string
  password: string
  username: string
  role: 'coach' | 'client' | 'admin'
  fullName: string
  firstName: string
  lastName: string
  phoneNumber?: string
  country?: string
}

export interface InvalidCredentials {
  email: string
  password: string
  expectedError: string | RegExp
}

function ensureEnv(key: string): string {
  const value = process.env[key]
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`)
  }
  return value
}

function parseFullName(fullName: string): { firstName: string, lastName: string } {
  const parts = fullName.trim().split(/\s+/)
  if (parts.length === 1) {
    return { firstName: parts[0]!, lastName: '' }
  }
  return {
    firstName: parts[0]!,
    lastName: parts.slice(1).join(' '),
  }
}

const coachFullName = ensureEnv('COACH_TEST_FULL_NAME')
const clientFullName = ensureEnv('CLIENT_TEST_FULL_NAME')
const adminFullName = ensureEnv('ADMIN_TEST_FULL_NAME')

export const testUsers: Record<'coach' | 'client' | 'admin', UserCredentials> = {
  coach: {
    email: ensureEnv('COACH_TEST_EMAIL'),
    password: ensureEnv('COACH_TEST_PASSWORD'),
    username: 'qa1',
    role: 'coach' as const,
    fullName: coachFullName,
    ...parseFullName(coachFullName),
  },
  client: {
    email: ensureEnv('CLIENT_TEST_EMAIL'),
    password: ensureEnv('CLIENT_TEST_PASSWORD'),
    username: 'qa1',
    role: 'client' as const,
    fullName: clientFullName,
    ...parseFullName(clientFullName),
  },
  admin: {
    email: ensureEnv('ADMIN_TEST_EMAIL'),
    password: ensureEnv('ADMIN_TEST_PASSWORD'),
    username: 'qa1',
    role: 'admin' as const,
    fullName: adminFullName,
    ...parseFullName(adminFullName),
  },
} as const

export const invalidUsers = {
  wrongEmail: {
    email: 'invalid',
    password: 'wrongpassword',
    expectedError: /Please enter a valid email address/i,
  },
  emptyFields: {
    email: '',
    password: '',
    expectedError: /Required/i,
  },
  wrongPassword: {
    email: testUsers.client.email,
    password: 'wrongpassword123',
    expectedError: /These credentials do not match our records|Please enter a valid email address/i,
  },
} as const

export const authContent = {
  emailLabel: /Email/i,
  passwordLabel: /Password/i,
  loginButton: /Log in|Submit/i,
  continue: 'Continue',
} as const

export const accountMenuContent = {
  switchAccount: /Switch Account/i,
  logout: /Log out/i,
} as const
