import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, ArrowUp } from 'lucide-angular';
import { animate } from 'motion';

@Component({
  selector: 'app-scroll-to-top',
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './scroll-to-top.html',
  styleUrl: './scroll-to-top.scss',
  standalone: true,
})
export class ScrollToTopComponent implements OnInit {
  isVisible = signal(false);
  readonly ArrowUpIcon = ArrowUp;

  ngOnInit() {
    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', () => {
        this.isVisible.set(window.scrollY > 500);
      });
    }
  }

  scrollToTop() {
    if (typeof window !== 'undefined') {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }
  }
}
