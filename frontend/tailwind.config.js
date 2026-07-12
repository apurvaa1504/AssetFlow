/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // AssetFlow token system — cool slate surfaces, steel-navy primary,
        // teal accent for live/active states. Status colors map 1:1 to
        // asset_status / booking_status / maintenance_status enums.
        bg: '#F5F6F8',
        surface: '#FFFFFF',
        ink: '#12172B',
        muted: '#5B6478',
        line: '#E4E7EC',
        primary: {
          DEFAULT: '#2E4374',
          light: '#3D5691',
          dark: '#1C2B4D',
        },
        accent: {
          DEFAULT: '#0F9D8C',
          light: '#E5F6F3',
        },
        status: {
          available: '#2E9B5D',
          allocated: '#2E4374',
          reserved: '#7B5CC7',
          maintenance: '#D98C2B',
          lost: '#C7402E',
          retired: '#8A8F9C',
          disposed: '#5B6478',
        },
        warn: {
          DEFAULT: '#D98C2B',
          light: '#FCF1E1',
        },
        danger: {
          DEFAULT: '#C7402E',
          light: '#FBE9E7',
        },
        good: {
          DEFAULT: '#2E9B5D',
          light: '#E7F5EC',
        },
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
      borderRadius: {
        card: '10px',
      },
      boxShadow: {
        card: '0 1px 2px rgba(18,23,43,0.06), 0 1px 1px rgba(18,23,43,0.04)',
      },
    },
  },
  plugins: [],
};
