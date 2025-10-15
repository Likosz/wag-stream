import { Component, OnInit, OnDestroy, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { forkJoin } from 'rxjs';
import { TmdbService } from '../../core/services/tmdb.service';
import { ScrollPositionService } from '../../core/services/scroll-position.service';
import { LanguageService } from '../../core/services/language.service';
import { Movie, MovieCategory } from '../../core/models';
import { CarouselComponent } from '../../shared/components/carousel/carousel';
import { MovieCarouselComponent } from '../../shared/components/movie-carousel/movie-carousel';
import { MovieCardComponent } from '../../shared/components/movie-card/movie-card';
import { MovieCardSkeletonComponent } from '../../shared/components/movie-card-skeleton/movie-card-skeleton';
import { InfiniteScrollDirective } from '../../shared/directives/infinite-scroll.directive';
import { ScrollToTopComponent } from '../../shared/components/scroll-to-top/scroll-to-top';
import { TranslatePipe } from '../../core/pipes/translate.pipe';

@Component({
  selector: 'app-home',
  imports: [
    CommonModule,
    CarouselComponent,
    MovieCarouselComponent,
    MovieCardSkeletonComponent,
    ScrollToTopComponent,
    TranslatePipe,
  ],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class HomeComponent implements OnInit, OnDestroy {
  private languageService = inject(LanguageService);
  featuredMovies = signal<Movie[]>([]);
  popularMovies = signal<Movie[]>([]);
  topRatedMovies = signal<Movie[]>([]);
  upcomingMovies = signal<Movie[]>([]);
  isLoading = signal(true);
  isLoadingMore = signal(false);
  skeletonArray = new Array(20);

  private currentPage = {
    popular: 2,
    topRated: 2,
    upcoming: 2,
  };

  private totalPages = {
    popular: 1,
    topRated: 1,
    upcoming: 1,
  };

  private readonly ROUTE_KEY = 'home';

  constructor(
    private tmdbService: TmdbService,
    private scrollPositionService: ScrollPositionService
  ) {}

  ngOnInit() {
    this.loadMovies();
    setTimeout(() => {
      this.scrollPositionService.restoreScrollPosition(this.ROUTE_KEY);
    }, 100);
  }

  ngOnDestroy() {
    this.scrollPositionService.saveScrollPosition(this.ROUTE_KEY);
  }

  private loadMovies() {
    this.isLoading.set(true);

    // Carregar filmes em destaque (apenas primeira página)
    this.tmdbService.getMoviesByCategory(MovieCategory.NOW_PLAYING).subscribe({
      next: (response) => {
        this.featuredMovies.set(response.results.slice(0, 5));
      },
      error: (error) => console.error('Erro ao carregar filmes em destaque:', error),
    });

    forkJoin([
      this.tmdbService.getMoviesByCategory(MovieCategory.POPULAR, 1),
      this.tmdbService.getMoviesByCategory(MovieCategory.POPULAR, 2),
    ]).subscribe({
      next: ([page1, page2]) => {
        this.popularMovies.set([...page1.results, ...page2.results]);
        this.totalPages.popular = page1.total_pages;
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Erro ao carregar filmes populares:', error);
        this.isLoading.set(false);
      },
    });

    forkJoin([
      this.tmdbService.getMoviesByCategory(MovieCategory.TOP_RATED, 1),
      this.tmdbService.getMoviesByCategory(MovieCategory.TOP_RATED, 2),
    ]).subscribe({
      next: ([page1, page2]) => {
        this.topRatedMovies.set([...page1.results, ...page2.results]);
        this.totalPages.topRated = page1.total_pages;
      },
      error: (error) => console.error('Erro ao carregar filmes mais bem avaliados:', error),
    });

    forkJoin([
      this.tmdbService.getMoviesByCategory(MovieCategory.UPCOMING, 1),
      this.tmdbService.getMoviesByCategory(MovieCategory.UPCOMING, 2),
    ]).subscribe({
      next: ([page1, page2]) => {
        this.upcomingMovies.set([...page1.results, ...page2.results]);
        this.totalPages.upcoming = page1.total_pages;
      },
      error: (error) => console.error('Erro ao carregar próximos lançamentos:', error),
    });
  }

  onScrollEnd() {
    if (this.isLoadingMore()) return;

    if (this.currentPage.popular < this.totalPages.popular) {
      this.loadMoreMovies();
    }
  }

  private loadMoreMovies() {
    this.isLoadingMore.set(true);
    this.currentPage.popular++;

    this.tmdbService
      .getMoviesByCategory(MovieCategory.POPULAR, this.currentPage.popular)
      .subscribe({
        next: (response) => {
          this.popularMovies.update((current) => [...current, ...response.results]);
          this.isLoadingMore.set(false);
        },
        error: (error) => {
          console.error('Erro ao carregar mais filmes:', error);
          this.isLoadingMore.set(false);
          this.currentPage.popular--;
        },
      });
  }

  get canLoadMore(): boolean {
    return this.currentPage.popular < this.totalPages.popular && !this.isLoadingMore();
  }
}
