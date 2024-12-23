const axios = require('axios');

const clientID = process.env.SPOTIFY_CLIENT_ID;
const clientSecret = process.env.SPOTIFY_SECRET_CLIENT;

const getToken = async (req, res) => {
    const params = new URLSearchParams();
    params.append('grant_type', 'client_credentials');
    params.append('client_id', clientID);
    params.append('client_secret', clientSecret);

    const response = await axios.post('https://accounts.spotify.com/api/token', params);

    res.json(response.data);
}

const getArtist = async (req, res) => {
    try {
        let artist = req.query.artist;
        const token = req.query.spotify_token;
        
        artist = artist.replace(' ', '%20');
        const response = await axios.get(`https://api.spotify.com/v1/search?q=${artist}&type=artist&limit=5`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        let artistArray = [];
        const artists = response.data.artists.items;
        artists.forEach(element => {
            const {id, name} = element;
            artistArray.push({id, name});
        });
        res.json(artistArray);
    } catch (error) {
        console.error(error.response.headers)
        res.status(error.status).json({ error: 'Error obteniendo artista: '+error.data });
    }
    
}

const getSong = async (req, res) => {

    try {
        const idArtist = req.query.id_artist;
        const token = req.query.spotify_token;

        const response = await axios.get(`https://api.spotify.com/v1/artists/${idArtist}/top-tracks`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        let songsArray = [];
        const songs = response.data.tracks;
        songs.forEach(element => {
            const {id, name} = element;
            songsArray.push({id, name});
        });
        res.json(songsArray); 
    } catch (error) {
        console.error(error.response.headers)
        res.status(error.status).json({ error: 'Error obteniendo canciones: '+error.data });
    }

       
}



module.exports = {getToken, getArtist, getSong}