import { Component, CUSTOM_ELEMENTS_SCHEMA, input, ViewEncapsulation, AfterViewInit, ElementRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Movie } from '../../../core/models';
import { TmdbService } from '../../../core/services/tmdb.service';
import { ImageSize } from '../../../core/models/enums';
import { LucideAngularModule, Play, Info } from 'lucide-angular';
import { animate, stagger, inView } from 'motion';

@Component({
  selector: 'app-carousel',
  imports: [CommonModule, RouterLink, LucideAngularModule],
  templateUrl: './carousel.html',
  styleUrl: './carousel.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  encapsulation: ViewEncapsulation.None,
})
export class CarouselComponent implements AfterViewInit {
  movies = input.required<Movie[]>();
  private el = inject(ElementRef);

  readonly PlayIcon = Play;
  readonly InfoIcon = Info;

  constructor(private tmdbService: TmdbService) {}

  ngAfterViewInit() {
    // Animar o conteúdo do carousel quando ele aparecer
    const carouselContent = this.el.nativeElement.querySelectorAll('.carousel__content > *');

    if (carouselContent.length > 0) {
      inView(
        this.el.nativeElement.querySelector('.carousel'),
        () => {
          animate(
            carouselContent,
            { opacity: [0, 1], y: [30, 0] },
            {
              duration: 0.6,
              delay: stagger(0.1)
            }
          );
        },
        { amount: 0.3 }
      );
    }

    // Animar botões no hover
    const buttons = this.el.nativeElement.querySelectorAll('.carousel__button');
    buttons.forEach((button: HTMLElement) => {
      button.addEventListener('mouseenter', () => {
        animate(
          button,
          { transform: ['scale(1)', 'scale(1.05)'], y: [0, -2] },
          { duration: 0.2 }
        );
      });

      button.addEventListener('mouseleave', () => {
        animate(
          button,
          { transform: ['scale(1.05)', 'scale(1)'], y: [-2, 0] },
          { duration: 0.2 }
        );
      });
    });
  }

  getBackdropUrl(movie: Movie): string {
    return this.tmdbService.getImageUrl(movie.backdrop_path, ImageSize.BACKDROP_ORIGINAL);
  }

  getRating(movie: Movie): number {
    return Math.round(movie.vote_average * 10) / 10;
  }

  getReleaseYear(movie: Movie): string {
    return movie.release_date?.split('-')[0] || 'N/A';
  }
}
