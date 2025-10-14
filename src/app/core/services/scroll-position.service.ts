import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ScrollPositionService {
  private scrollPositions = new Map<string, number>();

  saveScrollPosition(route: string): void {
    const scrollY = window.scrollY || window.pageYOffset;
    this.scrollPositions.set(route, scrollY);
  }

  restoreScrollPosition(route: string): void {
    const position = this.scrollPositions.get(route);
    if (position !== undefined) {
      setTimeout(() => {
        window.scrollTo({
          top: position,
          behavior: 'instant' as ScrollBehavior,
        });
      }, 0);
    }
  }

  clearScrollPosition(route: string): void {
    this.scrollPositions.delete(route);
  }

  clearAll(): void {
    this.scrollPositions.clear();
  }
}
