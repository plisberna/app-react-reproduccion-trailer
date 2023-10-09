import axios from 'axios'
import YouTube from 'react-youtube'
import './App.css'
import { useState, useEffect } from 'react'

//const API_KEY = 'c35f6c6e915c404b90e06fe7568da9b1'


function App() {

  const API_KEY = '4f5f43495afcc67e9553f6c684a82f84'
  const API_URL = 'https://api.themoviedb.org/3'
  const IMAGE_PATH = 'https://image.tmdb.org/t/p/original'
  const URL_IMAGE = 'https://image.tmdb.org/t/p/original'
  //variable de estado
  const [movies, setMovies] = useState([]);
  const [searchKey, setSearchKey] = useState('');
  const [trailer, setTrailer] = useState(null);
  const [movie, setMovie] = useState({ title: "Loading Movies" });
  const [playing, setPlaying] = useState(false);

  //funcion par hacer la peticion a la api

  const fetchMovies = async (searchKey) => {
    const type = searchKey ? 'search' : 'discover'
    const { data: { results },
    } = await axios.get(`${API_URL}/${type}/movie`, {
      params: {
        api_key: API_KEY,
        query: searchKey,
      },
    });
    setMovies(results) 
    setMovie(results[0])
    
    if (results.length) {
      await fetchMovie(results[0].id)
    }

  }
  //funcion para un solo objeto
  const fetchMovie = async (id) => {
    const { data } = await axios.get(`${API_URL}/movie/${id}`, {
      params: {
        api_key: API_KEY,
        append_to_response: 'videos'
      }
    })
    if (data.videos && data.videos.results) {
      const trailer = data.videos.results.find(
        (vid) => vid.name === 'Official Trailer'
      );
      setTrailer(trailer ? trailer : data.videos.results[0])
    }
    setMovie(data)
  }

  const selectMovie = async(movie) => {
    fetchMovie(movie.id)
    setMovie(movie)
    window.scroll(0, 0)
}


  //funcion buscar peliculas
  const searchMovies = (e) => {
    e.preventDefault()
    fetchMovies(searchKey)
  }

  useEffect(() => {
    fetchMovies()
  },[]);


  return (
    <div>
      {/* este es el buscador de peliculas*/}
      <h3 className='text-center m5'>Busca tu Pelicula Favorita</h3>
      <form className='container' onSubmit={searchMovies}>
        <input
          type='text'
          placeholder='Escribe tu Pelicula Favorita'
          onChange={(e)=>setSearchKey(e.target.value)}
        />
        <button className='btn btn-primary m-2'>Buscar</button>
      </form>
      {/* contenedor del baner y el reproductor de video*/}
      <div>
        <main>
          {movie ? (
            <div
              className='viewtrailer'
              style={{
                backgroundImage: `url("${IMAGE_PATH}${movie.backdrop_path}")`,
              }}
            >
              {playing ? (
                <>
                  <YouTube
                    videoId={trailer.key}
                    className='reproductor container'
                    containerClassName={'youtube-container amru'}
                    opts={{
                      width: '100%',
                      height: '100%',
                      playerVars: {
                        autoplay: 1,
                        controls: 0,
                        cc_load_policy: 0,
                        fs: 0,
                        iv_load_policy: 0,
                        modestbranding: 0,
                        rel: 0,
                        showinfo: 0,
                      },
                    }}
                  />
                  <button className='boton' onClick={() => setPlaying(false)}>
                    Close
                  </button>
                </>
              ) : (
                  <div className='container'>
                    <div className=''>
                      {trailer ? (
                        <button
                          className='boton'
                          onClick={() => setPlaying(true)}
                          type='button'
                        >Play Trailer
                        </button>
                      ) : (
                          'Sorry, no trailer available'
                      )}
                      <h1 className='text-white'>{movie.title}</h1>
                      <p className='text-white'>{ movie.overview}</p>
                    </div>
                  </div>
              )}
            </div>
          ): null}
        </main>
      </div>
      
      {/* contenedor de poster peliculas*/}
      <div className='container mt-3'>
        <div className='row'>
          {movies.map((movie)=> (
            <div key={movie.id} className='col-md-4 mb-3' onClick={()=> selectMovie(movie)}>
              <img src={`${URL_IMAGE + movie.poster_path}`} alt={movie.title} height={600} width='100%' />
              <h4 className='text-center'>{ movie.title }</h4>
            </div>
          ))}
        </div>
      </div>
    
    </div>
  )
}

export default App
