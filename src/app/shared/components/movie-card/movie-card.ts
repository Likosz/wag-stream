import { Component, input, ElementRef, AfterViewInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Movie } from '../../../core/models';
import { TmdbService } from '../../../core/services/tmdb.service';
import { ImageSize } from '../../../core/models/enums';
import { LucideAngularModule, Star, Calendar } from 'lucide-angular';
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

  readonly StarIcon = Star;
  readonly CalendarIcon = Calendar;

  constructor(private tmdbService: TmdbService) {}

  ngAfterViewInit() {
    // Animação de entrada quando o card aparece na tela
    inView(
      this.el.nativeElement,
      () => {
        animate(
          this.el.nativeElement,
          { opacity: [0, 1], y: [30, 0] },
          { duration: 0.5 }
        );
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
}
