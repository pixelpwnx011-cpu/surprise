/**
 * PERSONALIZE THIS FILE.
 * The birthday instant is fixed to midnight at the start of 4 Nov 2026 in India.
 * 2026-11-03T18:30:00.000Z is exactly 2026-11-04 00:00:00 Asia/Kolkata.
 */
export const birthdayConfig = {
  friendName: 'Mayank',
  nickname: 'Manku',
  headingBefore: 'Something special is coming...',
  headingAfter: 'HAPPY BIRTHDAY, {name}! 🎉',
  subtitle: 'A little countdown for a very big celebration.',
  intro: 'The confetti is ready, the surprises are waiting, and your day is almost here.',
  birthdayNote: `Dear {nickname},

Happy birthday, you absolute legend! 🥳

I hope this year brings you ridiculous amounts of happiness, unforgettable memories, and plenty of reasons to laugh. Thanks for being you.

Now go enjoy your surprise. You deserve it!

— Your favourite human`,
  footerText: 'Made with a little extra love, just for you.',
  decorativeText: 'good things take time',
  // This must be your deployed Cloudflare Worker URL. Do not put the Drive URL here.
  redirectEndpoint: 'https://birthday-surprise-redirect.abhayanand061.workers.dev/open',
  // Actual instant: 4 Nov 2026, 00:00:00 India Standard Time.
  unlockAt: '2026-11-03T18:30:00.000Z',
  theme: {
    cream: '#fff8f2',
    ink: '#342b46',
    pink: '#f7a9bd',
    lavender: '#c8b8f4',
    peach: '#ffc5a6',
    yellow: '#ffe28a',
    blue: '#a9d9f2',
    accent: '#ed7093'
  }
} as const;
