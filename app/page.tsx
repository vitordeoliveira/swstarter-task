'use client';

import { useState } from 'react';
import { fetchFilms, fetchPeople } from './actions';
import Button from './components/Button';

export default function Home() {
  const [searchType, setSearchType] = useState<'people' | 'movies'>('people');
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<any[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const searchResults = searchType === 'movies' 
        ? await fetchFilms(searchTerm)
        : await fetchPeople(searchTerm);
      
      setResults(searchResults);
      console.log('Search results:', searchResults);
    } catch (error) {
      console.error('Error fetching data:', error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#ededed] flex items-start justify-center pt-12">
      <div className="flex items-start gap-8 max-w-6xl w-full px-4">
        {/* Left Box - maintaining 205:115 proportion */}
        <form 
          onSubmit={handleSearch}
          className="w-[410px] h-[230px] p-8 rounded-lg shadow-lg bg-white flex-shrink-0 flex flex-col gap-4"
        >
          <h2 className="text-base font-semibold text-gray-800">What are you searching for?</h2>
          
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input 
                type="radio" 
                name="searchType" 
                value="people" 
                checked={searchType === 'people'}
                onChange={(e) => setSearchType(e.target.value as 'people' | 'movies')}
                className="cursor-pointer" 
              />
              <span className="text-sm font-bold text-gray-700">People</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input 
                type="radio" 
                name="searchType" 
                value="movies" 
                checked={searchType === 'movies'}
                onChange={(e) => setSearchType(e.target.value as 'people' | 'movies')}
                className="cursor-pointer" 
              />
              <span className="text-sm font-bold text-gray-700">Movies</span>
            </label>
          </div>
          
          <div className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="e.g. Chewbacca, Yoda, Boba Fett"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[var(--green-teal)] text-base text-black placeholder:font-bold placeholder:text-base placeholder:text-[#c4c4c4]"
              style={{ fontFamily: 'var(--font-montserrat)' }}
            />
            <Button
              type="submit"
              disabled={!searchTerm.trim() || isLoading}
              className="w-full"
            >
              {isLoading ? 'SEARCHING...' : 'Search'}
            </Button>
          </div>
        </form>
        
        {/* Right Box */}
        <div className="w-[40rem] h-[40rem] p-8 rounded-lg shadow-lg bg-white flex-shrink-0 flex flex-col">
          <h3 className="text-lg font-bold text-gray-800">Results</h3>
          <hr className="my-2 border-gray-300" />
          
          {isLoading ? (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-center text-gray-600">
                Searching...
              </p>
            </div>
          ) : results === null ? (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-center text-gray-600">
                There are zero matches.<br />
                Use the form to search for People or Movies.
              </p>
            </div>
          ) : results.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-center text-gray-600">
                There are zero matches.<br />
                Use the form to search for People or Movies.
              </p>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto">
              {results.map((item: any, index: number) => (
                <div key={index}>
                  <div className="flex items-center justify-between gap-4 mb-2">
                    <h4 className="text-base font-semibold text-gray-800">
                      {searchType === 'movies' ? item.properties?.title : item.name}
                    </h4>
                    <Button
                      type="button"
                      className="flex-shrink-0"
                    >
                      See Details
                    </Button>
                  </div>
                  <hr className="my-2 border-gray-300" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
