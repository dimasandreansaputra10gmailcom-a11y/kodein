export const theme = {
  colors: {
    skyBlue:    '#87CEEB',
    skyLight:   '#C8E9F5',
    teal:       '#0D9488',
    tealDark:   '#0F766E',
    yellow:     '#F5E642',
    yellowDark: '#EAB308',
    white:      '#FFFFFF',
    navyDark:   '#0D0D1A',
    goldXP:     '#E8B96F',
    softGreen:  '#EAF3DE',
    iceBlue:    '#D4E5F0',
    grayMuted:  '#9CA3AF',
    error:      '#EF4444',
    success:    '#10B981',
  },
  radius: {
    card:    '20px',
    button:  '999px',
    input:   '12px',
    badge:   '999px',
    node:    '50%',
    nodeSquare: '20px',
  },
  shadow: {
    card:   '0 4px 12px rgba(0,0,0,0.08)',
    button: '0 4px 0px #EAB308',
    nodeActive: '0 0 0 5px #F5E642',
    nodeGlow:   '0 0 20px rgba(13,148,136,0.4)',
  },
  font: {
    heading: "'Nunito', 'Poppins', sans-serif",
    body:    "'Nunito', 'Inter', sans-serif",
    code:    "'JetBrains Mono', 'Fira Code', monospace",
  },
  animation: {
    xpPop:     'scale(1.4) → scale(1), duration 400ms, ease-out-back',
    nodeUnlock: 'scale(0.5) opacity(0) → scale(1) opacity(1), duration 600ms',
    pageSlide:  'x(20px) → x(0), duration 300ms, ease-in-out',
    confetti:   'y(0) → y(-80px), scatter, duration 800ms',
  }
};
