/**
 * Interface principal para Movie
 */
export interface Movie {
  id: number;
  title: string;
  original_title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  adult: boolean;
  genre_ids: number[];
  original_language: string;
  popularity: number;
  vote_average: number;
  vote_count: number;
  video: boolean;
}

/**
 * Interface para detalhes completos do filme
 * Retornada pelo endpoint /movie/{id}
 */
export interface MovieDetails extends Omit<Movie, 'genre_ids'> {
  genres: Genre[];
  runtime: number | null;
  budget: number;
  revenue: number;
  status: string;
  tagline: string | null;
  homepage: string | null;
  imdb_id: string | null;
  production_companies: ProductionCompany[];
  production_countries: ProductionCountry[];
  spoken_languages: SpokenLanguage[];
}

/**
 * Interface para gênero de filme
 */
export interface Genre {
  id: number;
  name: string;
}

/**
 * Interface para companhia de produção
 */
export interface ProductionCompany {
  id: number;
  name: string;
  logo_path: string | null;
  origin_country: string;
}

/**
 * Interface para país de produção
 */
export interface ProductionCountry {
  iso_3166_1: string;
  name: string;
}

/**
 * Interface para idioma falado no filme
 */
export interface SpokenLanguage {
  english_name: string;
  iso_639_1: string;
  name: string;
}
