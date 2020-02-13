require('dotenv').config();

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

//Artists
app.get('/artist-search', (request, response) => {
  spotifyApi
    .searchArtists(request.query.artist)
    .then(data => {
      response.render('artist-search-results.hbs', { artists: data.body.artists.items });
      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
    })
    .catch(err => console.log('The error while searching artists occurred: ', err));
});

//Album
app.get('/albums/:id', (req, res) => {
  spotifyApi
    .getArtistAlbums(req.params.id)
    .then(data => {
      console.log('Received from the api:', data.body);
      res.render('albums.hbs', { albums: data.body.items });
    })
    .catch(error => console.log(error));
});

//Tracks
app.get('/tracks/:albumId', (req, res) => {
  spotifyApi
    .getAlbumTracks(req.params.albumId)
    .then(data => {
      res.render('tracks.hbs', { tracks: data.body.items });
    })
    .catch(error => console.log(error));
});

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
