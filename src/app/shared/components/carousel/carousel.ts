import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  input,
  ViewEncapsulation,
  AfterViewInit,
  OnDestroy,
  ElementRef,
  inject,
  signal,
  computed,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Movie } from '../../../core/models';
import { TmdbService } from '../../../core/services/tmdb.service';
import { ImageSize } from '../../../core/models/enums';
import { LucideAngularModule, Play, Star, ChevronLeft, ChevronRight } from 'lucide-angular';
import { animate, inView } from 'motion';
import { TranslatePipe } from '../../../core/pipes/translate.pipe';

@Component({
  selector: 'app-carousel',
  imports: [CommonModule, RouterLink, LucideAngularModule, TranslatePipe],
  templateUrl: './carousel.html',
  styleUrl: './carousel.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  encapsulation: ViewEncapsulation.None,
})
export class CarouselComponent implements AfterViewInit, OnDestroy {
  movies = input.required<Movie[]>();
  private el = inject(ElementRef);

  readonly PlayIcon = Play;
  readonly StarIcon = Star;
  readonly ChevronLeftIcon = ChevronLeft;
  readonly ChevronRightIcon = ChevronRight;

  currentIndex = signal(0);
  currentMovie = computed(() => this.movies()[this.currentIndex()]);

  private autoPlayInterval: any;
  private readonly AUTO_PLAY_DELAY = 4000;

  constructor(private tmdbService: TmdbService) {}

  ngAfterViewInit() {
    this.startAutoPlay();

    // Animar entrada do banner
    const banner = this.el.nativeElement.querySelector('.featured-banner__card');
    if (banner) {
      inView(
        banner,
        () => {
          animate(banner, { opacity: [0, 1], y: [20, 0] }, { duration: 0.6 });
        },
        { amount: 0.3 }
      );
    }
  }

  ngOnDestroy() {
    this.stopAutoPlay();
  }

  startAutoPlay() {
    this.autoPlayInterval = setInterval(() => {
      this.nextSlide();
    }, this.AUTO_PLAY_DELAY);
  }

  stopAutoPlay() {
    if (this.autoPlayInterval) {
      clearInterval(this.autoPlayInterval);
    }
  }

  resetAutoPlay() {
    this.stopAutoPlay();
    this.startAutoPlay();
  }

  nextSlide(event?: Event) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    const nextIndex = (this.currentIndex() + 1) % this.movies().length;
    this.animateTransition(nextIndex);
    this.resetAutoPlay();
  }

  previousSlide(event?: Event) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    const prevIndex =
      this.currentIndex() === 0 ? this.movies().length - 1 : this.currentIndex() - 1;
    this.animateTransition(prevIndex);
    this.resetAutoPlay();
  }

  goToSlide(index: number, event?: Event) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    if (index !== this.currentIndex()) {
      this.animateTransition(index);
      this.resetAutoPlay();
    }
  }

  private animateTransition(newIndex: number) {
    const card = this.el.nativeElement.querySelector('.featured-banner__card');
    if (card) {
      animate(card, { opacity: [1, 0], scale: [1, 0.98] }, { duration: 0.3 }).finished.then(() => {
        this.currentIndex.set(newIndex);

        // Fade in com o novo conteúdo
        setTimeout(() => {
          animate(card, { opacity: [0, 1], scale: [0.98, 1] }, { duration: 0.3 });
        }, 50);
      });
    } else {
      this.currentIndex.set(newIndex);
    }
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
