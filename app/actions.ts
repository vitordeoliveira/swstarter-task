'use server';

export async function fetchFilms() {
  try {
    const response = await fetch('https://swapi.tech/api/films', {
      cache: 'no-store',
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch films');
    }
    
    const data = await response.json();
    return data.result;
  } catch (error) {
    console.error('Error fetching films:', error);
    throw error;
  }
}

export async function fetchPeople() {
  try {
    const response = await fetch('https://swapi.tech/api/people', {
      cache: 'no-store',
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch people');
    }
    
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error('Error fetching people:', error);
    throw error;
  }
}

