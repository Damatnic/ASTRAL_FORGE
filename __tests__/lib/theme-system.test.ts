/**
 * Theme System Tests
 * Tests for theme management without minimalist theme
 */

import { ThemeSystem, ThemeName, Theme } from '../../lib/theme-system'

describe('ThemeSystem', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear()
  })

  describe('getAllThemes', () => {
    it('should return only gaming themes (cyberpunk, fantasy, retro)', () => {
      const themes = ThemeSystem.getAllThemes()
      
      expect(themes).toHaveLength(3)
      expect(themes.map((t: Theme) => t.id)).toEqual(['cyberpunk', 'fantasy', 'retro'])
    })

    it('should not include minimalist theme', () => {
      const themes = ThemeSystem.getAllThemes()
      
      // Type assertion needed since 'minimalist' is no longer a valid ThemeName
      const hasMinimalist = themes.some((t: Theme) => t.id === ('minimalist' as ThemeName))
      expect(hasMinimalist).toBe(false)
    })

    it('should return themes with required properties', () => {
      const themes = ThemeSystem.getAllThemes()
      
      themes.forEach((theme: Theme) => {
        expect(theme).toHaveProperty('id')
        expect(theme).toHaveProperty('name')
        expect(theme).toHaveProperty('description')
        expect(theme).toHaveProperty('icon')
        expect(theme).toHaveProperty('colors')
        expect(theme).toHaveProperty('gradients')
        expect(theme).toHaveProperty('effects')
        expect(theme).toHaveProperty('fonts')
      })
    })
  })

  describe('getTheme', () => {
    it('should return cyberpunk theme when requested', () => {
      const theme = ThemeSystem.getTheme('cyberpunk')
      
      expect(theme.id).toBe('cyberpunk')
      expect(theme.name).toBe('Cyberpunk')
      expect(theme.effects.glow).toBe(true)
      expect(theme.effects.particles).toBe(true)
    })

    it('should return fantasy theme when requested', () => {
      const theme = ThemeSystem.getTheme('fantasy')
      
      expect(theme.id).toBe('fantasy')
      expect(theme.name).toBe('Fantasy')
      expect(theme.icon).toBe('⚔️')
    })

    it('should return retro theme when requested', () => {
      const theme = ThemeSystem.getTheme('retro')
      
      expect(theme.id).toBe('retro')
      expect(theme.name).toBe('Retro')
      expect(theme.effects.scanlines).toBe(true)
    })

    it('should fallback to cyberpunk theme for invalid theme ID', () => {
      const theme = ThemeSystem.getTheme('invalid-theme' as ThemeName)
      
      expect(theme.id).toBe('cyberpunk')
    })
  })

  describe('applyTheme', () => {
    it('should set CSS variables on document root', () => {
      const theme = ThemeSystem.getTheme('cyberpunk')
      ThemeSystem.applyTheme(theme)
      
      const root = document.documentElement
      expect(root.style.getPropertyValue('--color-primary')).toBe('#00ffff')
      expect(root.style.getPropertyValue('--color-background')).toBe('#000000')
    })

    it('should store theme ID in localStorage', () => {
      const theme = ThemeSystem.getTheme('fantasy')
      ThemeSystem.applyTheme(theme)
      
      expect(localStorage.getItem('theme')).toBe('fantasy')
    })

    it('should apply all color values', () => {
      const theme = ThemeSystem.getTheme('retro')
      ThemeSystem.applyTheme(theme)
      
      const root = document.documentElement
      Object.keys(theme.colors).forEach(key => {
        expect(root.style.getPropertyValue(`--color-${key}`)).toBeTruthy()
      })
    })
  })

  describe('getCurrentTheme', () => {
    it('should return cyberpunk theme by default', () => {
      const theme = ThemeSystem.getCurrentTheme()
      
      expect(theme.id).toBe('cyberpunk')
    })

    it('should return stored theme from localStorage', () => {
      localStorage.setItem('theme', 'fantasy')
      const theme = ThemeSystem.getCurrentTheme()
      
      expect(theme.id).toBe('fantasy')
    })

    it('should fallback to cyberpunk if stored theme is invalid', () => {
      localStorage.setItem('theme', 'minimalist')
      const theme = ThemeSystem.getCurrentTheme()
      
      expect(theme.id).toBe('cyberpunk')
    })
  })

  describe('Theme Properties', () => {
    it('cyberpunk theme should have gaming effects enabled', () => {
      const theme = ThemeSystem.getTheme('cyberpunk')
      
      expect(theme.effects.glow).toBe(true)
      expect(theme.effects.particles).toBe(true)
      expect(theme.effects.scanlines).toBe(true)
      expect(theme.effects.animations).toBe('full')
    })

    it('fantasy theme should have appropriate gaming settings', () => {
      const theme = ThemeSystem.getTheme('fantasy')
      
      expect(theme.effects.glow).toBe(true)
      expect(theme.effects.particles).toBe(false) // No tech particles in fantasy
      expect(theme.effects.animations).toBe('full')
    })

    it('retro theme should have full gaming effects', () => {
      const theme = ThemeSystem.getTheme('retro')
      
      expect(theme.effects.glow).toBe(true)
      expect(theme.effects.particles).toBe(true)
      expect(theme.effects.scanlines).toBe(true)
      expect(theme.effects.animations).toBe('full')
    })

    it('all themes should have complete color palettes', () => {
      const themes = ThemeSystem.getAllThemes()
      
      const requiredColors = [
        'primary', 'secondary', 'accent', 'background', 'surface',
        'text', 'textSecondary', 'success', 'warning', 'danger'
      ]
      
      themes.forEach((theme: Theme) => {
        requiredColors.forEach(color => {
          expect(theme.colors).toHaveProperty(color)
          expect(typeof theme.colors[color as keyof typeof theme.colors]).toBe('string')
        })
      })
    })

    it('all themes should have complete gradient definitions', () => {
      const themes = ThemeSystem.getAllThemes()
      
      const requiredGradients = ['primary', 'secondary', 'accent', 'hero']
      
      themes.forEach((theme: Theme) => {
        requiredGradients.forEach(gradient => {
          expect(theme.gradients).toHaveProperty(gradient)
          expect(typeof theme.gradients[gradient as keyof typeof theme.gradients]).toBe('string')
        })
      })
    })
  })

  describe('Type Safety', () => {
    it('ThemeName type should only accept gaming themes', () => {
      const validThemes: ThemeName[] = ['cyberpunk', 'fantasy', 'retro']
      
      validThemes.forEach(themeName => {
        const theme = ThemeSystem.getTheme(themeName)
        expect(theme).toBeDefined()
      })
    })
  })
})
