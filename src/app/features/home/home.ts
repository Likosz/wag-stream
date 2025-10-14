import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TmdbService } from '../../core/services/tmdb.service';
import { ScrollPositionService } from '../../core/services/scroll-position.service';
import { Movie, MovieCategory } from '../../core/models';
import { CarouselComponent } from '../../shared/components/carousel/carousel';
import { MovieCardComponent } from '../../shared/components/movie-card/movie-card';
import { MovieCardSkeletonComponent } from '../../shared/components/movie-card-skeleton/movie-card-skeleton';

@Component({
  selector: 'app-home',
  imports: [CommonModule, CarouselComponent, MovieCardComponent, MovieCardSkeletonComponent],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class HomeComponent implements OnInit, OnDestroy {
  featuredMovies = signal<Movie[]>([]);
  popularMovies = signal<Movie[]>([]);
  topRatedMovies = signal<Movie[]>([]);
  upcomingMovies = signal<Movie[]>([]);
  isLoading = signal(true);
  skeletonArray = new Array(20);

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

    // Carregar filmes em destaque
    this.tmdbService.getMoviesByCategory(MovieCategory.NOW_PLAYING).subscribe({
      next: (response) => {
        this.featuredMovies.set(response.results.slice(0, 5));
      },
      error: (error) => console.error('Erro ao carregar filmes em destaque:', error),
    });

    // Carregar filmes populares
    this.tmdbService.getMoviesByCategory(MovieCategory.POPULAR).subscribe({
      next: (response) => {
        this.popularMovies.set(response.results);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Erro ao carregar filmes populares:', error);
        this.isLoading.set(false);
      },
    });

    // Carregar filmes mais bem avaliados
    this.tmdbService.getMoviesByCategory(MovieCategory.TOP_RATED).subscribe({
      next: (response) => {
        this.topRatedMovies.set(response.results);
      },
      error: (error) => console.error('Erro ao carregar filmes mais bem avaliados:', error),
    });

    // Carregar próximos lançamentos
    this.tmdbService.getMoviesByCategory(MovieCategory.UPCOMING).subscribe({
      next: (response) => {
        this.upcomingMovies.set(response.results);
      },
      error: (error) => console.error('Erro ao carregar próximos lançamentos:', error),
    });
  }
}
