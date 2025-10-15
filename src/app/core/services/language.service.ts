import { Injectable, signal, effect } from '@angular/core';

export type Language = 'pt-BR' | 'en-US';

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  private readonly LANGUAGE_KEY = 'wagstream_language';

  currentLanguage = signal<Language>(this.getInitialLanguage());

  private getInitialLanguage(): Language {
    const saved = localStorage.getItem(this.LANGUAGE_KEY) as Language;
    return saved || 'pt-BR';
  }

  setLanguage(lang: Language) {
    this.currentLanguage.set(lang);
    localStorage.setItem(this.LANGUAGE_KEY, lang);
    window.location.reload();
  }

  toggleLanguage() {
    const newLang = this.currentLanguage() === 'pt-BR' ? 'en-US' : 'pt-BR';
    this.setLanguage(newLang);
  }

  // Retorna o código de idioma para a API do TMDB (pt-BR ou en-US)
  getTMDBLanguage(): string {
    return this.currentLanguage();
  }

  // Retorna apenas o código do idioma (pt ou en)
  getLanguageCode(): string {
    return this.currentLanguage().split('-')[0];
  }
}
