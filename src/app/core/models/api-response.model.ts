export interface PaginatedResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

/**
 * Interface para resposta de busca de filmes
 */
export interface MovieSearchResponse extends PaginatedResponse<any> {
  results: any[];
}

/**
 * Interface para erros da API
 */
export interface ApiError {
  status_message: string;
  status_code: number;
  success: boolean;
}
