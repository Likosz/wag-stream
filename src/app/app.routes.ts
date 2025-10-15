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
    path: 'search',
    loadComponent: () =>
      import('./features/search/search').then((m) => m.SearchComponent),
  },
  {
    path: 'movie/:id',
    loadComponent: () =>
      import('./features/movie-details/movie-details').then((m) => m.MovieDetailsComponent),
  },
  {
    path: 'favorites',
    loadComponent: () =>
      import('./features/favorites/favorites').then((m) => m.FavoritesComponent),
  },
  {
    path: 'random',
    loadComponent: () =>
      import('./features/random/random').then((m) => m.RandomComponent),
  },
  {
    path: '**',
    redirectTo: 'home',
  },
];
