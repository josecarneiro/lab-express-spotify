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
app.get('/', (request, response) => response.render('home'));

app.get('/search', (request, response) => {
  spotifyApi
    .searchArtists(request.query.spotifySearch) //spotifySearch comes form input name
    .then(data => {
      // console.log('The received data from the API: ', data.body.artists);
      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
      const artists = {
        listOfArtists: data.body.artists.items
      };
      // console.log('pair', data.body.artists.items[0].images);
      response.render('artist-search-results', artists);
    })
    .catch(err => console.log('The error while searching artists occurred: ', err));
});

app.get('/albums/:id', (request, response) => {
  const idId = request.params.id;
  //console.log(idId);
  spotifyApi
    .getArtistAlbums(idId)
    .then(function(data) {
      const albums = {
        listOfAlbums: data.body.items
      };
      response.render('albums', albums);
    })
    .catch(err => console.log('The error while searching albums occurred: ', err));
});

app.get('/tracks/:id', (request, response) => {
  const idId = request.params.id;
  spotifyApi
    .getAlbumTracks(idId)
    .then(function(data) {
      const tracks = {
        listOfTracks: data.body.items
      };
      response.render('tracks', tracks);
    })
    .catch(err => console.log('The error while searching tracks occurred: ', err));
});

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
