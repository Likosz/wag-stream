import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './shared/components/header/header';
import { RouteLoaderComponent } from './shared/components/route-loader/route-loader';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, RouteLoaderComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('wag-stream');
}
