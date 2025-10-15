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
    data: { preload: true },
  },
  {
    path: 'search',
    loadComponent: () =>
      import('./features/search/search').then((m) => m.SearchComponent),
    data: { preload: true },
  },
  {
    path: 'movie/:id',
    loadComponent: () =>
      import('./features/movie-details/movie-details').then((m) => m.MovieDetailsComponent),
    data: { preload: true },
  },
  {
    path: 'favorites',
    loadComponent: () =>
      import('./features/favorites/favorites').then((m) => m.FavoritesComponent),
    data: { preload: false },
  },
  {
    path: 'random',
    loadComponent: () =>
      import('./features/random/random').then((m) => m.RandomComponent),
    data: { preload: true },
  },
  {
    path: '**',
    redirectTo: 'home',
  },
];
