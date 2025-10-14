/**
 * Categorias de filmes disponíveis na TMDB API
 */
export enum MovieCategory {
  POPULAR = 'popular',
  TOP_RATED = 'top_rated',
  UPCOMING = 'upcoming',
  NOW_PLAYING = 'now_playing',
}

export enum ImageSize {
  // Poster sizes
  POSTER_SMALL = 'w92',
  POSTER_MEDIUM = 'w185',
  POSTER_LARGE = 'w342',
  POSTER_XLARGE = 'w500',
  POSTER_ORIGINAL = 'original',

  // Backdrop sizes
  BACKDROP_SMALL = 'w300',
  BACKDROP_MEDIUM = 'w780',
  BACKDROP_LARGE = 'w1280',
  BACKDROP_ORIGINAL = 'original',

  // Profile (Cast) sizes
  PROFILE_SMALL = 'w45',
  PROFILE_MEDIUM = 'w185',
  PROFILE_LARGE = 'h632',
  PROFILE_ORIGINAL = 'original',
}

/**
 * Opções de ordenação para listagens
 */
export enum SortBy {
  POPULARITY_DESC = 'popularity.desc',
  POPULARITY_ASC = 'popularity.asc',
  RELEASE_DATE_DESC = 'release_date.desc',
  RELEASE_DATE_ASC = 'release_date.asc',
  REVENUE_DESC = 'revenue.desc',
  REVENUE_ASC = 'revenue.asc',
  VOTE_AVERAGE_DESC = 'vote_average.desc',
  VOTE_AVERAGE_ASC = 'vote_average.asc',
}

/**
 * Status de lançamento do filme
 */
export enum MovieStatus {
  RUMORED = 'Rumored',
  PLANNED = 'Planned',
  IN_PRODUCTION = 'In Production',
  POST_PRODUCTION = 'Post Production',
  RELEASED = 'Released',
  CANCELED = 'Canceled',
}
