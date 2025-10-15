import { Injectable, signal, effect } from '@angular/core';

export type Theme = 'light' | 'dark';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly STORAGE_KEY = 'wagstream_theme';
  private readonly THEME_ATTRIBUTE = 'data-theme';

  currentTheme = signal<Theme>(this.loadThemeFromStorage());

  // Computed para verificar se está em dark mode
  isDarkMode = signal<boolean>(this.currentTheme() === 'dark');

  constructor() {
    // Aplica o tema inicial
    this.applyTheme(this.currentTheme());

    effect(() => {
      const theme = this.currentTheme();
      this.applyTheme(theme);
      this.saveThemeToStorage(theme);
      this.isDarkMode.set(theme === 'dark');
    });
  }

  private loadThemeFromStorage(): Theme {
    if (typeof window === 'undefined') return 'dark';

    try {
      const stored = localStorage.getItem(this.STORAGE_KEY) as Theme | null;
      if (stored && (stored === 'light' || stored === 'dark')) {
        return stored;
      }

      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      return prefersDark ? 'dark' : 'light';
    } catch (error) {
      console.error('Error loading theme from storage:', error);
      return 'dark';
    }
  }

  /**
    Salva tema no LocalStorage
   */
  private saveThemeToStorage(theme: Theme): void {
    if (typeof window === 'undefined') return;

    try {
      localStorage.setItem(this.STORAGE_KEY, theme);
    } catch (error) {
      console.error('Error saving theme to storage:', error);
    }
  }

  private applyTheme(theme: Theme): void {
    if (typeof document === 'undefined') return;

    document.documentElement.setAttribute(this.THEME_ATTRIBUTE, theme);
  }

  toggleTheme(): void {
    const newTheme: Theme = this.currentTheme() === 'dark' ? 'light' : 'dark';
    this.currentTheme.set(newTheme);
  }

  setTheme(theme: Theme): void {
    this.currentTheme.set(theme);
  }
}
