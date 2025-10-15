import { Component, inject, computed, signal, OnInit, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FavoritesService } from '../../core/services/favorites.service';
import { TmdbService } from '../../core/services/tmdb.service';
import { MovieCardComponent } from '../../shared/components/movie-card/movie-card';
import { Movie } from '../../core/models';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-favorites',
  imports: [CommonModule, RouterLink, MovieCardComponent],
  templateUrl: './favorites.html',
  styleUrl: './favorites.scss',
})
export class FavoritesComponent implements OnInit {
  private favoritesService = inject(FavoritesService);
  private tmdbService = inject(TmdbService);

  favoriteMovies = signal<Movie[]>([]);
  isLoading = signal(true);
  hasError = signal(false);

  // Computed para facilitar checks
  hasFavorites = computed(() => this.favoriteMovies().length > 0);
  favoriteCount = computed(() => this.favoriteMovies().length);

  constructor() {
    // Effect que reage automaticamente quando os favoritos mudam
    effect(() => {
      // Observa mudanças nos IDs de favoritos
      const favoriteIds = this.favoritesService.favorites();

      // Se já carregamos pelo menos uma vez e a lista mudou, recarrega
      if (!this.isLoading()) {
        this.loadFavoriteMovies();
      }
    });
  }

  ngOnInit() {
    this.loadFavoriteMovies();
  }

  /**
    Carrega os detalhes de todos os filmes favoritos
   */
  loadFavoriteMovies(): void {
    const favoriteIds = this.favoritesService.favorites();

    if (favoriteIds.length === 0) {
      this.isLoading.set(false);
      return;
    }

    // Busca os detalhes de cada filme favorito
    const movieRequests = favoriteIds.map((id) =>
      this.tmdbService.getMovieDetails(id).pipe(
        catchError((error) => {
          console.error(`Error loading movie ${id}:`, error);
          return of(null);
        })
      )
    );

    forkJoin(movieRequests).subscribe({
      next: (movies) => {
        const validMovies = movies
          .filter((movie) => movie !== null)
          .map((movieDetails) => {
            const movie: Movie = {
              ...movieDetails!,
              genre_ids: movieDetails!.genres?.map((g) => g.id) || [],
            };
            return movie;
          });
        this.favoriteMovies.set(validMovies);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error loading favorite movies:', error);
        this.hasError.set(true);
        this.isLoading.set(false);
      },
    });
  }

  trackByMovieId(index: number, movie: Movie): number {
    return movie.id;
  }
}
