import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    loadComponent: () =>
      import('./features/home/home').then((m) => m.HomeComponent),
  },
  {
    path: 'movie/:id',
    loadComponent: () =>
      import('./features/movie-details/movie-details').then((m) => m.MovieDetailsComponent),
  },
  {
    path: '**',
    redirectTo: 'home',
  },
];
