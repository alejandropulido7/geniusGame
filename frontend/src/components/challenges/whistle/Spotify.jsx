import React, {useEffect, useState} from 'react';
import { getTokenSpotify, getArtists, getSongs } from '../../../services/gameServices';


export const Spotify = ({setArtistInput, setSongInput}) => {

      const [query, setQuery] = useState('');
      const [results, setResults] = useState([]);
      const [typingTimeout, setTypingTimeout] = useState(null);
      const [artist, setArtist] = useState({});
      const [songsList, setSongList] = useState([]);
      const [showArtists, setShowArtists] = useState(false);

      useEffect(() => {
        localStorage.removeItem('GG-SpotifyToken');
      }, []);
    
      const fetchResults = async (artistName) => {
        try {
            let token = localStorage.getItem('GG-SpotifyToken');
            if(!token){
              const tokenSpotify = await getTokenSpotify();
              token = tokenSpotify.access_token;
              localStorage.setItem('GG-SpotifyToken', token);
            }
            const response = await getArtists(artistName, token);
            setResults(response || []);
        } catch (error) {
            console.error('Error fetching search results:', error);
        }
      };
    
      const handleInputChange = (e) => {
        const value = e.target.value;
        setShowArtists(true);
        setQuery(value);
    
        if (typingTimeout) {
          clearTimeout(typingTimeout);
        }
    
        if (value.length > 1) {
          setTypingTimeout(
            setTimeout(() => {
              fetchResults(value);
            }, 200) // 1-second debounce
          );
        }
      };

      const manageArtist = async (result) => {
        setArtist(result);
        setQuery(result.name);
        setArtistInput(result.name);
        let token = localStorage.getItem('GG-SpotifyToken');
        const responseSongs = await getSongs(result.id, token);
        setSongList(responseSongs);
        setShowArtists(false);
      }

      const selectSong = (event) => {
        const value = event.target.value;
        if(value != ''){
            setSongInput(event.target.value);
        }
      }
    
      return (
        <div className="dynamic-search mx-auto relative">
          <input
            type="text"
            value={query}
            onChange={handleInputChange}
            placeholder="Buscar artista.."
            className="input my-5"
          />
          {showArtists && 
          <ul className="absolute top-16 mt-4 border">
            {results.map((result, index) => (
              <li key={index} className="py-3 px-10 border-b bg-white cursor-pointer hover:bg-slate-100" onClick={() => manageArtist(result)}>
                {result.name}
              </li>
            ))}
          </ul>}
          {artist?.name &&
            <div className='mx-auto'>
                <select className='select' onChange={selectSong}>
                    <option value="" className='text-center'>Selecciona una cancion..</option>
                    {
                    songsList?.map(song => {
                        return (
                        <option key={song.id} value={song.name}>{song.name}</option>
                        );
                    })
                    }
                </select> 
            </div>}
        </div>
      );   
}
