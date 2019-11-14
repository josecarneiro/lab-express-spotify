require('dotenv').config();



const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');


const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

hbs.registerPartials(__dirname + "/views/partials");

// setting the spotify-api goes here:
//necessary requirements to get information from spotify
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

// the routes go here:
app.get('/', (req, res, next) => {
  res.render('index');
});

app.get('/artist', (req, res, next) => {
  spotifyApi
  .searchArtists(req.query.search_query)
  .then(data => {
    const artistsObject = data.body.artists.items
    res.render('artist', {
      artistsObject
    });
  }).catch(error => {
    next(error);
  });

});


app.get('/albums/:id', (req, res, next) => {  
  spotifyApi
  .getArtistAlbums(req.params.id)
  .then(
    function(data) {
      const albums = {albums: data.body}
      // console.log('albums',data.body.name);
      res.render('albums', {
        albums
      });
    }).catch(error => {
        next(error);
      });
});


app.listen(3000, () =>
  console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊')
);