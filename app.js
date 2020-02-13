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

spotifyApi
  .clientCredentialsGrant()
  .then(data => spotifyApi.setAccessToken(data.body['access_token']))
  .catch(error => console.log('Something went wrong when retrieving an access token', error));

// Our routes go here:

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/artist-search', (req, res) => {
  const artist = req.query.artist;
  spotifyApi
    .searchArtists(artist)
    .then(data => {
      const result = data.body.artists.items;
      //console.log(result);
      res.render('artist-search-results', { result });
    })
    .catch(err => console.log('The error while searching artists occurred: ', err));
});

app.get('/albums/:id', (req, res) => {
  const id = req.params.id;
  spotifyApi
    .getArtistAlbums(id)
    .then(data => {
      const result = data.body.items;
      //const images = data.body.items.images
      //console.log(data.body.items.images);
      res.render('albums', { result });
    })
    .catch(err => console.log('The error while searching artists occurred: ', err));
});

app.get('/tracks/:id', (req, res) => {
  const id = req.params.id;
  spotifyApi
    .getAlbumTracks(id)
    .then(data => {
      const result = data.body.items;
      //const images = data.body.items.images
      //console.log(data.body);
      res.render('tracks', { result });
    })
    .catch(err => console.log('The error while searching artists occurred: ', err));
});

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
