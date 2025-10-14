import { Component, OnInit, signal, CUSTOM_ELEMENTS_SCHEMA, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TmdbService } from '../../core/services/tmdb.service';
import { MovieDetails, Video, Credits, Movie } from '../../core/models';
import { ImageSize } from '../../core/models/enums';
import { LucideAngularModule, Play, Share2, Calendar, Clock, Star, DollarSign, Users } from 'lucide-angular';
import { TranslocoModule } from '@jsverse/transloco';
import { ToastrService } from 'ngx-toastr';
import { TrustUrlPipe } from '../../shared/pipes/trust-url.pipe';

@Component({
  selector: 'app-movie-details',
  imports: [CommonModule, RouterLink, LucideAngularModule, TranslocoModule, TrustUrlPipe],
  templateUrl: './movie-details.html',
  styleUrl: './movie-details.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  encapsulation: ViewEncapsulation.None,
})
export class MovieDetailsComponent implements OnInit {
  movie = signal<MovieDetails | null>(null);
  videos = signal<Video[]>([]);
  credits = signal<Credits | null>(null);
  similarMovies = signal<Movie[]>([]);
  isLoading = signal(true);

  readonly PlayIcon = Play;
  readonly ShareIcon = Share2;
  readonly CalendarIcon = Calendar;
  readonly ClockIcon = Clock;
  readonly StarIcon = Star;
  readonly DollarIcon = DollarSign;
  readonly UsersIcon = Users;

  constructor(
    private route: ActivatedRoute,
    public tmdbService: TmdbService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      const movieId = +params['id'];
      if (movieId) {
        this.loadMovieDetails(movieId);
      }
    });
  }

  private loadMovieDetails(movieId: number) {
    this.isLoading.set(true);

    // Carregar detalhes do filme
    this.tmdbService.getMovieDetails(movieId).subscribe({
      next: (movie) => {
        this.movie.set(movie);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false),
    });

    // Carregar vídeos
    this.tmdbService.getMovieVideos(movieId).subscribe({
      next: (response) => {
        const trailers = response.results.filter(v =>
          v.type === 'Trailer' && v.site === 'YouTube'
        );
        this.videos.set(trailers);
      },
    });

    // Carregar créditos
    this.tmdbService.getMovieCredits(movieId).subscribe({
      next: (credits) => this.credits.set(credits),
    });

    // Carregar filmes similares
    this.tmdbService.getSimilarMovies(movieId).subscribe({
      next: (response) => this.similarMovies.set(response.results.slice(0, 12)),
    });
  }

  getBackdropUrl(): string {
    const movie = this.movie();
    if (!movie) return '';
    return this.tmdbService.getImageUrl(movie.backdrop_path, ImageSize.BACKDROP_ORIGINAL);
  }

  getPosterUrl(): string {
    const movie = this.movie();
    if (!movie) return '';
    return this.tmdbService.getImageUrl(movie.poster_path, ImageSize.POSTER_LARGE);
  }

  getMoviePoster(movie: Movie): string {
    return this.tmdbService.getImageUrl(movie.poster_path, ImageSize.POSTER_MEDIUM);
  }

  getRating(): number {
    const movie = this.movie();
    if (!movie) return 0;
    return Math.round(movie.vote_average * 10) / 10;
  }

  getReleaseYear(): string {
    const movie = this.movie();
    if (!movie || !movie.release_date) return 'N/A';
    return movie.release_date.split('-')[0];
  }

  getRuntime(): string {
    const movie = this.movie();
    if (!movie || !movie.runtime) return 'N/A';
    const hours = Math.floor(movie.runtime / 60);
    const minutes = movie.runtime % 60;
    return `${hours}h ${minutes}min`;
  }

  formatCurrency(value: number): string {
    if (!value) return 'N/A';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  }

  getDirector(): string {
    const credits = this.credits();
    if (!credits) return 'N/A';
    const director = credits.crew.find(c => c.job === 'Director');
    return director?.name || 'N/A';
  }

  getYoutubeEmbedUrl(key: string): string {
    return this.tmdbService.getYoutubeEmbedUrl(key);
  }

  async copyShareLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      this.toastr.success('Link copiado para a área de transferência!', 'Sucesso');
    } catch (err) {
      this.toastr.error('Erro ao copiar link', 'Erro');
    }
  }
}
