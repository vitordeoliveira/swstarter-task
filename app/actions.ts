'use server';

export async function fetchFilms(searchTerm?: string) {
  try {
    const response = await fetch('https://swapi.tech/api/films', {
      cache: 'no-store',
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch films');
    }
    
    const data = await response.json();
    const films = data.result;
    
    if (!searchTerm || searchTerm.trim() === '') {
      return films;
    }
    
    return films.filter((film: any) =>
      film.properties.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  } catch (error) {
    console.error('Error fetching films:', error);
    throw error;
  }
}

export async function fetchPeople(searchTerm?: string) {
  try {
    const response = await fetch('https://swapi.tech/api/people', {
      cache: 'no-store',
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch people');
    }
    
    const data = await response.json();
    const people = data.results;
    
    if (!searchTerm || searchTerm.trim() === '') {
      return people;
    }
    
    return people.filter((person: any) =>
      person.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  } catch (error) {
    console.error('Error fetching people:', error);
    throw error;
  }
}

export async function fetchPersonDetails(id: string) {
  try {
    const response = await fetch(`https://swapi.tech/api/people/${id}`, {
      cache: 'no-store',
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch person details');
    }
    
    const data = await response.json();
    return data.result;
  } catch (error) {
    console.error('Error fetching person details:', error);
    throw error;
  }
}

export async function fetchFilmDetails(url: string) {
  try {
    const response = await fetch(url, {
      cache: 'no-store',
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch film details');
    }
    
    const data = await response.json();
    return data.result;
  } catch (error) {
    console.error('Error fetching film details:', error);
    throw error;
  }
}

export async function fetchFilmDetailsById(id: string) {
  try {
    const response = await fetch(`https://swapi.tech/api/films/${id}`, {
      cache: 'no-store',
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch film details');
    }
    
    const data = await response.json();
    return data.result;
  } catch (error) {
    console.error('Error fetching film details:', error);
    throw error;
  }
}

