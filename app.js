require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');
// require spotify-web-api-node package here:

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

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

app.get('/', (req, res) => {
  res.render('index');
});
app.get('/artist-search', (req, res) => {
  const name = req.query.artist;
  console.log(name);
  spotifyApi
    .searchArtists(name)
    .then(data => {
      // console.log('The received data from the API: ', data.body.artists);
      let loadedData = {
        artist: data.body.artists.items
      };
      res.render('artist-search-results', loadedData);
      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
    })
    .catch(err => console.log('The error while searching artists occurred: ', err));
});

app.get('/albums/:artistId', (req, res, next) => {
  // .getArtistAlbums() code goes here
  let album = req.params.artistId;

  spotifyApi
    .getArtistAlbums(album)
    .then(data => {
      let albumData = {
        al: data.body.items
      };
      console.log('Artist albums', data.body);
      res.render('albums', albumData);
    })
    .catch(err => {
      console.error(err);
    });
});
app.get('/albums/tracks/:id', (req, res) => {
  let track = req.params.id;
  spotifyApi
    .getAlbumTracks(track)
    .then(data => {
      let albumData = {
        tr: data.body.items
      };
      console.log('tracks', data.body);
      res.render('tracks', albumData);
    })
    .catch(err => {
      console.error(err);
    });
});

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
