require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
const path = require('path');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');

app.use(express.static(__dirname + '/public'));
hbs.registerPartials(path.join(__dirname, 'views/partials'));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET
});

// Our routes go here:
app.get('/', (request, response) => {
  spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));

  response.render('index');
});

app.get('/artist-search', (request, response) => {
  const term = request.query.term;

  spotifyApi
    .searchArtists(term)
    .then(data => {
      const artists = {
        listOfartists: data.body.artists.items
      };

      //console.log('The received data from the API: ', data.body.artists.items[0].images);

      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
      response.render('artistsearch', artists);
    })
    .catch(err => console.log('The error while searching artists occurred: ', err));
});

app.get('/albums/:id', (request, response) => {
  const id = request.params.id;

  spotifyApi
    .getArtistAlbums(id)
    .then(function(data) {
      //console.log(data.body.items);

      const albums = {
        listOfAlbums: data.body.items
      };

      response.render('albums', albums);
    })
    .catch(err => console.log('The error while searching albuns occurred: ', err));
});

app.get('/tracks/:id', (request, response) => {
  const id = request.params.id;

  spotifyApi
    .getAlbumTracks(id)
    .then(function(data) {
      console.log(data.body.items);

      const tracks = {
        listOftracks: data.body.items
      };

      response.render('tracks', tracks);
    })
    .catch(err => console.log('The error while searching tracks occurred: ', err));
});

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
