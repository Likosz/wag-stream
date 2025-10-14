import { Component, OnInit, OnDestroy, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, combineLatest } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, takeUntil } from 'rxjs/operators';
import { TmdbService, DiscoverMovieParams } from '../../core/services/tmdb.service';
import { Movie, Genre } from '../../core/models';
import { MovieCardComponent } from '../../shared/components/movie-card/movie-card';
import { MovieCardSkeletonComponent } from '../../shared/components/movie-card-skeleton/movie-card-skeleton';
import { LucideAngularModule, Search, SlidersHorizontal, X, Filter } from 'lucide-angular';
import { animate, inView } from 'motion';

interface SortOption {
  value: string;
  label: string;
}

@Component({
  selector: 'app-search',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MovieCardComponent,
    MovieCardSkeletonComponent,
    LucideAngularModule,
  ],
  templateUrl: './search.html',
  styleUrl: './search.scss',
})
export class SearchComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  // Icons
  readonly SearchIcon = Search;
  readonly SlidersIcon = SlidersHorizontal;
  readonly XIcon = X;
  readonly FilterIcon = Filter;

  // Form Controls
  searchControl = new FormControl('');

  // Signals
  movies = signal<Movie[]>([]);
  genres = signal<Genre[]>([]);
  isLoading = signal(true);
  hasSearched = signal(false);
  showFilters = signal(false);

  // Filter states
  selectedGenres = signal<number[]>([]);
  selectedYear = signal<number | null>(null);
  selectedRating = signal<number | null>(null);
  selectedSort = signal<string>('popularity.desc');

  // Computed
  filteredMoviesCount = computed(() => this.movies().length);
  hasActiveFilters = computed(
    () =>
      this.selectedGenres().length > 0 ||
      this.selectedYear() !== null ||
      this.selectedRating() !== null ||
      this.selectedSort() !== 'popularity.desc'
  );

  sortOptions: SortOption[] = [
    { value: 'popularity.desc', label: 'Mais Popular' },
    { value: 'popularity.asc', label: 'Menos Popular' },
    { value: 'vote_average.desc', label: 'Melhor Avaliação' },
    { value: 'vote_average.asc', label: 'Pior Avaliação' },
    { value: 'release_date.desc', label: 'Mais Recente' },
    { value: 'release_date.asc', label: 'Mais Antigo' },
    { value: 'title.asc', label: 'Título (A-Z)' },
    { value: 'title.desc', label: 'Título (Z-A)' },
  ];

  years = Array.from({ length: 50 }, (_, i) => new Date().getFullYear() - i);

  skeletonArray = new Array(20);

  constructor(
    private tmdbService: TmdbService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    // Effect to react to filter changes
    effect(
      () => {
        const genres = this.selectedGenres();
        const year = this.selectedYear();
        const rating = this.selectedRating();
        const sort = this.selectedSort();

        if (this.hasSearched() || this.hasActiveFilters()) {
          this.performSearch();
        }
      },
      { allowSignalWrites: true }
    );
  }

  ngOnInit() {
    this.loadGenres();

    this.route.queryParams.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      const query = params['q'];
      if (query) {
        this.searchControl.setValue(query, { emitEvent: false });
        this.hasSearched.set(true);
        this.performSearch();
      } else {
        this.isLoading.set(false);
      }
    });

    this.searchControl.valueChanges
      .pipe(debounceTime(500), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe((query) => {
        if (query && query.trim()) {
          this.router.navigate([], {
            relativeTo: this.route,
            queryParams: { q: query.trim() },
            queryParamsHandling: 'merge',
          });
          this.hasSearched.set(true);
          this.performSearch();
        } else if (!query || query.trim() === '') {
          this.clearSearch();
        }
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadGenres() {
    this.tmdbService.getGenres().subscribe({
      next: (response) => this.genres.set(response.genres),
      error: (error) => console.error('Error loading genres:', error),
    });
  }

  private performSearch() {
    const query = this.searchControl.value?.trim();
    this.isLoading.set(true);

    // If there's a search query, use search endpoint
    if (query) {
      this.tmdbService.searchMovies(query).subscribe({
        next: (response) => {
          let results = response.results;

          results = this.applyClientFilters(results);

          this.movies.set(results);
          this.isLoading.set(false);
        },
        error: (error) => {
          console.error('Search error:', error);
          this.isLoading.set(false);
        },
      });
    } else {
      const filters: DiscoverMovieParams = {
        sort_by: this.selectedSort(),
      };

      if (this.selectedGenres().length > 0) {
        filters.with_genres = this.selectedGenres().join(',');
      }

      if (this.selectedYear()) {
        filters.year = this.selectedYear()!;
      }

      if (this.selectedRating()) {
        filters['vote_average.gte'] = this.selectedRating()!;
      }

      this.tmdbService.discoverMovies(filters).subscribe({
        next: (response) => {
          this.movies.set(response.results);
          this.isLoading.set(false);
        },
        error: (error) => {
          console.error('Discover error:', error);
          this.isLoading.set(false);
        },
      });
    }
  }

  private applyClientFilters(movies: Movie[]): Movie[] {
    let filtered = [...movies];

    // Filter by genres
    if (this.selectedGenres().length > 0) {
      filtered = filtered.filter((movie) =>
        this.selectedGenres().some((genreId) => movie.genre_ids?.includes(genreId))
      );
    }

    // Filter by year
    if (this.selectedYear()) {
      filtered = filtered.filter((movie) =>
        movie.release_date?.startsWith(this.selectedYear()!.toString())
      );
    }

    // Filter by rating
    if (this.selectedRating()) {
      filtered = filtered.filter((movie) => movie.vote_average >= this.selectedRating()!);
    }

    filtered = this.applySorting(filtered);

    return filtered;
  }

  private applySorting(movies: Movie[]): Movie[] {
    const sorted = [...movies];
    const sortBy = this.selectedSort();

    switch (sortBy) {
      case 'popularity.desc':
        return sorted.sort((a, b) => b.popularity - a.popularity);
      case 'popularity.asc':
        return sorted.sort((a, b) => a.popularity - b.popularity);
      case 'vote_average.desc':
        return sorted.sort((a, b) => b.vote_average - a.vote_average);
      case 'vote_average.asc':
        return sorted.sort((a, b) => a.vote_average - b.vote_average);
      case 'release_date.desc':
        return sorted.sort((a, b) => (b.release_date || '').localeCompare(a.release_date || ''));
      case 'release_date.asc':
        return sorted.sort((a, b) => (a.release_date || '').localeCompare(b.release_date || ''));
      case 'title.asc':
        return sorted.sort((a, b) => a.title.localeCompare(b.title));
      case 'title.desc':
        return sorted.sort((a, b) => b.title.localeCompare(a.title));
      default:
        return sorted;
    }
  }

  toggleFilters() {
    this.showFilters.update((v) => !v);
  }

  toggleGenre(genreId: number) {
    this.selectedGenres.update((current) => {
      const index = current.indexOf(genreId);
      if (index > -1) {
        return current.filter((id) => id !== genreId);
      } else {
        return [...current, genreId];
      }
    });
  }

  isGenreSelected(genreId: number): boolean {
    return this.selectedGenres().includes(genreId);
  }

  setYear(year: number | null) {
    this.selectedYear.set(year);
  }

  setRating(rating: number | null) {
    this.selectedRating.set(rating);
  }

  setSort(sortValue: string) {
    this.selectedSort.set(sortValue);
  }

  clearFilters() {
    this.selectedGenres.set([]);
    this.selectedYear.set(null);
    this.selectedRating.set(null);
    this.selectedSort.set('popularity.desc');
  }

  clearSearch() {
    this.searchControl.setValue('', { emitEvent: false });
    this.movies.set([]);
    this.hasSearched.set(false);
    this.isLoading.set(false);
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { q: null },
      queryParamsHandling: 'merge',
    });
  }
}
