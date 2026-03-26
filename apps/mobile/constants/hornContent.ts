/**
 * Static content constants extracted from real content pages:
 * - content/pages/about-the-horn.md
 * - content/pages/membership.md
 * - content/pages/hours-horn.md
 *
 * These are curated excerpts for widget display — not full page replicas.
 */

export const HORN_HERO = {
  eyebrow: 'The Heart of Unicorn Gives',
  title: 'The Community Center: The Horn',
  description:
    'The Horn is a nonprofit community space designed to bring people together. Housed in the historic former Lake George Grocery building, The Horn is a place to connect, host gatherings, attend events, and simply spend time in good company — a space rooted in belonging.',
  ctaLabel: 'Join the Community',
  secondaryCtaLabel: 'Explore The Horn',
} as const;

export const HORN_MISSION =
  'Our Mission is to foster a resilient, connected Northern community by providing a safe, upscale, and inclusive haven for collaboration and leisure.';

export const HORN_QUOTE = {
  quote:
    'Give people a place where they belong — a place that feels like home, even before you walk through the door.',
  attribution: 'The Horn, Lake George',
} as const;

export const HORN_PERKS = [
  {
    key: 'access',
    icon: '🔑',
    title: '24/7 Access',
    description: 'Members get key access around the clock, 365 days a year. Your schedule, your space.',
    span: 'full' as const,
    colorScheme: 'surface' as const,
  },
  {
    key: 'lounge',
    icon: '🪵',
    title: 'Members-Only Cigar Lounge',
    description: 'An adults-only space for members who want to BYOB and smoke indoors.',
    span: 'half' as const,
    colorScheme: 'muted' as const,
  },
  {
    key: 'wifi',
    icon: '📶',
    title: 'Free Wi-Fi & Work Space',
    description: 'Reliable Wi-Fi and a comfortable setup for remote work and projects.',
    span: 'half' as const,
    colorScheme: 'secondary' as const,
  },
  {
    key: 'games',
    icon: '🎲',
    title: 'Game Nights',
    description: 'Board games, video games, and regular game nights for friendly competition.',
    span: 'half' as const,
    colorScheme: 'tertiary' as const,
  },
  {
    key: 'latenight',
    icon: '🌙',
    title: 'Late-Night Safe Hangout',
    description:
      'A safe, welcoming place to be after 2 AM. No bar scene, no pressure — just good company.',
    span: 'half' as const,
    colorScheme: 'primary' as const,
  },
];

export const HORN_INFO = {
  title: 'Visit The Horn',
  rows: [
    {
      icon: '📍',
      label: 'Location',
      value: 'Historic former Lake George Grocery, Lake George, MI',
    },
    {
      icon: '🕐',
      label: 'Hours',
      value: 'Public Welcome: 10 AM – 2 PM Daily',
      secondaryValue: 'Member Access: 24/7',
    },
    {
      icon: '💰',
      label: 'Membership',
      value: 'Starting at $40/month individual',
      secondaryValue: 'Couple $60/mo · Family $100/mo · VIP add-on $20/mo',
    },
    {
      icon: '🔗',
      label: 'Sign Up',
      value: 'horn.love',
      href: 'https://horn.love',
    },
  ],
} as const;

export const COMMUNITY_SPIRIT_QUOTE = {
  quote:
    "Our community isn't just a place, it's a practice of coming together.",
  attribution: 'The Unicorn Gives Spirit',
} as const;
