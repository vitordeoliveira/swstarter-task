'use client';

import Link from 'next/link';
import Button from './Button';
import { PersonWithMovies } from '../types/personWithMovies';

interface PersonDetailsProps {
  person: PersonWithMovies | null;
}

export default function PersonDetails({ person }: PersonDetailsProps) {
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

  const properties = person?.properties || {};

  return (
    <div className="min-h-screen bg-[#ededed] flex items-start justify-center pt-12">
      <div className="max-w-4xl w-full px-4">
        <div className="p-8 rounded-lg shadow-lg bg-white">
          <h1 className="text-lg font-bold text-gray-800 mb-6">{properties.name}</h1>
          
          <div className="flex gap-6 mb-6">
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
            
            <div className="flex-1">
              <h2 className="text-base font-semibold text-gray-800 mb-2">Movies</h2>
              <hr className="my-2 border-gray-300 mb-4" />
              <div className="space-y-2 text-sm text-gray-700">
                {person.movies && person.movies.length > 0 ? (
                  person.movies.map((movie, index: number) => (
                    <p key={index}>
                      <Link 
                        href={`/details/movies/${movie.uid || movie._id}`}
                        className="text-[var(--green-teal)] hover:underline"
                      >
                        {movie.properties.title}
                      </Link>
                    </p>
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

