'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { fetchFilms, fetchPeople } from '../actions';
import Button from './Button';
import { Person } from '../types/person';
import { Movie } from '../types/movie';

const STORAGE_KEY = 'swstarter-last-search';

type SearchResult = Person | Movie;

interface LastSearch {
  searchType: 'people' | 'movies';
  searchTerm: string;
  results: SearchResult[];
}

interface SearchPageProps {
  initialPeople: Person[];
  initialMovies: Movie[];
}

function isMovie(item: SearchResult): item is Movie {
  return item.type === 'movie';
}

function isPerson(item: SearchResult): item is Person {
  return item.type === 'person';
}

export default function SearchPage({ initialPeople, initialMovies }: SearchPageProps) {
  const [searchType, setSearchType] = useState<'people' | 'movies'>('people');
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<SearchResult[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [peopleData] = useState<Person[]>(initialPeople);
  const [moviesData] = useState<Movie[]>(initialMovies);
  const [placeholder, setPlaceholder] = useState<string>('e.g. Luke Skywalker, C-3P0, R2-D2');

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
    <div className="min-h-screen bg-[#ededed] flex items-start justify-center pt-6 sm:pt-12 pb-6">
      <div className="flex flex-col lg:flex-row items-start gap-4 sm:gap-6 lg:gap-8 w-full max-w-[90rem] px-4">
        <form 
          onSubmit={handleSearch}
          className="w-full lg:w-[28%] xl:w-[32%] 2xl:w-[410px] min-h-[230px] p-6 sm:p-8 rounded-lg shadow-lg bg-white flex-shrink-0 flex flex-col gap-4"
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
              onChange={(e) => {
                const newValue = e.target.value;
                setSearchTerm(newValue);
                if (!newValue.trim()) {
                  localStorage.removeItem(STORAGE_KEY);
                  setResults(null);
                }
              }}
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
        
        <div className="w-full lg:w-[68%] xl:w-[64%] 2xl:w-[40rem] h-[400px] sm:h-[500px] lg:h-[40rem] p-6 sm:p-8 rounded-lg shadow-lg bg-white flex-shrink-0 flex flex-col">
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
                const title = isMovie(item) 
                  ? item.properties.title 
                  : isPerson(item) 
                    ? item.name 
                    : '';
                const id = item.uid || item._id || String(index);
                
                return (
                  <div key={index}>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-4 mb-2">
                      <h4 className="text-sm sm:text-base font-semibold text-gray-800 break-words flex-1">
                        {title}
                      </h4>
                      <Link href={`/details/${searchType === 'movies' ? 'movies' : 'people'}/${id}`} className="flex-shrink-0 w-full sm:w-auto">
                        <Button
                          type="button"
                          className="w-full sm:w-auto"
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

