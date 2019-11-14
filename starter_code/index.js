require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET
});

spotifyApi
  .clientCredentialsGrant()
  .then(data => {
    spotifyApi.setAccessToken(data.body['access_token']);
  })
  .catch(error => {
    console.log('Something went wrong when retrieving an access token', error);
  });

hbs.registerPartials(__dirname + '/views/partials');

app.get('/', (req, res, next) => {
  res.render('index.hbs');
});

app.get('/artists', (req, res, next) => {
  spotifyApi
  .searchArtists(req.query.search_query)
  .then(data => {
    const artists = data.body.artists.items;
      console.log('The received data from the API: ', artists);
      res.render('artists', {artists})
    })
    .catch(err => {
      console.log('The error while searching artists occurred: ', err);
    })
});

app.get('/albums/:id', (req, res, next) => {
  spotifyApi
  .getArtistAlbums(req.params.id)
  .then(data => {
    const albums = {albums : data.body}
    res.render('albums', {
      albums
    });
  })
  .catch(error => {
    console.log(error);
    next(error);
  });
});

app.listen(3000, () =>
  console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊')
);