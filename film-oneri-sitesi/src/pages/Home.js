import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import MovieSearch from '../components/MovieSearch';
import MovieFilters from '../components/MovieFilters';
import MovieResults from '../components/MovieResults';

const HomeContainer = styled.div`
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
`;

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

function Home() {
  const [searchResults, setSearchResults] = useState(() => {
    const savedResults = localStorage.getItem('lastSearchResults');
    return savedResults ? JSON.parse(savedResults) : [];
  });

  const [error, setError] = useState(null);
  const [filters, setFilters] = useState(() => {
    const savedFilters = localStorage.getItem('lastFilters');
    return savedFilters ? JSON.parse(savedFilters) : {
      genres: [],
      minRating: 0
    };
  });

  useEffect(() => {
    localStorage.setItem('lastSearchResults', JSON.stringify(searchResults));
  }, [searchResults]);

  useEffect(() => {
    localStorage.setItem('lastFilters', JSON.stringify(filters));
  }, [filters]);

  const handleSearch = (results) => {
    setSearchResults(results);
    setError(null);
  };

  const handleError = (errorMessage) => {
    setError(errorMessage);
    setSearchResults([]);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const filteredMovies = searchResults.filter(movie => {
    const passesRating = movie.vote_average >= filters.minRating;
    const passesGenres = filters.genres.length === 0 || 
      movie.genre_ids?.some(id => filters.genres.includes(id));
    return passesRating && passesGenres;
  });

  return (
    <HomeContainer>
      <ContentContainer>
        <MovieSearch 
          onSearch={handleSearch} 
          onError={handleError}
          initialQuery={localStorage.getItem('lastSearchQuery') || ''}
        />
        <MovieFilters 
          filters={filters}
          onFilterChange={handleFilterChange}
        />
        {error ? (
          <div>Hata: {error}</div>
        ) : (
          <MovieResults movies={filteredMovies} />
        )}
      </ContentContainer>
    </HomeContainer>
  );
}

export default Home; 