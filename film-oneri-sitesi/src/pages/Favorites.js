import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import MovieResults from '../components/MovieResults';
import MovieFilters from '../components/MovieFilters';

const FavoritesContainer = styled.div`
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.h1`
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: 30px;
  font-size: 2rem;
  text-align: center;
`;

const NoFavorites = styled.div`
  text-align: center;
  padding: 40px;
  color: ${({ theme }) => theme.colors.text.secondary};
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.default};
  margin: 20px;
`;

function Favorites() {
  const { currentUser, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    genres: [],
    minRating: 0
  });

  useEffect(() => {
    if (!isAuthenticated && !loading) {
      navigate('/login');
      return;
    }

    const fetchFavorites = async () => {
      if (!currentUser) return;

      try {
        const q = query(
          collection(db, 'favorites'),
          where('userId', '==', currentUser.uid)
        );
        
        const querySnapshot = await getDocs(q);
        const favoritesData = querySnapshot.docs.map(doc => ({
          ...doc.data(),
          id: doc.data().movieId
        }));
        
        favoritesData.sort((a, b) => 
          new Date(b.addedAt) - new Date(a.addedAt)
        );
        
        setFavorites(favoritesData);
      } catch (error) {
        console.error('Favoriler yüklenirken hata:', error);
      } finally {
        setLoading(false);
      }
    };

    if (currentUser) {
      fetchFavorites();
    }
  }, [currentUser, isAuthenticated, loading, navigate]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const filteredMovies = favorites.filter(movie => {
    if (!movie) return false;
    
    const passesRating = movie.vote_average >= filters.minRating;
    const passesGenres = filters.genres.length === 0 || 
      (movie.genre_ids && movie.genre_ids.some(id => filters.genres.includes(id)));
    
    return passesRating && passesGenres;
  });

  if (loading) {
    return (
      <FavoritesContainer>
        <Header>Favoriler</Header>
        <NoFavorites>Yükleniyor...</NoFavorites>
      </FavoritesContainer>
    );
  }

  if (!isAuthenticated) {
    return (
      <FavoritesContainer>
        <Header>Favoriler</Header>
        <NoFavorites>
          Favorilerinizi görmek için lütfen giriş yapın.
        </NoFavorites>
      </FavoritesContainer>
    );
  }

  return (
    <FavoritesContainer>
      <Header>Favoriler</Header>
      <MovieFilters 
        filters={filters}
        onFilterChange={handleFilterChange}
      />
      {favorites.length === 0 ? (
        <NoFavorites>
          Henüz favori film eklemediniz.
        </NoFavorites>
      ) : (
        <MovieResults movies={filteredMovies} />
      )}
    </FavoritesContainer>
  );
}

export default Favorites; 