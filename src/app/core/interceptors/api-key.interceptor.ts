import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { environment } from '../../environments/environment';
import { LanguageService } from '../services/language.service';

/**
 Interceptor funcional que injeta a API key e idioma em todas as requisições para TMDB
 */
export const apiKeyInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.url.includes(environment.tmdb.apiUrl)) {
    const languageService = inject(LanguageService);

    const clonedRequest = req.clone({
      setParams: {
        api_key: environment.tmdb.apiKey,
        language: languageService.getTMDBLanguage(),
      },
    });

    return next(clonedRequest);
  }

  return next(req);
};
