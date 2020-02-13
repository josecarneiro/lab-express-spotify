/* - We are going to apply our knowledge of GET method and when and why to use `req.query` and `req.params`.
- We are going to practice how to **read the documentation** (of this npm package particularly) and how to use the examples provided by the docs to successfully finish all the iterations.
*/
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

app.get('/artist', (req, res) => {
  const searchArtist = req.query.artist;

  spotifyApi
    .searchArtists(searchArtist)
    .then(data => {
      const artistObject = data.body.artists.items;
      console.log(artistObject);

      res.render('artists', { artistObject });
    })
    .catch(err => {
      console.log('The error while searching artists occurred: ', err);
    });
});

app.get('/albums/:artistId', (req, res, next) => {
  // .getArtistAlbums() code goes here
});

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
