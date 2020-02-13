require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:

const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');

app.use(express.static(__dirname + '/public'));

hbs.registerPartials(__dirname + '/views/partials');

// setting the spotify-api goes here:

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });
  
// Retrieve an access token
spotifyApi
.clientCredentialsGrant()
.then(data => spotifyApi.setAccessToken(data.body['access_token']))
.catch(error => console.log('Something went wrong when retrieving an access token', error));

// Our routes go here:
app.get('/', (request, response) => {
    response.render('index');
  });

app.get('/search-artist', (request, response) => {
    const artistName = request.query.artist;
    spotifyApi
    .searchArtists(artistName)
    .then(data => {
        const dataArtist = {
            artistMusic : data.body.artists.items
        }
        response.render('artistMusic', dataArtist);
    })
    .catch(err => console.log('The error while searching artists occurred: ', err));
});

app.get('/albums/:artistId', (request, response) => {
    const artistId = request.params.artistId;
    spotifyApi
    .getArtistAlbums(artistId)
    .then(data => {
        const albumsArtist = {
            albums : data.body.items
        }
        console.log(dataA);
        response.render('albums', albumsArtist);
    })
    .catch(err => console.log('The error while searching artists occurred: ', err));
});

app.get('/tracks/:albumId', (request, response) => {
    const albumId = request.params.albumId;
    console.log(albumId);
    spotifyApi
    .getAlbumTracks(albumId)
    .then(data => {
        const dataAlbum = {
            musicAlbum : data.body.items
        }
        response.render('albums', dataAlbum);
    })
    .catch(err => console.log('The error while searching artists occurred: ', err));
});

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
