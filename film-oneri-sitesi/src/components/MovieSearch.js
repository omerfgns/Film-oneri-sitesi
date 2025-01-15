import React, { useState, useRef, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { searchMovies, API_KEY } from '../services/movieApi';

const SearchContainer = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.surfaceLight};
  border-radius: ${({ theme }) => theme.borderRadius.large};
  padding: 40px;
  margin: 40px auto;
  max-width: 1000px;
  box-shadow: ${({ theme }) => theme.shadows.medium};
  backdrop-filter: ${({ theme }) => theme.blur.default};
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 30px;
`;

const SearchBox = styled.div`
  position: relative;
  width: 100%;
`;

const Input = styled.input`
  width: 100%;
  padding: ${({ $hasIcon }) => $hasIcon ? '15px 15px 15px 50px' : '15px'};
  background: ${({ theme }) => theme.colors.surfaceLight};
  border: 2px solid transparent;
  border-radius: ${({ theme }) => theme.borderRadius.default};
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: 1.1rem;
  transition: all ${({ theme }) => theme.transitions.default};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: ${({ theme }) => theme.shadows.glow};
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.text.light};
  }
`;

const SearchIcon = styled.span`
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: ${({ theme }) => theme.colors.text.light};
  font-size: 1.2rem;
`;

const DateContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
  }
`;

const DateGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const DateLabel = styled.label`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: 0.9rem;
`;

const DateInput = styled(Input).attrs({ type: 'date' })`
  padding: 13px 15px;
  color: ${({ theme, value }) => value ? theme.colors.text.primary : theme.colors.text.light};

  &::-webkit-calendar-picker-indicator {
    filter: invert(0.7);
    cursor: pointer;
    
    &:hover {
      filter: invert(0.9);
    }
  }
`;

const Button = styled.button`
  background: ${({ theme }) => theme.colors.gradients.primary};
  color: ${({ theme }) => theme.colors.text.primary};
  border: none;
  padding: 15px 30px;
  border-radius: ${({ theme }) => theme.borderRadius.default};
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.default};
  box-shadow: ${({ theme }) => theme.shadows.medium};

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadows.large};
  }

  &:disabled {
    background: ${({ theme }) => theme.colors.surfaceLight};
    cursor: not-allowed;
    transform: none;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;

const SearchSuggestions = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.default};
  margin-top: 5px;
  box-shadow: ${({ theme }) => theme.shadows.medium};
  max-height: 300px;
  overflow-y: auto;
  z-index: 1000;
`;

const SuggestionItem = styled.div`
  padding: 12px 15px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    background: ${({ theme }) => theme.colors.surfaceLight};
  }
`;

const SuggestionImage = styled.img`
  width: 40px;
  height: 60px;
  object-fit: cover;
  border-radius: 4px;
`;

const SuggestionInfo = styled.div`
  flex: 1;
`;

const SuggestionTitle = styled.div`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: 0.9rem;
  margin-bottom: 4px;
`;

const SuggestionYear = styled.div`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: 0.8rem;
`;

function MovieSearch({ onSearch, onError, initialQuery = '' }) {
  const [query, setQuery] = useState(initialQuery);
  const [startDate, setStartDate] = useState(() => 
    localStorage.getItem('lastStartDate') || ''
  );
  const [endDate, setEndDate] = useState(() => 
    localStorage.getItem('lastEndDate') || ''
  );
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    // Tıklama olayını dinle
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Film önerilerini getir
  const fetchSuggestions = useCallback(async (searchQuery) => {
    if (!searchQuery.trim()) {
      setSuggestions([]);
      return;
    }

    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&language=tr-TR&query=${encodeURIComponent(searchQuery)}&include_adult=false`
      );
      const data = await response.json();
      setSuggestions(data.results.slice(0, 5));
    } catch (error) {
      console.error('Öneriler alınırken hata:', error);
    }
  }, []);

  // Debounce fonksiyonu
  const debounce = useCallback((func, wait) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  }, []);

  // Debounce edilmiş arama fonksiyonu
  const debouncedFetch = useCallback(
    (searchQuery) => {
      const debouncedFunction = debounce((query) => fetchSuggestions(query), 300);
      debouncedFunction(searchQuery);
    },
    [debounce, fetchSuggestions]
  );

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    setShowSuggestions(true);
    debouncedFetch(value);
  };

  const handleSuggestionClick = (movie) => {
    setQuery(movie.title);
    setShowSuggestions(false);
    handleSearch(movie.title);
  };

  const handleSearch = async (searchQuery) => {
    setLoading(true);
    try {
      const results = await searchMovies(searchQuery, startDate, endDate);
      onSearch(results);
    } catch (error) {
      onError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Son aramayı kaydet
  useEffect(() => {
    localStorage.setItem('lastSearchQuery', query);
  }, [query]);

  // Tarihleri kaydet
  useEffect(() => {
    localStorage.setItem('lastStartDate', startDate);
    localStorage.setItem('lastEndDate', endDate);
  }, [startDate, endDate]);

  // Sayfa yüklendiğinde son aramayı yap
  useEffect(() => {
    if (initialQuery) {
      handleSearch(initialQuery);
    }
  }, []);

  return (
    <SearchContainer>
      <Form onSubmit={(e) => { e.preventDefault(); handleSearch(query); }}>
        <SearchBox ref={searchRef}>
          <SearchIcon>🔍</SearchIcon>
          <Input
            type="text"
            placeholder="Film adı girin..."
            value={query}
            onChange={handleInputChange}
            $hasIcon
          />
          {showSuggestions && suggestions.length > 0 && (
            <SearchSuggestions>
              {suggestions.map((movie) => (
                <SuggestionItem
                  key={movie.id}
                  onClick={() => handleSuggestionClick(movie)}
                >
                  <SuggestionImage
                    src={movie.poster_path 
                      ? `https://image.tmdb.org/t/p/w92${movie.poster_path}`
                      : 'https://via.placeholder.com/92x138?text=No+Image'
                    }
                    alt={movie.title}
                  />
                  <SuggestionInfo>
                    <SuggestionTitle>{movie.title}</SuggestionTitle>
                    <SuggestionYear>
                      {movie.release_date?.split('-')[0] || 'Tarih yok'}
                    </SuggestionYear>
                  </SuggestionInfo>
                </SuggestionItem>
              ))}
            </SearchSuggestions>
          )}
        </SearchBox>
        
        <DateContainer>
          <DateGroup>
            <DateLabel>Başlangıç Tarihi</DateLabel>
            <DateInput
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              max={endDate || undefined}
            />
          </DateGroup>
          
          <DateGroup>
            <DateLabel>Bitiş Tarihi</DateLabel>
            <DateInput
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              min={startDate || undefined}
            />
          </DateGroup>
        </DateContainer>

        <ButtonContainer>
          <Button type="submit" disabled={loading || !query.trim()}>
            {loading ? 'Aranıyor...' : 'Film Ara'}
          </Button>
        </ButtonContainer>
      </Form>
    </SearchContainer>
  );
}

export default MovieSearch;
