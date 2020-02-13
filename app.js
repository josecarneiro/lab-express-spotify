const dotenv = require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

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

app.get('/artist-search', (request, response) => {
  const artist = request.query.artist;
  spotifyApi
    .searchArtists(artist)
    .then(data => {
      const artists = data.body.artists.items;
      response.render('artist-search-results', { artists });
    })
    .catch(err => console.log('The error while searching artists occurred: ', err));
});

app.get('/albums/:id', (request, response, next) => {
  const album = request.params.id;
  console.log(album);
  spotifyApi
    .getArtistAlbums(album)
    .then(data => {
      const albums = data.body.items;

      response.render('albums', { albums });
    })
    .catch(err => console.log('The error while searching artists occurred: ', err));
});

app.get('/tracks/:albumId', (request, response, next) => {
  const track = request.params.albumId;
  console.log(track);
  spotifyApi
    .getAlbumTracks(track)
    .then(data => {
      const tracks = data.body.items;

      response.render('tracks', { tracks });
    })
    .catch(err => console.log('The error while searching artists occurred: ', err));
});
app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
