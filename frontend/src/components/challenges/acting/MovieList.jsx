import React, { useState, useRef, useEffect } from 'react'
import { getRandomMovie } from '../../../services/gameServices'
import withoutMovie from '../../../assets/images/common/without-movie.jpg';
import { GrUpdate } from "react-icons/gr";

export const MovieList = ({selectedMovie, setSelectedMovie, setUrlImage}) => {
    const [currentIndex, setCurrentIndex] = useState(0)
    const carouselRef = useRef(null);
    const [movies, setMovies] = useState([]);

    useEffect(() => {
        const properties = JSON.parse(localStorage.getItem('acting-movies-GG'));
        if(properties != null){
            setMovies(properties.movies);
            setCurrentIndex(properties.currentIndex)
        } else {
            getMovies();
        }
    },[])

    useEffect(() => {
        localStorage.setItem('acting-movies-GG', JSON.stringify({currentIndex, movies}));
      },[currentIndex, movies])
  
    const handleSelectMovie = (movie) => {
        setSelectedMovie(movie.title);
        setUrlImage('https://image.tmdb.org/t/p/w400'+movie.poster_path);
    }
  
    const scrollToIndex = (index) => {
      if (carouselRef.current) {
        const scrollWidth = carouselRef.current.scrollWidth
        const itemWidth = scrollWidth / movies.length
        carouselRef.current.scrollTo({
          left: itemWidth * index,
          behavior: 'smooth'
        })
      }
    }
  
    const handlePrevious = () => {
      setCurrentIndex((prevIndex) => {
        const newIndex = prevIndex > 0 ? prevIndex - 1 : movies.length - 1
        scrollToIndex(newIndex)
        return newIndex
      })
    }
  
    const handleNext = () => {
      setCurrentIndex((prevIndex) => {
        const newIndex = prevIndex < movies.length - 1 ? prevIndex + 1 : 0
        scrollToIndex(newIndex)
        return newIndex
      })
    }

    const writtenMovie = (title) => {
        setSelectedMovie(title);
        setUrlImage(withoutMovie);
    }
  
    useEffect(() => {
      const handleResize = () => scrollToIndex(currentIndex)
      window.addEventListener('resize', handleResize)
      return () => window.removeEventListener('resize', handleResize)
    }, [currentIndex]);

    const getMovies = async () => {
        const moviesFetch = await getRandomMovie();
        setMovies(moviesFetch);
    }
  
    return (
      <div className="p-4 mx-auto space-y-4" style={{maxWidth: '19rem'}}>
        <h1 className="text-xl font-bold text-center">Selecciona una pelicula o escribe una propia</h1>
        
        <div className="relative">
          <div 
            ref={carouselRef}
            className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {movies?.map((movie) => (
              <div key={movie.id} className="flex-shrink-0 w-full snap-center">
                <div className="p-1">
                  <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <img src={'https://image.tmdb.org/t/p/w400'+movie.poster_path} alt={movie.title} className="m-auto w-40 h-40 object-cover" />
                    <div className="p-4">
                      <button 
                        className="w-full py-2 px-4 bg-blue-400 text-black rounded hover:bg-black hover:text-white focus:outline-none focus:ring-2 focus:ring-black focus:ring-opacity-50 transition-colors"
                        onClick={() => handleSelectMovie(movie)}
                      >
                        {movie.title}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button
            className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 rounded-full p-2 shadow-md focus:outline-none"
            onClick={handlePrevious}
          >
            &#10094;
          </button>
          <button
            className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 rounded-full p-2 shadow-md focus:outline-none"
            onClick={handleNext}
          >
            &#10095;
          </button>
        <div>
            <button className='btn bg-yellow-600' onClick={getMovies}><GrUpdate width={50}/></button>
        </div>
        </div>
  
        <div className="space-y-2">
          <label className="block font-medium text-gray-700">
            Modifica la película si deseas:
          </label>
          <textarea 
            rows={2}
            type="text"
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Select a movie from the carousel"
            value={selectedMovie} 
            onChange={(e) => writtenMovie(e.target.value)}
          />
        </div>
      </div>
    )
}
