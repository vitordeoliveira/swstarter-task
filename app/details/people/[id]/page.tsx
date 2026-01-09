'use client';

import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import Button from '@/app/components/Button';
import { fetchPersonDetails, fetchFilmDetails } from '@/app/actions';

export default function PeopleDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [person, setPerson] = useState<any>(null);
  const [movies, setMovies] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  

  useEffect(() => {
    async function loadPersonDetails() {
      try {
        const personData = await fetchPersonDetails(id);
        setPerson(personData);
        
        // Fetch movie details
        if (personData?.properties?.films) {
          const moviePromises = personData.properties.films.map((url: string) => 
            fetchFilmDetails(url)
          );
          const movieData = await Promise.all(moviePromises);
          setMovies(movieData);
        }
      } catch (error) {
        console.error('Error loading person details:', error);
      } finally {
        setIsLoading(false);
      }
    }
    
    loadPersonDetails();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#ededed] flex items-start justify-center pt-12">
        <div className="max-w-4xl w-full px-4">
          <div className="p-8 rounded-lg shadow-lg bg-white">
            <p className="text-center text-gray-600">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!person) {
    return (
      <div className="min-h-screen bg-[#ededed] flex items-start justify-center pt-12">
        <div className="max-w-4xl w-full px-4">
          <div className="p-8 rounded-lg shadow-lg bg-white">
            <p className="text-center text-gray-600">Person not found</p>
          </div>
        </div>
      </div>
    );
  }

  const properties = person.properties || {};

  return (
    <div className="min-h-screen bg-[#ededed] flex items-start justify-center pt-12">
      <div className="max-w-4xl w-full px-4">
        <div className="p-8 rounded-lg shadow-lg bg-white">
          <h1 className="text-lg font-bold text-gray-800 mb-6">{properties.name}</h1>
          
          <div className="flex gap-6 mb-6">
            {/* Left side - Details */}
            <div className="flex-1">
              <h2 className="text-base font-semibold text-gray-800 mb-2">details</h2>
              <hr className="my-2 border-gray-300 mb-4" />
              <div className="space-y-2 text-sm text-gray-700">
                <p>Birth Year: {properties.birth_year || 'N/A'}</p>
                <p>Gender: {properties.gender || 'N/A'}</p>
                <p>Eye Color: {properties.eye_color || 'N/A'}</p>
                <p>Hair Color: {properties.hair_color || 'N/A'}</p>
                <p>Height: {properties.height || 'N/A'}</p>
                <p>Mass: {properties.mass || 'N/A'}</p>
              </div>
            </div>
            
            {/* Right side - Movies */}
            <div className="flex-1">
              <h2 className="text-base font-semibold text-gray-800 mb-2">Movies</h2>
              <hr className="my-2 border-gray-300 mb-4" />
              <div className="space-y-2 text-sm text-gray-700">
                {movies.length > 0 ? (
                  movies.map((movie: any, index: number) => (
                    <p key={index}>{movie.properties?.title || 'Unknown Movie'}</p>
                  ))
                ) : (
                  <p>No movies found</p>
                )}
              </div>
            </div>
          </div>
          
          <div className="mt-6">
            <Link href="/">
              <Button className="w-full sm:w-auto">
                Back to Search
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

