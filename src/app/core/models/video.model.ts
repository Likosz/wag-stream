/**
 * Interface para vídeo do filme (trailer, teaser, etc)
 */
export interface Video {
  id: string;
  iso_639_1: string;
  iso_3166_1: string;
  key: string;
  name: string;
  site: string;
  size: number;
  type: VideoType;
  official: boolean;
  published_at: string;
}

/**
 * Tipos de vídeo disponíveis
 */
export type VideoType =
  | 'Trailer'
  | 'Teaser'
  | 'Clip'
  | 'Behind the Scenes'
  | 'Bloopers'
  | 'Featurette';

/**
 * Interface para resposta de vídeos
 */
export interface VideosResponse {
  id: number;
  results: Video[];
}
