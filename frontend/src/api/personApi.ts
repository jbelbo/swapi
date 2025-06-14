import { API_BASE_URL } from '../config/api';

export async function getPersonById(id: string) {
  const response = await fetch(`${API_BASE_URL}/api/v1/people/${id}`);
  if (!response.ok) throw new Error('Person not found');
  return response.json();
} 