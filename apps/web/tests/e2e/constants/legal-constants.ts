import { legalRoutes } from './routes-constants'

export const legalContent = {
  pages: [
    {
      path: legalRoutes.privacyPolicyClient,
      name: 'Client Privacy Policy',
      heading: /Privacy Policy \(For Clients\)/i,
      keywords: ['information', 'data', 'privacy', 'personal'],
      homepageLinkName: 'Privacy',
      role: 'client',
    },
    {
      path: legalRoutes.termsAndConditionsClient,
      name: 'Client Terms',
      heading: /Terms and Conditions/i,
      keywords: ['terms', 'agreement', 'service', 'conditions'],
      homepageLinkName: 'Terms of Use',
      role: 'client',
    },
    {
      path: legalRoutes.privacyPolicyCoach,
      name: 'Coach Privacy Policy',
      heading: /Privacy Policy \(For Coaches\)/i,
      keywords: ['information', 'data', 'privacy', 'personal'],
      homepageLinkName: 'Privacy',
      role: 'coach',
    },
    {
      path: legalRoutes.termsAndConditionsCoach,
      name: 'Coach Terms',
      heading: /Terms and Conditions/i,
      keywords: ['terms', 'agreement', 'service', 'conditions'],
      homepageLinkName: 'Terms of Use',
      role: 'coach',
    },
  ],
} as const
