import { Component, input, ElementRef, AfterViewInit, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Movie } from '../../../core/models';
import { TmdbService } from '../../../core/services/tmdb.service';
import { FavoritesService } from '../../../core/services/favorites.service';
import { ImageSize } from '../../../core/models/enums';
import { LucideAngularModule, Star, Calendar, Heart } from 'lucide-angular';
import { animate, inView } from 'motion';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/pt-br';

// Configurar dayjs
dayjs.extend(relativeTime);
dayjs.locale('pt-br');

@Component({
  selector: 'app-movie-card',
  imports: [CommonModule, RouterLink, LucideAngularModule],
  templateUrl: './movie-card.html',
  styleUrl: './movie-card.scss',
})
export class MovieCardComponent implements AfterViewInit {
  movie = input.required<Movie>();
  private el = inject(ElementRef);
  private favoritesService = inject(FavoritesService);

  readonly StarIcon = Star;
  readonly CalendarIcon = Calendar;
  readonly HeartIcon = Heart;

  // Computed para verificar se é favorito
  isFavorite = computed(() => this.favoritesService.isFavorite(this.movie().id));

  constructor(private tmdbService: TmdbService) {}

  ngAfterViewInit() {
    // Animação de entrada quando o card aparece na tela
    inView(
      this.el.nativeElement,
      () => {
        animate(this.el.nativeElement, { opacity: [0, 1], y: [30, 0] }, { duration: 0.5 });
      },
      { amount: 0.3 }
    );
  }

  getMoviePoster(): string {
    return this.tmdbService.getImageUrl(this.movie().poster_path, ImageSize.POSTER_LARGE);
  }

  getRating(): number {
    return Math.round(this.movie().vote_average * 10) / 10;
  }

  getReleaseYear(): string {
    const releaseDate = this.movie().release_date;
    if (!releaseDate) return 'N/A';

    return dayjs(releaseDate).format('YYYY');
  }

  getRelativeReleaseDate(): string {
    const releaseDate = this.movie().release_date;
    if (!releaseDate) return '';

    const now = dayjs();
    const release = dayjs(releaseDate);

    // Se já foi lançado, mostra "há X tempo"
    if (release.isBefore(now)) {
      return release.fromNow();
    }

    // Se ainda vai lançar, mostra "em X tempo"
    return `em ${release.from(now, true)}`;
  }

  toggleFavorite(event: Event): void {
    event.preventDefault();
    event.stopPropagation();

    const button = (event.currentTarget as HTMLElement).querySelector('.favorite-btn__icon');
    if (button) {
      animate(button, { scale: [1, 1.3, 1] }, { duration: 0.3 });
    }

    this.favoritesService.toggleFavorite(this.movie().id);
  }
}
