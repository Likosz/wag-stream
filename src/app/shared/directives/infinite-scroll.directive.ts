import {
  Directive,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  inject,
} from '@angular/core';

@Directive({
  selector: '[appInfiniteScroll]',
  standalone: true,
})
export class InfiniteScrollDirective implements OnInit, OnDestroy {
  private el = inject(ElementRef);
  private observer?: IntersectionObserver;

  @Input() threshold = 0.5;
  @Input() rootMargin = '200px';
  @Input() debounceTime = 300;
  @Input() disabled = false;

  @Output() scrolled = new EventEmitter<void>();

  private debounceTimer?: number;

  ngOnInit() {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      console.warn('IntersectionObserver not supported');
      return;
    }

    this.createObserver();
  }

  ngOnDestroy() {
    this.destroyObserver();
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }
  }

  private createObserver() {
    const options: IntersectionObserverInit = {
      root: null,
      rootMargin: this.rootMargin,
      threshold: this.threshold,
    };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !this.disabled) {
          this.handleIntersection();
        }
      });
    }, options);

    this.observer.observe(this.el.nativeElement);
  }

  private handleIntersection() {
    // Clear existing timer
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }

    // Debounce the scroll event
    this.debounceTimer = window.setTimeout(() => {
      if (!this.disabled) {
        this.scrolled.emit();
      }
    }, this.debounceTime);
  }

  private destroyObserver() {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = undefined;
    }
  }
}
