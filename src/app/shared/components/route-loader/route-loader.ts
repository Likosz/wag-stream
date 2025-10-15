import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-route-loader',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (isLoading()) {
      <div class="route-loader">
        <div class="route-loader__bar"></div>
      </div>
    }
  `,
  styles: [`
    .route-loader {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 9999;
      height: 3px;
      background: transparent;

      &__bar {
        height: 100%;
        background: linear-gradient(90deg, #e50914 0%, #ff4757 100%);
        animation: loading 1s ease-in-out infinite;
        box-shadow: 0 0 10px rgba(229, 9, 20, 0.5);
      }
    }

    @keyframes loading {
      0% {
        width: 0%;
        margin-left: 0%;
      }
      50% {
        width: 50%;
        margin-left: 25%;
      }
      100% {
        width: 0%;
        margin-left: 100%;
      }
    }
  `]
})
export class RouteLoaderComponent {
  isLoading = signal(false);

  constructor(private router: Router) {
    this.router.events.pipe(
      filter(event =>
        event instanceof NavigationStart ||
        event instanceof NavigationEnd ||
        event instanceof NavigationCancel ||
        event instanceof NavigationError
      )
    ).subscribe(event => {
      if (event instanceof NavigationStart) {
        this.isLoading.set(true);
      } else {
        // Pequeno delay para suavizar a transição
        setTimeout(() => this.isLoading.set(false), 300);
      }
    });
  }
}
