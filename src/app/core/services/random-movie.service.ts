import { Injectable, inject, signal } from '@angular/core';
import { TmdbService } from './tmdb.service';
import { Movie } from '../models';
import { Observable, forkJoin } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

export interface Genre {
  id: number;
  name: string;
  translationKey?: string;
}

@Injectable({
  providedIn: 'root',
})
export class RandomMovieService {
  private tmdbService = inject(TmdbService);
  private readonly VIEWED_CACHE_KEY = 'wagstream_viewed_randoms';
  private readonly MAX_CACHE_SIZE = 50;

  // Gêneros do TMDB com chaves de tradução
  readonly genres: Genre[] = [
    { id: 28, name: 'Action', translationKey: 'genres.action' },
    { id: 12, name: 'Adventure', translationKey: 'genres.adventure' },
    { id: 16, name: 'Animation', translationKey: 'genres.animation' },
    { id: 35, name: 'Comedy', translationKey: 'genres.comedy' },
    { id: 80, name: 'Crime', translationKey: 'genres.crime' },
    { id: 99, name: 'Documentary', translationKey: 'genres.documentary' },
    { id: 18, name: 'Drama', translationKey: 'genres.drama' },
    { id: 10751, name: 'Family', translationKey: 'genres.family' },
    { id: 14, name: 'Fantasy', translationKey: 'genres.fantasy' },
    { id: 36, name: 'History', translationKey: 'genres.history' },
    { id: 27, name: 'Horror', translationKey: 'genres.horror' },
    { id: 10402, name: 'Music', translationKey: 'genres.music' },
    { id: 9648, name: 'Mystery', translationKey: 'genres.mystery' },
    { id: 10749, name: 'Romance', translationKey: 'genres.romance' },
    { id: 878, name: 'Science Fiction', translationKey: 'genres.sciFi' },
    { id: 53, name: 'Thriller', translationKey: 'genres.thriller' },
    { id: 10752, name: 'War', translationKey: 'genres.war' },
    { id: 37, name: 'Western', translationKey: 'genres.western' },
  ];

  isLoading = signal(false);

  /**
   Sorteia filmes aleatórios com anti-repetição
   */
  getRandomMovies(genreId: number | null, count: number = 5): Observable<Movie[]> {
    this.isLoading.set(true);

    return this.getRandomPage(genreId).pipe(
      switchMap((randomPage) => {
        const pagesToFetch = [randomPage, randomPage + 1, randomPage + 2]
          .filter((p) => p <= 500)
          .slice(0, 2);

        const requests = pagesToFetch.map((page) =>
          this.tmdbService.discoverMovies({
            page,
            with_genres: genreId?.toString(),
            sort_by: this.getRandomSortBy(),
            'vote_average.gte': 5,
          })
        );

        return forkJoin(requests);
      }),
      map((responses) => {
        // Combina todas as respostas
        const allMovies = responses.flatMap((r) => r.results);

        // Remove filmes já vistos
        const viewedIds = this.getViewedMovies();
        const unseenMovies = allMovies.filter((m) => !viewedIds.includes(m.id));

        const moviesToShuffle = unseenMovies.length >= count ? unseenMovies : allMovies;

        const shuffled = this.shuffleArray(moviesToShuffle);
        const selected = shuffled.slice(0, count);

        this.addToViewedCache(selected.map((m) => m.id));

        this.isLoading.set(false);
        return selected;
      })
    );
  }

  /**
   Sorteia uma página aleatória
   */
  private getRandomPage(genreId: number | null): Observable<number> {
    return this.tmdbService
      .discoverMovies({
        page: 1,
        with_genres: genreId?.toString(),
      })
      .pipe(
        map((response) => {
          const maxPage = Math.min(response.total_pages, 500); // TMDB limit
          return Math.floor(Math.random() * maxPage) + 1;
        })
      );
  }

  private getRandomSortBy(): string {
    const sortOptions = [
      'popularity.desc',
      'vote_average.desc',
      'release_date.desc',
      'revenue.desc',
    ];
    return sortOptions[Math.floor(Math.random() * sortOptions.length)];
  }

  private shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  /**
   * Carrega filmes já vistos do cache
   */
  private getViewedMovies(): number[] {
    if (typeof window === 'undefined') return [];

    try {
      const stored = localStorage.getItem(this.VIEWED_CACHE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  private addToViewedCache(movieIds: number[]): void {
    if (typeof window === 'undefined') return;

    try {
      const current = this.getViewedMovies();
      const updated = [...new Set([...current, ...movieIds])]; // Remove duplicatas

      const trimmed = updated.slice(-this.MAX_CACHE_SIZE);

      localStorage.setItem(this.VIEWED_CACHE_KEY, JSON.stringify(trimmed));
    } catch (error) {
      console.error('Error saving viewed cache:', error);
    }
  }

  clearViewedCache(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(this.VIEWED_CACHE_KEY);
  }
}
