import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  Movie,
  MovieDetails,
  PaginatedResponse,
  MovieCategory,
  Genre,
  Credits,
  Video,
} from '../models';

/**
 Interface para parâmetros de descoberta de filmes
 */
export interface DiscoverMovieParams {
  page?: number;
  sort_by?: string;
  with_genres?: string;
  'primary_release_date.gte'?: string;
  'primary_release_date.lte'?: string;
  'vote_average.gte'?: number;
  'vote_average.lte'?: number;
  year?: number;
}

@Injectable({
  providedIn: 'root',
})
export class TmdbService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.tmdb.apiUrl;

  getMoviesByCategory(
    category: MovieCategory,
    page: number = 1
  ): Observable<PaginatedResponse<Movie>> {
    const params = new HttpParams().set('page', page.toString());
    return this.http.get<PaginatedResponse<Movie>>(`${this.baseUrl}/movie/${category}`, { params });
  }

  getMovieDetails(movieId: number): Observable<MovieDetails> {
    return this.http.get<MovieDetails>(`${this.baseUrl}/movie/${movieId}`);
  }

  getMovieCredits(movieId: number): Observable<Credits> {
    return this.http.get<Credits>(`${this.baseUrl}/movie/${movieId}/credits`);
  }

  getMovieVideos(movieId: number): Observable<{ results: Video[] }> {
    return this.http.get<{ results: Video[] }>(`${this.baseUrl}/movie/${movieId}/videos`);
  }

  getSimilarMovies(movieId: number, page: number = 1): Observable<PaginatedResponse<Movie>> {
    const params = new HttpParams().set('page', page.toString());
    return this.http.get<PaginatedResponse<Movie>>(`${this.baseUrl}/movie/${movieId}/similar`, {
      params,
    });
  }

  getRecommendedMovies(movieId: number, page: number = 1): Observable<PaginatedResponse<Movie>> {
    const params = new HttpParams().set('page', page.toString());
    return this.http.get<PaginatedResponse<Movie>>(
      `${this.baseUrl}/movie/${movieId}/recommendations`,
      { params }
    );
  }

  discoverMovies(filters: DiscoverMovieParams = {}): Observable<PaginatedResponse<Movie>> {
    let params = new HttpParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params = params.set(key, value.toString());
      }
    });

    return this.http.get<PaginatedResponse<Movie>>(`${this.baseUrl}/discover/movie`, { params });
  }

  searchMovies(query: string, page: number = 1): Observable<PaginatedResponse<Movie>> {
    const params = new HttpParams().set('query', query).set('page', page.toString());

    return this.http.get<PaginatedResponse<Movie>>(`${this.baseUrl}/search/movie`, { params });
  }

  getGenres(): Observable<{ genres: Genre[] }> {
    return this.http.get<{ genres: Genre[] }>(`${this.baseUrl}/genre/movie/list`);
  }

  getImageUrl(path: string | null, size: string = 'original'): string {
    if (!path) {
      return '/assets/images/no-image.png'; // placeholder para quando não houver imagem
    }
    return `${environment.tmdb.imageBaseUrl}/${size}${path}`;
  }

  getYoutubeUrl(key: string): string {
    return `https://www.youtube.com/watch?v=${key}`;
  }

  getYoutubeEmbedUrl(key: string): string {
    return `https://www.youtube.com/embed/${key}`;
  }
}
