'use client';

import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import Button from '@/app/components/Button';
import { fetchFilmDetails } from '@/app/actions';
import { MovieWithPeople } from '@/app/types/movieWithPeople';

export default function MoviesDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [film, setFilm] = useState<MovieWithPeople | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadFilmDetails() {
      try {
        setIsLoading(true);
        const filmData = await fetchFilmDetails(id);
        setFilm(filmData);
      } catch (error) {
        console.error('Error loading film details:', error);
        setFilm(null);
      } finally {
        setIsLoading(false);
      }
    }
    
    loadFilmDetails();
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

  if (!film) {
    return (
      <div className="min-h-screen bg-[#ededed] flex items-start justify-center pt-12">
        <div className="max-w-4xl w-full px-4">
          <div className="p-8 rounded-lg shadow-lg bg-white">
            <p className="text-center text-gray-600">Film not found</p>
          </div>
        </div>
      </div>
    );
  }

  const properties = film.properties || {};

  return (
    <div className="min-h-screen bg-[#ededed] flex items-start justify-center pt-12">
      <div className="max-w-4xl w-full px-4">
        <div className="p-8 rounded-lg shadow-lg bg-white">
          <h1 className="text-lg font-bold text-gray-800 mb-6">{properties.title}</h1>
          
          <div className="flex gap-6 mb-6">
            <div className="flex-1">
              <h2 className="text-base font-semibold text-gray-800 mb-2">Opening Crawl</h2>
              <hr className="my-2 border-gray-300 mb-4" />
              <p className="text-sm text-gray-700 whitespace-pre-line">
                {properties.opening_crawl || 'N/A'}
              </p>
            </div>
            
            <div className="flex-1">
              <h2 className="text-base font-semibold text-gray-800 mb-2">Characters</h2>
              <hr className="my-2 border-gray-300 mb-4" />
              <p className="text-sm text-gray-700">
                {film.people && film.people.length > 0 ? (
                  film.people.map((person, index) => (
                    <span key={person.id}>
                      <Link 
                        href={`/details/people/${person.id}`}
                        className="text-[var(--green-teal)] hover:underline"
                      >
                        {person.name}
                      </Link>
                      {index < film.people.length - 1 && ', '}
                    </span>
                  ))
                ) : (
                  'No characters found'
                )}
              </p>
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

