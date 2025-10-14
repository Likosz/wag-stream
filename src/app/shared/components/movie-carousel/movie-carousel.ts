import {
  Component,
  input,
  ViewEncapsulation,
  CUSTOM_ELEMENTS_SCHEMA,
  signal,
  AfterViewInit,
  ElementRef,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Movie } from '../../../core/models';
import { MovieCardComponent } from '../movie-card/movie-card';
import { LucideAngularModule, ChevronLeft, ChevronRight } from 'lucide-angular';

@Component({
  selector: 'app-movie-carousel',
  imports: [CommonModule, MovieCardComponent, LucideAngularModule],
  templateUrl: './movie-carousel.html',
  styleUrl: './movie-carousel.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  encapsulation: ViewEncapsulation.None,
})
export class MovieCarouselComponent implements AfterViewInit {
  movies = input.required<Movie[]>();
  title = input.required<string>();

  private el = inject(ElementRef);

  readonly ChevronLeftIcon = ChevronLeft;
  readonly ChevronRightIcon = ChevronRight;

  canScrollLeft = signal(false);
  canScrollRight = signal(true);

  private scrollContainer?: HTMLElement;

  ngAfterViewInit() {
    this.scrollContainer = this.el.nativeElement.querySelector('.movie-carousel__scroll');
    if (this.scrollContainer) {
      this.updateScrollButtons();
      this.scrollContainer.addEventListener('scroll', () => this.updateScrollButtons());
    }
  }

  scrollLeft() {
    if (!this.scrollContainer) return;

    const scrollAmount = this.scrollContainer.offsetWidth * 0.8;
    const targetScroll = this.scrollContainer.scrollLeft - scrollAmount;

    this.scrollContainer.scrollTo({
      left: targetScroll,
      behavior: 'smooth',
    });
  }

  scrollRight() {
    if (!this.scrollContainer) return;

    const scrollAmount = this.scrollContainer.offsetWidth * 0.8;
    const targetScroll = this.scrollContainer.scrollLeft + scrollAmount;

    this.scrollContainer.scrollTo({
      left: targetScroll,
      behavior: 'smooth',
    });
  }

  private updateScrollButtons() {
    if (!this.scrollContainer) return;

    const { scrollLeft, scrollWidth, clientWidth } = this.scrollContainer;

    this.canScrollLeft.set(scrollLeft > 10);

    this.canScrollRight.set(scrollLeft < scrollWidth - clientWidth - 10);
  }

  trackByMovieId(index: number, movie: Movie): number {
    return movie.id;
  }
}
