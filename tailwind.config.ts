import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Warrior Theme - Bronze/Amber/Iron
        'warrior-bronze': '#CD7F32',
        'warrior-bronze-light': '#E5A155',
        'warrior-bronze-dark': '#8B5A2B',
        'warrior-iron': '#434343',
        'warrior-steel': '#71797E',
        'warrior-silver': '#C0C0C0',
        'warrior-crimson': '#DC143C',
        'warrior-crimson-dark': '#8B0000',
        
        // Base colors - Updated for warrior theme
        'astral-dark': '#0a0a0a',
        'astral-gray': '#1a1a1a',
        'astral-light': '#2a2a2a',
        
        // Primary - Now warrior colors
        'primary': '#CD7F32', // Bronze
        'primary-light': '#E5A155',
        'primary-dark': '#8B5A2B',
        
        // Semantic colors
        'success': '#10b981',
        'warning': '#f59e0b',
        'error': '#DC143C', // Crimson
        'info': '#71797E', // Steel
        
        // Gaming tiers - Updated with warrior theme
        'tier-common': '#71797E', // Steel
        'tier-uncommon': '#C0C0C0', // Silver
        'tier-rare': '#CD7F32', // Bronze
        'tier-epic': '#E5A155', // Light Bronze
        'tier-legendary': '#DC143C', // Crimson
        'tier-mythic': '#8B0000', // Dark Crimson
        
        // Status indicators
        'health': '#DC143C', // Crimson
        'mana': '#71797E', // Steel
        'energy': '#CD7F32', // Bronze
        'xp': '#E5A155', // Light Bronze
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'slide-down': 'slideDown 0.4s ease-out',
        'slide-left': 'slideLeft 0.4s ease-out',
        'slide-right': 'slideRight 0.4s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'bounce-subtle': 'bounceSubtle 0.6s ease-in-out',
        'glow': 'glow 2s ease-in-out infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideLeft: {
          '0%': { transform: 'translateX(20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideRight: {
          '0%': { transform: 'translateX(-20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        bounceSubtle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 5px rgba(59, 130, 246, 0.5), 0 0 10px rgba(139, 92, 246, 0.3)' },
          '50%': { boxShadow: '0 0 10px rgba(59, 130, 246, 0.8), 0 0 20px rgba(139, 92, 246, 0.6)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
      },
    },
  },
  plugins: [],
}
export default config


