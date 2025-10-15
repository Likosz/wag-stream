import { Directive, ElementRef, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { animate } from 'motion';

@Directive({
  selector: '[appPageTransition]',
  standalone: true,
})
export class PageTransitionDirective implements OnInit {
  constructor(private el: ElementRef, private router: Router) {}

  ngOnInit() {
    this.animateIn();

    // Escuta mudanças de rota
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
      this.animateIn();
    });
  }

  private animateIn() {
    animate(
      this.el.nativeElement,
      {
        opacity: [0, 1],
        y: [20, 0],
      },
      {
        duration: 0.5,
      }
    );
  }
}
