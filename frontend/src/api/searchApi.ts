import { API_BASE_URL } from '../config/api';

export async function searchSW(type: string, query: string) {
  const response = await fetch(`${API_BASE_URL}/api/v1/search`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type, query }),
  });
  if (!response.ok) throw new Error('Search failed');
  const data = await response.json();
  return data.result || [];
} 