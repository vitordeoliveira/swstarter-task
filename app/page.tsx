'use client';

import { useState } from 'react';
import { fetchFilms, fetchPeople } from './actions';

export default function Home() {
  const [searchType, setSearchType] = useState<'people' | 'movies'>('people');
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const results = searchType === 'movies' 
        ? await fetchFilms(searchTerm)
        : await fetchPeople(searchTerm);
      
      console.log('Search results:', results);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  return (
    <div className="min-h-screen bg-[#ededed] flex items-start justify-center pt-12">
      <div className="flex items-start gap-8 max-w-6xl w-full px-4">
        {/* Left Box - maintaining 205:115 proportion */}
        <form 
          onSubmit={handleSearch}
          className="w-[410px] h-[230px] p-8 rounded-lg shadow-[0_0.5px_1px_0_var(--warm-grey-75)] border border-solid border-[var(--green-teal)] bg-white flex-shrink-0 flex flex-col gap-4"
        >
          <h2 className="text-base font-medium text-gray-800">What are you searching for?</h2>
          
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
              <span className="text-sm text-gray-700">people</span>
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
              <span className="text-sm text-gray-700">movies</span>
            </label>
          </div>
          
          <div className="flex flex-col gap-2">
            <input
              type="text"
              placeholder="e.g. Chewbacca, Yoda, Boba Fett"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[var(--green-teal)] text-base placeholder:font-bold placeholder:text-base placeholder:text-[#c4c4c4]"
              style={{ fontFamily: 'var(--font-montserrat)' }}
            />
            <button
              type="submit"
              className="w-full px-4 py-2 bg-[#c4c4c4] text-white rounded-lg hover:opacity-90 transition-opacity"
            >
              Search
            </button>
          </div>
        </form>
        
        {/* Right Box */}
        <div className="w-[32rem] h-[32rem] p-8 rounded-lg shadow-[0_0.5px_1px_0_var(--warm-grey-75)] border border-solid border-[var(--green-teal)] bg-white flex-shrink-0">
        </div>
      </div>
    </div>
  );
}
