import React from 'react';
import styled from 'styled-components';

const FiltersContainer = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.large};
  padding: 20px;
  margin: 20px auto;
  max-width: 1000px;
  box-shadow: ${({ theme }) => theme.shadows.medium};
`;

const FilterGroup = styled.div`
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
  align-items: center;
  margin-bottom: 15px;

  &:last-child {
    margin-bottom: 0;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const FilterLabel = styled.span`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: 0.9rem;
  min-width: 100px;
`;

const FilterButton = styled.button`
  background: ${({ theme, $active }) => 
    $active ? theme.colors.primary : theme.colors.surfaceLight};
  color: ${({ theme, $active }) => 
    $active ? theme.colors.text.primary : theme.colors.text.secondary};
  border: none;
  padding: 8px 16px;
  border-radius: ${({ theme }) => theme.borderRadius.default};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  font-size: 0.9rem;

  &:hover {
    background: ${({ theme, $active }) => 
      $active ? theme.colors.primaryDark : theme.colors.primary};
    color: ${({ theme }) => theme.colors.text.primary};
  }
`;

const RangeContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 1;
`;

const RangeInput = styled.input`
  width: 100%;
  -webkit-appearance: none;
  height: 4px;
  background: ${({ theme }) => theme.colors.surfaceLight};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  outline: none;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 16px;
    height: 16px;
    background: ${({ theme }) => theme.colors.primary};
    border-radius: 50%;
    cursor: pointer;
    transition: all ${({ theme }) => theme.transitions.fast};

    &:hover {
      background: ${({ theme }) => theme.colors.primaryDark};
      transform: scale(1.2);
    }
  }

  &::-moz-range-thumb {
    width: 16px;
    height: 16px;
    background: ${({ theme }) => theme.colors.primary};
    border: none;
    border-radius: 50%;
    cursor: pointer;
    transition: all ${({ theme }) => theme.transitions.fast};

    &:hover {
      background: ${({ theme }) => theme.colors.primaryDark};
      transform: scale(1.2);
    }
  }
`;

const RangeValue = styled.span`
  min-width: 40px;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: 0.9rem;
`;

function MovieFilters({ filters = { genres: [], minRating: 0 }, onFilterChange }) {
  const handleGenreClick = (genreId) => {
    onFilterChange({
      ...filters,
      genres: filters.genres.includes(genreId)
        ? filters.genres.filter(id => id !== genreId)
        : [...filters.genres, genreId]
    });
  };

  const handleRatingChange = (e) => {
    onFilterChange({
      ...filters,
      minRating: parseFloat(e.target.value)
    });
  };

  const genres = [
    { id: 28, name: 'Aksiyon' },
    { id: 35, name: 'Komedi' },
    { id: 18, name: 'Drama' },
    { id: 27, name: 'Korku' },
    { id: 10749, name: 'Romantik' },
    { id: 878, name: 'Bilim Kurgu' }
  ];

  return (
    <FiltersContainer>
      <FilterGroup>
        <FilterLabel>Türler:</FilterLabel>
        {genres.map(genre => (
          <FilterButton
            key={genre.id}
            $active={filters.genres.includes(genre.id)}
            onClick={() => handleGenreClick(genre.id)}
          >
            {genre.name}
          </FilterButton>
        ))}
      </FilterGroup>

      <FilterGroup>
        <FilterLabel>Minimum Puan:</FilterLabel>
        <RangeContainer>
          <RangeInput
            type="range"
            min="0"
            max="10"
            step="0.5"
            value={filters.minRating}
            onChange={handleRatingChange}
          />
          <RangeValue>{filters.minRating}</RangeValue>
        </RangeContainer>
      </FilterGroup>
    </FiltersContainer>
  );
}

export default MovieFilters; 