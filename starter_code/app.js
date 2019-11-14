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
  .then(data => {
    spotifyApi.setAccessToken(data.body['access_token']);
  })
  .catch(error => {
    console.log('Something went wrong when retrieving an access token', error);
  });

// the routes go here:
app.get('/', (req, res, next) => {
  res.render('index');
});

//search bar
app.get('/artists', (req, res, next) => {

  const searchQuery = req.query.search_query;
  const limit = req.query.limit

  spotifyApi
    .searchArtists(searchQuery)
    .then(data => {
      console.log('The received data from the API: ', data.body.artists.items);
      res.render('artists', {
        artists: data.body.artists.items
      })
    })
    .catch(err => {
      console.log('The error while searching artists occurred: ', err);
    });

  console.log(searchQuery)

});

app.get('/albums', (req, res, next) => {
  const searchQuery = req.query.search_query;
  spotifyApi.getArtistAlbums(searchQuery).then(
    function(data) {
      console.log('Artist albums', data.body);
      res.render('albums' , data.body.items);
    },
    function(err) {
      console.error(err);
    }
  );
 });

app.listen(3000, () =>
  console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊')
);