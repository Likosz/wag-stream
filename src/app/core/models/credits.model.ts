/**
 * Interface para membro do elenco (ator/atriz)
 */
export interface Cast {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
  order: number;
  cast_id: number;
  credit_id: string;
  gender: number | null;
  known_for_department: string;
}

/**
 * Interface para membro da equipe técnica
 */
export interface Crew {
  id: number;
  name: string;
  job: string;
  department: string;
  profile_path: string | null;
  credit_id: string;
  gender: number | null;
  known_for_department: string;
}

/**
 * Interface para resposta completa de créditos
 */
export interface Credits {
  id: number;
  cast: Cast[];
  crew: Crew[];
}
