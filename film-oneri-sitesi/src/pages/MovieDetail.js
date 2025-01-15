import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { getMovieDetails } from '../services/movieApi';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase';
import { doc, setDoc, deleteDoc, getDoc } from 'firebase/firestore';

const DetailContainer = styled.div`
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const MovieHeader = styled.div`
  display: flex;
  gap: 30px;
  margin-bottom: 40px;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    flex-direction: column;
  }
`;

const PosterContainer = styled.div`
  flex-shrink: 0;
  width: 300px;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    width: 100%;
    max-width: 300px;
    margin: 0 auto;
  }
`;

const Poster = styled.img`
  width: 100%;
  height: auto;
  border-radius: ${({ theme }) => theme.borderRadius.default};
  box-shadow: ${({ theme }) => theme.shadows.medium};
`;

const MovieInfo = styled.div`
  flex-grow: 1;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 10px;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const Tagline = styled.p`
  font-style: italic;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: 20px;
`;

const Overview = styled.p`
  line-height: 1.6;
  margin-bottom: 20px;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const MetaInfo = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
`;

const MetaItem = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  padding: 15px;
  border-radius: ${({ theme }) => theme.borderRadius.default};
  
  h3 {
    font-size: 0.9rem;
    color: ${({ theme }) => theme.colors.text.secondary};
    margin-bottom: 5px;
  }
  
  p {
    color: ${({ theme }) => theme.colors.text.primary};
    font-weight: 500;
  }
`;

const FavoriteButton = styled.button`
  background: ${({ $isFavorite, theme }) => 
    $isFavorite ? theme.colors.accent.red : theme.colors.primary};
  color: ${({ theme }) => theme.colors.text.primary};
  border: none;
  padding: 12px 24px;
  border-radius: ${({ theme }) => theme.borderRadius.default};
  cursor: pointer;
  font-weight: 600;
  transition: all ${({ theme }) => theme.transitions.default};
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadows.medium};
  }
  
  &:disabled {
    background: ${({ theme }) => theme.colors.surfaceLight};
    cursor: not-allowed;
    transform: none;
  }
`;

function MovieDetail() {
  const { id } = useParams();
  const { currentUser } = useAuth();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const data = await getMovieDetails(id);
        setMovie(data);
        if (currentUser) {
          const favoriteRef = doc(db, 'favorites', `${currentUser.uid}_${id}`);
          const favoriteDoc = await getDoc(favoriteRef);
          setIsFavorite(favoriteDoc.exists());
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetails();
  }, [id, currentUser]);

  const handleFavoriteClick = async () => {
    if (!currentUser) {
      alert('Favorilere eklemek için giriş yapmalısınız.');
      return;
    }

    const favoriteId = `${currentUser.uid}_${id}`;
    const favoriteRef = doc(db, 'favorites', favoriteId);
    
    try {
      if (isFavorite) {
        await deleteDoc(favoriteRef);
        setIsFavorite(false);
      } else {
        const favoriteData = {
          userId: currentUser.uid,
          movieId: id,
          title: movie.title,
          poster_path: movie.poster_path,
          vote_average: movie.vote_average,
          genre_ids: movie.genres.map(genre => genre.id),
          overview: movie.overview,
          release_date: movie.release_date,
          addedAt: new Date().toISOString()
        };
        
        await setDoc(favoriteRef, favoriteData);
        setIsFavorite(true);
      }
    } catch (err) {
      console.error('Favori işlemi sırasında hata:', err);
      alert(isFavorite ? 
        'Favorilerden çıkarırken bir hata oluştu.' : 
        'Favorilere eklerken bir hata oluştu.'
      );
    }
  };

  if (loading) return <DetailContainer>Yükleniyor...</DetailContainer>;
  if (error) return <DetailContainer>Hata: {error}</DetailContainer>;
  if (!movie) return <DetailContainer>Film bulunamadı.</DetailContainer>;

  return (
    <DetailContainer>
      <MovieHeader>
        <PosterContainer>
          <Poster
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title}
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/500x750?text=No+Image';
            }}
          />
        </PosterContainer>
        
        <MovieInfo>
          <Title>{movie.title}</Title>
          {movie.tagline && <Tagline>{movie.tagline}</Tagline>}
          <Overview>{movie.overview}</Overview>
          
          <MetaInfo>
            <MetaItem>
              <h3>Çıkış Tarihi</h3>
              <p>{new Date(movie.release_date).toLocaleDateString('tr-TR')}</p>
            </MetaItem>
            <MetaItem>
              <h3>Puan</h3>
              <p>{movie.vote_average?.toFixed(1)} / 10</p>
            </MetaItem>
            <MetaItem>
              <h3>Süre</h3>
              <p>{movie.runtime} dakika</p>
            </MetaItem>
            <MetaItem>
              <h3>Türler</h3>
              <p>{movie.genres?.map(genre => genre.name).join(', ')}</p>
            </MetaItem>
          </MetaInfo>
          
          {currentUser && (
            <FavoriteButton
              onClick={handleFavoriteClick}
              $isFavorite={isFavorite}
            >
              {isFavorite ? 'Favorilerden Çıkar' : 'Favorilere Ekle'}
            </FavoriteButton>
          )}
        </MovieInfo>
      </MovieHeader>
    </DetailContainer>
  );
}

export default MovieDetail; 