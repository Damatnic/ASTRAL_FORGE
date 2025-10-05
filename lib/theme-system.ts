/**
 * Theme System
 * Multiple visual themes for customization
 */

export type ThemeName = 'cyberpunk' | 'fantasy' | 'retro'

export interface Theme {
  id: ThemeName
  name: string
  description: string
  icon: string
  
  // Color scheme
  colors: {
    primary: string
    secondary: string
    accent: string
    background: string
    surface: string
    text: string
    textSecondary: string
    success: string
    warning: string
    danger: string
  }
  
  // Gradients
  gradients: {
    primary: string
    secondary: string
    accent: string
    hero: string
  }
  
  // Effects
  effects: {
    glow: boolean
    particles: boolean
    scanlines: boolean
    animations: 'full' | 'reduced' | 'none'
  }
  
  // Fonts
  fonts: {
    heading: string
    body: string
    mono: string
  }
}

export class ThemeSystem {
  /**
   * Get all available themes
   */
  static getAllThemes(): Theme[] {
    return [
      this.getCyberpunkTheme(),
      this.getFantasyTheme(),
      this.getRetroTheme(),
    ]
  }

  /**
   * Cyberpunk Theme (Default)
   */
  private static getCyberpunkTheme(): Theme {
    return {
      id: 'cyberpunk',
      name: 'Cyberpunk',
      description: 'Neon-lit dystopian future with glowing accents',
      icon: '🌃',
      colors: {
        primary: '#00ffff', // Cyan
        secondary: '#0080ff', // Blue
        accent: '#ff00ff', // Magenta
        background: '#000000', // Black
        surface: '#1a1a2e', // Dark blue-gray
        text: '#ffffff', // White
        textSecondary: '#a0a0a0', // Gray
        success: '#00ff80', // Green
        warning: '#ffd700', // Gold
        danger: '#ff4444', // Red
      },
      gradients: {
        primary: 'from-cyan-500 to-blue-500',
        secondary: 'from-purple-500 to-pink-500',
        accent: 'from-yellow-400 via-orange-500 to-red-500',
        hero: 'from-cyan-900 via-blue-900 to-purple-900',
      },
      effects: {
        glow: true,
        particles: true,
        scanlines: true,
        animations: 'full',
      },
      fonts: {
        heading: 'font-bold',
        body: 'font-normal',
        mono: 'font-mono',
      },
    }
  }

  /**
   * Fantasy Theme
   */
  private static getFantasyTheme(): Theme {
    return {
      id: 'fantasy',
      name: 'Fantasy',
      description: 'Medieval RPG with magical elements',
      icon: '⚔️',
      colors: {
        primary: '#d4af37', // Gold
        secondary: '#8b4513', // Brown
        accent: '#9370db', // Purple
        background: '#1a0f0a', // Dark brown
        surface: '#2d1810', // Brown
        text: '#f5e6d3', // Parchment
        textSecondary: '#a0826d', // Tan
        success: '#228b22', // Forest green
        warning: '#ff8c00', // Dark orange
        danger: '#8b0000', // Dark red
      },
      gradients: {
        primary: 'from-yellow-600 to-orange-700',
        secondary: 'from-purple-600 to-pink-600',
        accent: 'from-green-600 to-emerald-700',
        hero: 'from-amber-900 via-orange-900 to-red-900',
      },
      effects: {
        glow: true,
        particles: false,
        scanlines: false,
        animations: 'full',
      },
      fonts: {
        heading: 'font-bold',
        body: 'font-normal',
        mono: 'font-serif',
      },
    }
  }

  /**
   * Retro Theme
   */
  private static getRetroTheme(): Theme {
    return {
      id: 'retro',
      name: 'Retro',
      description: '80s aesthetic with vibrant colors',
      icon: '📼',
      colors: {
        primary: '#ff6b9d', // Hot pink
        secondary: '#c06c84', // Mauve
        accent: '#f67280', // Coral
        background: '#2c003e', // Deep purple
        surface: '#3d0054', // Purple
        text: '#ffffff', // White
        textSecondary: '#e0b0ff', // Mauve
        success: '#39ff14', // Neon green
        warning: '#ffff00', // Yellow
        danger: '#ff0040', // Neon red
      },
      gradients: {
        primary: 'from-pink-500 to-purple-600',
        secondary: 'from-orange-500 to-red-600',
        accent: 'from-cyan-400 to-blue-500',
        hero: 'from-purple-900 via-pink-900 to-red-900',
      },
      effects: {
        glow: true,
        particles: true,
        scanlines: true,
        animations: 'full',
      },
      fonts: {
        heading: 'font-black',
        body: 'font-normal',
        mono: 'font-mono',
      },
    }
  }

  /**
   * Get theme by ID
   */
  static getTheme(id: ThemeName): Theme {
    return this.getAllThemes().find((theme) => theme.id === id) || this.getCyberpunkTheme()
  }

  /**
   * Apply theme to document
   */
  static applyTheme(theme: Theme): void {
    const root = document.documentElement
    
    // Apply CSS variables
    Object.entries(theme.colors).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key}`, value)
    })
    
    // Store in localStorage
    localStorage.setItem('theme', theme.id)
  }

  /**
   * Get current theme from localStorage
   */
  static getCurrentTheme(): Theme {
    if (typeof window === 'undefined') return this.getCyberpunkTheme()
    
    const stored = localStorage.getItem('theme') as ThemeName
    return stored ? this.getTheme(stored) : this.getCyberpunkTheme()
  }
}

