/**
 * Coach Profile Lifecycle Constants
 *
 * Constants specific to coach profile lifecycle tests
 */
export const coachProfileLifecycleConstants = {
  routes: {
    coachDashboard: /\/c/,
    clientDashboard: /\/b/,
    coachProfile: '/c/account/profile',
    onboarding: /\/onboarding\/2/,
  },
  onboarding: {
    heading: /complete.*account/i,
    countryOption: 'Philippines',
    termsCheckbox: /agree.*Privacy Policy.*Terms of Use/i,
    submitButton: /continue|submit|complete/i,
  },
  adminApproval: {
    statusPending: /Pending/i,
    statusCompleted: /Completed/i,
  },
  profile: {
    labels: {
      username: /Username/i,
      firstName: /First Name/i,
      lastName: /Last Name/i,
      country: /Country/i,
      phoneNumber: /Phone Number/i,
      headline: /Headline/i,
      bio: /Bio/i,
    },
    sections: {
      headline: /Headline/i,
      bio: /Bio/i,
      certifications: /Certifications/i,
      experience: /Experience/i,
      specializations: /Specializations/i,
      socialAccounts: /Social Platforms/i,
    },
    buttons: {
      addCertification: /add.*certification/i,
      addExperience: /add.*experience/i,
      addSocial: /add.*social/i,
    },
  },
  sampleData: {
    headline: 'Senior AI Consultant & Coach',
    bio: 'I help businesses implement AI agents and automated workflows.',
    adminBio: 'Approved after verification of credentials.',
    certification: {
      title: 'Certified AI Specialist',
      organization: 'AI Institute',
      date: '2023-01-01',
      url: 'https://example.com/cert',
    },
    experience: {
      title: 'Lead AI Engineer',
      company: 'Tech Solutions',
      years: '5',
      months: '6',
    },
    specializations: ['AI', 'Business', 'Marketing'],
    socialAccount: {
      platform: 'LinkedIn',
      url: 'https://linkedin.com/in/testcoach',
    },
  },
  profileSwitches: [
    'Completed Business Consultant Accelerator',
    'Completed Video Resources',
    'Completed Live Call',
    'Completed Quizzes',
  ],
} as const
