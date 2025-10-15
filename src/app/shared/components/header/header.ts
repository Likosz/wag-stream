import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, NavigationEnd } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {
  LucideAngularModule,
  Search,
  Home,
  Film,
  TrendingUp,
  Heart,
  Sun,
  Moon,
} from 'lucide-angular';
import { filter } from 'rxjs/operators';
import { ThemeService } from '../../../core/services/theme.service';

@Component({
  selector: 'app-header',
  imports: [CommonModule, RouterLink, ReactiveFormsModule, LucideAngularModule],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class HeaderComponent implements OnInit {
  private themeService = inject(ThemeService);

  searchControl = new FormControl('');
  isScrolled = signal(false);
  showMobileMenu = signal(false);

  readonly SearchIcon = Search;
  readonly HomeIcon = Home;
  readonly FilmIcon = Film;
  readonly TrendingIcon = TrendingUp;
  readonly HeartIcon = Heart;
  readonly SunIcon = Sun;
  readonly MoonIcon = Moon;

  isDarkMode = this.themeService.isDarkMode;

  constructor(private router: Router) {}

  ngOnInit() {
    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', () => {
        this.isScrolled.set(window.scrollY > 50);
      });
    }

    // Clear search on route change
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
      this.showMobileMenu.set(false);
    });
  }

  onSearch() {
    const query = this.searchControl.value?.trim();
    if (query) {
      this.router.navigate(['/search'], { queryParams: { q: query } });
      this.searchControl.setValue('');
    }
  }

  onSearchKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.onSearch();
    }
  }

  toggleMobileMenu() {
    this.showMobileMenu.update((v) => !v);
  }

  toggleTheme() {
    this.themeService.toggleTheme();
  }
}
