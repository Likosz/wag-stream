import { Injectable } from '@angular/core';
import { PreloadingStrategy, Route } from '@angular/router';
import { Observable, of, timer } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class CustomPreloadingStrategy implements PreloadingStrategy {
  preload(route: Route, load: () => Observable<any>): Observable<any> {
    // Se a rota tem data.preload = true, faz preload após 2 segundos
    if (route.data && route.data['preload']) {
      console.log('Preloading route:', route.path);
      return timer(2000).pipe(mergeMap(() => load()));
    }

    return of(null);
  }
}
