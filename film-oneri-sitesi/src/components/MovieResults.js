import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase';
import { doc, setDoc, deleteDoc, getDoc, serverTimestamp } from 'firebase/firestore';

const ResultsContainer = styled.div`
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
`;

const MovieGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 20px;
  padding: 20px;
`;

const MovieCard = styled.div`
  position: relative;
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.default};
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.2s ease;
  box-shadow: ${({ theme }) => theme.shadows.medium};
  height: 340px;

  &:hover {
    transform: translateY(-5px);
  }
`;

const MovieImage = styled.img`
  width: 100%;
  height: 270px;
  object-fit: cover;
  transition: transform 0.3s ease;
`;

const MovieInfo = styled.div`
  padding: 10px;
  background: ${({ theme }) => theme.colors.surface};
`;

const MovieTitle = styled.h3`
  margin: 0;
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.text.primary};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const MovieYear = styled.span`
  font-size: 0.8rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-right: 10px;
`;

const MovieRating = styled.span`
  font-size: 0.8rem;
  color: ${({ theme }) => theme.colors.accent.yellow};
`;

const NoResults = styled.div`
  text-align: center;
  padding: 40px;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: 1.2rem;
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.default};
  margin: 20px;
`;

const FavoriteButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: ${({ $isFavorite, theme }) => 
    $isFavorite ? theme.colors.accent.red : 'rgba(0, 0, 0, 0.5)'};
  color: white;
  border: none;
  padding: 8px;
  border-radius: 50%;
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  z-index: 2;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;

  &:hover {
    transform: scale(1.1);
    background: ${({ $isFavorite, theme }) => 
      $isFavorite ? theme.colors.accent.redDark : theme.colors.primary};
  }
`;

const LoadingContainer = styled.div`
  text-align: center;
  padding: 40px;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: 1.2rem;
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.default};
  margin: 20px;
`;

const noImageUrl = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';

function MovieResults({ movies = [] }) {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [favorites, setFavorites] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkFavorites = async () => {
      if (!currentUser) {
        setFavorites({});
        setLoading(false);
        return;
      }

      try {
        const favStatus = {};
        for (const movie of movies) {
          if (!movie?.id) continue;
          
          const favoriteId = `${currentUser.uid}_${movie.id}`;
          const favoriteRef = doc(db, 'favorites', favoriteId);
          const favoriteDoc = await getDoc(favoriteRef);
          favStatus[movie.id] = favoriteDoc.exists();
        }
        setFavorites(favStatus);
      } catch (error) {
        console.error('Favori durumu kontrol edilirken hata:', error);
        // Hata durumunda kullanıcıya bilgi ver
        if (error.code === 'permission-denied') {
          console.log('Favori işlemleri için yetkiniz yok');
        }
      } finally {
        setLoading(false);
      }
    };

    checkFavorites();
  }, [movies, currentUser]);

  const handleFavoriteClick = async (e, movie) => {
    e.stopPropagation();
    
    if (!currentUser) {
      alert('Favorilere eklemek için giriş yapmalısınız.');
      return;
    }

    try {
      const favoriteId = `${currentUser.uid}_${movie.id}`;
      const favoriteRef = doc(db, 'favorites', favoriteId);
      
      if (favorites[movie.id]) {
        await deleteDoc(favoriteRef);
        setFavorites(prev => ({ ...prev, [movie.id]: false }));
      } else {
        const favoriteData = {
          userId: currentUser.uid,
          movieId: movie.id,
          title: movie.title,
          poster_path: movie.poster_path,
          vote_average: movie.vote_average,
          genre_ids: movie.genre_ids,
          overview: movie.overview,
          release_date: movie.release_date,
          addedAt: serverTimestamp()
        };
        
        await setDoc(favoriteRef, favoriteData);
        setFavorites(prev => ({ ...prev, [movie.id]: true }));
      }
    } catch (err) {
      console.error('Favori işlemi sırasında hata:', err);
      if (err.code === 'permission-denied') {
        alert('Bu işlem için yetkiniz yok.');
      } else {
        alert(favorites[movie.id] ? 
          'Favorilerden çıkarırken bir hata oluştu.' : 
          'Favorilere eklerken bir hata oluştu.'
        );
      }
    }
  };

  const handleMovieClick = (movieId) => {
    if (!movieId) return;
    navigate(`/movie/${movieId}`);
  };

  if (loading) {
    return <LoadingContainer>Filmler yükleniyor...</LoadingContainer>;
  }

  if (!movies || movies.length === 0) {
    return <NoResults>Henüz film bulunamadı.</NoResults>;
  }

  return (
    <ResultsContainer>
      <MovieGrid>
        {movies.map((movie) => movie && (
          <MovieCard 
            key={movie.id} 
            onClick={() => handleMovieClick(movie.id)}
          >
            {currentUser && (
              <FavoriteButton
                onClick={(e) => handleFavoriteClick(e, movie)}
                $isFavorite={favorites[movie.id]}
              >
                {favorites[movie.id] ? '❤️' : '🤍'}
              </FavoriteButton>
            )}
            <MovieImage
              src={movie.poster_path 
                ? `https://image.tmdb.org/t/p/w342${movie.poster_path}`
                : noImageUrl
              }
              alt={movie.title}
              onError={(e) => {
                e.target.src = noImageUrl;
              }}
            />
            <MovieInfo>
              <MovieTitle title={movie.title}>{movie.title}</MovieTitle>
              <MovieYear>{movie.release_date?.split('-')[0]}</MovieYear>
              <MovieRating>⭐ {movie.vote_average?.toFixed(1)}</MovieRating>
            </MovieInfo>
          </MovieCard>
        ))}
      </MovieGrid>
    </ResultsContainer>
  );
}

export default MovieResults; 