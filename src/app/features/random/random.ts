import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RandomMovieService, Genre } from '../../core/services/random-movie.service';
import { Movie } from '../../core/models';
import { MovieCardComponent } from '../../shared/components/movie-card/movie-card';
import { LucideAngularModule, Dices, Sparkles } from 'lucide-angular';
import { TranslatePipe } from '../../core/pipes/translate.pipe';

@Component({
  selector: 'app-random',
  imports: [CommonModule, FormsModule, MovieCardComponent, LucideAngularModule, TranslatePipe],
  templateUrl: './random.html',
  styleUrl: './random.scss',
})
export class RandomComponent {
  private randomService = inject(RandomMovieService);

  readonly DicesIcon = Dices;
  readonly SparklesIcon = Sparkles;

  genres: Genre[] = this.randomService.genres;
  selectedGenreId: number | null = null;

  randomMovies = signal<Movie[]>([]);
  isRolling = signal(false);
  showResults = signal(false);

  selectGenre(genreId: number | null) {
    this.selectedGenreId = genreId;
  }

  get selectedGenreName(): string {
    if (this.selectedGenreId === null) return '';
    return this.genres.find((g) => g.id === this.selectedGenreId)?.name || '';
  }

  rollMovies() {
    this.isRolling.set(true);
    this.showResults.set(false);

    // Animação de 2 segundos antes de buscar
    setTimeout(() => {
      this.randomService.getRandomMovies(this.selectedGenreId, 10).subscribe({
        next: (movies) => {
          console.log('Movies received:', movies);
          this.randomMovies.set(movies);
          this.isRolling.set(false);

          // Pequeno delay para smooth transition
          setTimeout(() => {
            this.showResults.set(true);
            console.log('Results shown:', this.randomMovies());
          }, 100);
        },
        error: (error) => {
          console.error('Error fetching random movies:', error);
          this.isRolling.set(false);
        },
      });
    }, 2000);
  }

  trackByMovieId(index: number, movie: Movie): number {
    return movie.id;
  }
}
