import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../environments/environment';

/**
 Interceptor funcional que injeta a API key em todas as requisições para TMDB
 */
export const apiKeyInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.url.includes(environment.tmdb.apiUrl)) {
    // Clona a requisição e adiciona a API key como parâmetro
    const clonedRequest = req.clone({
      setParams: {
        api_key: environment.tmdb.apiKey,
      },
    });

    return next(clonedRequest);
  }

  return next(req);
};
