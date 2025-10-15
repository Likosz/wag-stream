import { Injectable, signal, computed } from '@angular/core';
import { Movie } from '../models';

@Injectable({
  providedIn: 'root',
})
export class FavoritesService {
  private readonly STORAGE_KEY = 'wagstream_favorites';

  private favoriteIds = signal<number[]>(this.loadFavoritesFromStorage());

  favorites = computed(() => this.favoriteIds());
  count = computed(() => this.favoriteIds().length);

  constructor() {
    if (typeof window !== 'undefined') {
      window.addEventListener('storage', this.handleStorageChange.bind(this));
    }
  }

  private loadFavoritesFromStorage(): number[] {
    if (typeof window === 'undefined') return [];

    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading favorites from storage:', error);
      return [];
    }
  }

  /**
    Salva favoritos no LocalStorage
   */
  private saveFavoritesToStorage(ids: number[]): void {
    if (typeof window === 'undefined') return;

    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(ids));
    } catch (error) {
      console.error('Error saving favorites to storage:', error);
    }
  }

  addFavorite(movieId: number): void {
    this.favoriteIds.update((current) => {
      if (current.includes(movieId)) return current;
      const updated = [...current, movieId];
      this.saveFavoritesToStorage(updated);
      return updated;
    });
  }

  removeFavorite(movieId: number): void {
    this.favoriteIds.update((current) => {
      const updated = current.filter((id) => id !== movieId);
      this.saveFavoritesToStorage(updated);
      return updated;
    });
  }

  toggleFavorite(movieId: number): void {
    if (this.isFavorite(movieId)) {
      this.removeFavorite(movieId);
    } else {
      this.addFavorite(movieId);
    }
  }

  isFavorite(movieId: number): boolean {
    return this.favoriteIds().includes(movieId);
  }

  clearAll(): void {
    this.favoriteIds.set([]);
    this.saveFavoritesToStorage([]);
  }

  private handleStorageChange(event: StorageEvent): void {
    if (event.key === this.STORAGE_KEY && event.newValue) {
      try {
        const newFavorites = JSON.parse(event.newValue);
        this.favoriteIds.set(newFavorites);
      } catch (error) {
        console.error('Error syncing favorites from storage event:', error);
      }
    }
  }
}
