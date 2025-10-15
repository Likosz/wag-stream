import { Pipe, PipeTransform, inject, effect } from '@angular/core';
import { LanguageService } from '../services/language.service';
import { translations } from '../i18n/translations';

@Pipe({
  name: 'translate',
  standalone: true,
  pure: false,
})
export class TranslatePipe implements PipeTransform {
  private languageService = inject(LanguageService);

  transform(key: string, params?: Record<string, any>): string {
    const lang = this.languageService.currentLanguage();
    const keys = key.split('.');

    let value: any = translations[lang];
    for (const k of keys) {
      value = value?.[k];
      if (!value) break;
    }

    if (typeof value !== 'string') {
      console.warn(`Translation key not found: ${key}`);
      return key;
    }

    // Replace params like {{days}} with actual values
    if (params) {
      return Object.entries(params).reduce(
        (text, [param, val]) => text.replace(`{{${param}}}`, String(val)),
        value
      );
    }

    return value;
  }
}
