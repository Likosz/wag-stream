import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

/**
 Interceptor funcional para tratamento de erros HTTP
 */
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const toastr = inject(ToastrService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'Ocorreu um erro desconhecido';

      if (error.error instanceof ErrorEvent) {
        errorMessage = `Erro: ${error.error.message}`;
      } else {
        // Erro do lado do servidor
        switch (error.status) {
          case 401:
            errorMessage = 'API key inválida ou não autorizada';
            break;
          case 404:
            errorMessage = 'Recurso não encontrado';
            break;
          case 429:
            errorMessage = 'Limite de requisições excedido. Tente novamente mais tarde';
            break;
          case 500:
            errorMessage = 'Erro interno do servidor';
            break;
          default:
            errorMessage =
              error.error?.status_message || `Erro ${error.status}: ${error.statusText}`;
        }
      }

      console.error('HTTP Error:', {
        status: error.status,
        message: errorMessage,
        url: req.url,
        error: error.error,
      });

      toastr.error(errorMessage, 'Erro', {
        timeOut: 5000,
      });

      return throwError(() => new Error(errorMessage));
    })
  );
};
