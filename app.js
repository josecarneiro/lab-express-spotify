require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
const app = express();

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');

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
app.get('/', (request, response) => response.render('index'));


app.get('/artist-search', (request, response) => {

  const term = request.query.term;

  spotifyApi
  .searchArtists(term)
  .then(data => {
    const artist = data.body.artists.items
    console.log('The received data from the API: ', data.body.artists.items);
    response.render('artist-search-results', { artist })
  })
  .catch(err => console.log('The error while searching artists occurred: ', err));

});

app.get('/albums/:id', (request, response) => {

  const album = request.params.id

spotifyApi.getArtistAlbums(album)
  .then(function(data) {
    console.log('Artist albums', data.body);
  }, function(err) {
    console.error(err);
  });

});



app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
