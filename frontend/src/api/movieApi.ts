import { API_BASE_URL } from '../config/api';

export async function getMovieById(id: string) {
  const response = await fetch(`${API_BASE_URL}/api/v1/films/${id}`);
  if (!response.ok) throw new Error('Movie not found');
  return response.json();
} 