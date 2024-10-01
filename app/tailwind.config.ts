import type { Config } from 'tailwindcss';
const withMT = require('@material-tailwind/react/utils/withMT');

const config: Config = withMT({
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx,mdx,html}'],
  theme: {
    extend: {},
  },
  plugins: [require('@tailwindcss/typography'), require('daisyui')],
  daisyui: {
    themes: [
      {
        olight: {
          primary: '#fbedbc',
          'primary-focus': '#fce8a1',
          'primary-content': '#ffffff',

          secondary: '#ffdbb3',
          'secondary-focus': '#fdd4a5',
          'secondary-content': '#ffffff',

          accent: '#ffcccc',
          'accent-focus': '#ffbdbd',
          'accent-content': '#ffffff',

          neutral: '#b5b5b5',
          'neutral-focus': '#8f8f8f',
          'neutral-content': '#ffffff',

          'base-100': '#ffffff',
          'base-200': '#f9fafb',
          'base-300': '#b7babe',
          'base-content': '#1e2734',

          info: '#8ac5f5',
          success: '#6fb3ad',
          warning: '#ffd494',
          error: '#fe9676',

          '--rounded-box': '1rem',
          '--rounded-btn': '.5rem',
          '--rounded-badge': '1.9rem',

          '--animation-btn': '.25s',
          '--animation-input': '.2s',

          '--btn-text-case': 'uppercase',
          '--navbar-padding': '.5rem',
          '--border-btn': '1px',
        },
      },
      {
        odark: {
          primary: '#fdf2c9',
          'primary-focus': '#f8e8af',
          'primary-content': '#666666',

          secondary: '#ffe2c2',
          'secondary-focus': '#ffdeb8',
          'secondary-content': '#666666',

          accent: '#ffe0e0',
          'accent-focus': '#ffcccc',
          'accent-content': '#666666',

          neutral: '#bfbfbf',
          'neutral-focus': '#9e9e9e',
          'neutral-content': '#666666',

          'base-100': '#494b50',
          'base-200': '#525252',
          'base-300': '#4f4f4f',
          'base-content': '#ffffff',

          info: '#a4d0f4',
          success: '#80b3ae',
          warning: '#ffdca8',
          error: '#ffa185',

          '--rounded-box': '1rem',
          '--rounded-btn': '.5rem',
          '--rounded-badge': '1.9rem',

          '--animation-btn': '.25s',
          '--animation-input': '.2s',

          '--btn-text-case': 'uppercase',
          '--navbar-padding': '.5rem',
          '--border-btn': '1px',
        },
      },
    ],
  },
});

export default config;
