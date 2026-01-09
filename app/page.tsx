'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { fetchFilms, fetchPeople } from './actions';
import Button from './components/Button';
import { Person } from './types/person';
import { Movie } from './types/movie';

const STORAGE_KEY = 'swstarter-last-search';

type SearchResult = Person | Movie;

interface LastSearch {
  searchType: 'people' | 'movies';
  searchTerm: string;
  results: SearchResult[];
}

export default function Home() {
  const [searchType, setSearchType] = useState<'people' | 'movies'>('people');
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<SearchResult[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [peopleData, setPeopleData] = useState<Person[]>([]);
  const [moviesData, setMoviesData] = useState<Movie[]>([]);
  const [placeholder, setPlaceholder] = useState<string>('e.g. Luke Skywalker, C-3P0, R2-D2');

  // Load last search from localStorage on mount
  useEffect(() => {
    try {
      const savedSearch = localStorage.getItem(STORAGE_KEY);
      if (savedSearch) {
        const lastSearch: LastSearch = JSON.parse(savedSearch);
        setSearchType(lastSearch.searchType);
        setSearchTerm(lastSearch.searchTerm);
        setResults(lastSearch.results);
      }
    } catch (error) {
      console.error('Error loading saved search:', error);
    }
  }, []);

  useEffect(() => {
    async function loadInitialData() {
      try {
        const [people, movies] = await Promise.all([
          fetchPeople(),
          fetchFilms(),
        ]);
        setPeopleData(people);
        setMoviesData(movies);
      } catch (error) {
        console.error('Error loading initial data:', error);
      }
    }
    loadInitialData();
  }, []);

  useEffect(() => {
    if (searchType === 'people' && peopleData.length > 0) {
      const examples = peopleData.slice(0, 3).map(p => p.name).join(', ');
      setPlaceholder(`e.g. ${examples}`);
    } else if (searchType === 'movies' && moviesData.length > 0) {
      const examples = moviesData.slice(0, 3).map(m => m.properties.title).join(', ');
      setPlaceholder(`e.g. ${examples}`);
    }
  }, [searchType, peopleData, moviesData]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const searchResults = searchType === 'movies' 
        ? await fetchFilms(searchTerm)
        : await fetchPeople(searchTerm);
      
      setResults(searchResults);
      
      // Save search to localStorage
      const lastSearch: LastSearch = {
        searchType,
        searchTerm,
        results: searchResults,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lastSearch));
      
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
                onChange={(e) => {
                  const newType = e.target.value as 'people' | 'movies';
                  setSearchType(newType);
                  if (results !== null) {
                    const lastSearch: LastSearch = {
                      searchType: newType,
                      searchTerm,
                      results: results || [],
                    };
                    localStorage.setItem(STORAGE_KEY, JSON.stringify(lastSearch));
                  }
                }}
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
                onChange={(e) => {
                  const newType = e.target.value as 'people' | 'movies';
                  setSearchType(newType);
                  if (results !== null) {
                    const lastSearch: LastSearch = {
                      searchType: newType,
                      searchTerm,
                      results: results || [],
                    };
                    localStorage.setItem(STORAGE_KEY, JSON.stringify(lastSearch));
                  }
                }}
                className="cursor-pointer" 
              />
              <span className="text-sm font-bold text-gray-700">Movies</span>
            </label>
          </div>
          
          <div className="flex flex-col gap-4">
            <input
              type="text"
              placeholder={placeholder}
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
              {results.map((item: SearchResult, index: number) => {
                const isMovie = searchType === 'movies' && 'properties' in item;
                const isPerson = searchType === 'people' && 'name' in item;
                const title = isMovie ? item.properties.title : isPerson ? item.name : '';
                const id = item.uid || item._id || String(index);
                
                return (
                  <div key={index}>
                    <div className="flex items-center justify-between gap-4 mb-2">
                      <h4 className="text-base font-semibold text-gray-800">
                        {title}
                      </h4>
                      <Link href={`/details/${searchType === 'movies' ? 'movies' : 'people'}/${id}`}>
                        <Button
                          type="button"
                          className="flex-shrink-0"
                        >
                          See Details
                        </Button>
                      </Link>
                    </div>
                    <hr className="my-2 border-gray-300" />
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
