export const API_KEY = '2c46288716a18fb7aadcc2a801f3fc6b';
const BASE_URL = 'https://api.themoviedb.org/3';

export const searchMovies = async (query, startDate = '', endDate = '') => {
  try {
    const searchUrl = `${BASE_URL}/search/movie?api_key=${API_KEY}&language=tr-TR&query=${encodeURIComponent(query)}&include_adult=false`;
    const response = await fetch(searchUrl);

    if (!response.ok) {
      throw new Error('Film arama sırasında bir hata oluştu');
    }

    const data = await response.json();
    let results = data.results || [];

    if (startDate || endDate) {
      results = results.filter(movie => {
        if (!movie.release_date) return false;
        
        const movieDate = new Date(movie.release_date);
        const start = startDate ? new Date(startDate) : new Date('1900-01-01');
        const end = endDate ? new Date(endDate) : new Date('2100-12-31');
        
        return movieDate >= start && movieDate <= end;
      });
    }

    if (results.length > 0) {
      const firstMovie = results[0];
      const similarUrl = `${BASE_URL}/movie/${firstMovie.id}/similar?api_key=${API_KEY}&language=tr-TR`;
      const similarResponse = await fetch(similarUrl);
      
      if (similarResponse.ok) {
        const similarData = await similarResponse.json();
        let similarResults = similarData.results || [];

        if (startDate || endDate) {
          similarResults = similarResults.filter(movie => {
            if (!movie.release_date) return false;
            
            const movieDate = new Date(movie.release_date);
            const start = startDate ? new Date(startDate) : new Date('1900-01-01');
            const end = endDate ? new Date(endDate) : new Date('2100-12-31');
            
            return movieDate >= start && movieDate <= end;
          });
        }

        const allResults = [...results, ...similarResults];
        const uniqueResults = Array.from(new Map(allResults.map(movie => [movie.id, movie])).values());
        
        return uniqueResults.sort((a, b) => b.vote_average - a.vote_average);
      }
    }

    return results;
  } catch (error) {
    console.error('API Hatası:', error);
    throw error;
  }
};

export const getMovieSuggestions = async (query) => {
  try {
    const response = await fetch(
      `${BASE_URL}/search/movie?api_key=${API_KEY}&language=tr-TR&query=${encodeURIComponent(query)}&include_adult=false`
    );

    if (!response.ok) {
      throw new Error('Film önerileri alınamadı');
    }

    const data = await response.json();
    return data.results.slice(0, 5);
  } catch (error) {
    console.error('API Hatası:', error);
    return [];
  }
};

export const getMovieDetails = async (movieId) => {
  try {
    const url = `${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&language=tr-TR`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error('Film detayları alınamadı');
    }
    
    return await response.json();
  } catch (error) {
    console.error('API Hatası:', error);
    throw error;
  }
};

export const getGenres = async () => {
  try {
    const url = `${BASE_URL}/genre/movie/list?api_key=${API_KEY}&language=tr-TR`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error('Film türleri alınamadı');
    }
    
    const data = await response.json();
    return data.genres || [];
  } catch (error) {
    console.error('API Hatası:', error);
    throw error;
  }
};

export const getPopularMovies = async () => {
  try {
    const url = `${BASE_URL}/movie/popular?api_key=${API_KEY}&language=tr-TR&page=1`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error('Popüler filmler alınamadı');
    }
    
    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error('API Hatası:', error);
    throw error;
  }
}; 