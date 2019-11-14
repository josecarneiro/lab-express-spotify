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
    // spotifyApi.setAccessToken(data.body['.env']);
  })
  .catch(error => {
    console.log('Something went wrong when retrieving an access token', error);
  });

// the routes go here:
app.get('/', (req, res, next) => {
  res.render('index');
});


app.get('/artists-data', (req, res, next) => {
  const artistsSearch = req.query.artists_search;
  // const limit = req.query.limit;
  spotifyApi
  .searchArtists(artistsSearch)
  .then(dataObject => {
    const artistsDataResults = dataObject.body.artists.items;
    // console.log(artistsDataResults);
    // console.log(dataObject.body.artists.items[0].id);
    res.render('artists-data', {
      artistsData: artistsDataResults
    });
  })
  .catch(err => {
    console.log('The error while searching artists occurred: ', err);
  })
});

app.get('/albums/:artists_id', (req, res, next) => {
  // console.log(req.params);
  const artistsAlbums = req.params.artists_id;
  // console.log(artistsAlbums);
  spotifyApi
  .getArtistAlbums(artistsAlbums)
  .then(albumDataObject => {
    res.render('albums', {
      albumsData: albumDataObject.body.items
    });
    console.log(albumDataObject.body.items);
  })
  .catch(err => {
    console.log('The error while searching artists occurred: ', err);
  })
});

app.get('/tracks', (req, res, next) => {
  res.render('tracks');
});

app.listen(3000, () =>
  console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊')
);
