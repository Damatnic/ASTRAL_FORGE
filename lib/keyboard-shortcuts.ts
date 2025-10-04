// Keyboard shortcut system for desktop users
export interface KeyboardShortcut {
  key: string
  ctrl?: boolean
  shift?: boolean
  alt?: boolean
  description: string
  action: () => void
}

export class KeyboardShortcutManager {
  private shortcuts: Map<string, KeyboardShortcut> = new Map()
  private enabled = true

  constructor() {
    if (typeof window !== 'undefined') {
      window.addEventListener('keydown', this.handleKeyDown.bind(this))
    }
  }

  register(id: string, shortcut: KeyboardShortcut) {
    const key = this.getKeyString(shortcut)
    this.shortcuts.set(key, shortcut)
  }

  unregister(id: string) {
    this.shortcuts.delete(id)
  }

  private getKeyString(shortcut: KeyboardShortcut): string {
    const parts = []
    if (shortcut.ctrl) parts.push('ctrl')
    if (shortcut.shift) parts.push('shift')
    if (shortcut.alt) parts.push('alt')
    parts.push(shortcut.key.toLowerCase())
    return parts.join('+')
  }

  private handleKeyDown(event: KeyboardEvent) {
    if (!this.enabled) return

    // Don't trigger shortcuts when user is typing in an input
    const target = event.target as HTMLElement
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
      return
    }

    const keyString = this.getKeyString({
      key: event.key,
      ctrl: event.ctrlKey || event.metaKey, // metaKey for Mac Cmd
      shift: event.shiftKey,
      alt: event.altKey,
      description: '',
      action: () => {},
    })

    const shortcut = this.shortcuts.get(keyString)
    if (shortcut) {
      event.preventDefault()
      shortcut.action()
    }
  }

  enable() {
    this.enabled = true
  }

  disable() {
    this.enabled = false
  }

  getAll(): KeyboardShortcut[] {
    return Array.from(this.shortcuts.values())
  }
}

// Global instance
export const keyboardShortcuts = typeof window !== 'undefined' ? new KeyboardShortcutManager() : null
