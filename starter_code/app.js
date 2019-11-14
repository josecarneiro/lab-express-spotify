require('dotenv').config();
// require('spotify-web-api-node');
const express = require('express');
const hbs = require('hbs');
hbs.registerPartials(__dirname + '/views/partials');

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
  .then(data => {
    spotifyApi.setAccessToken(data.body['access_token']);
  })
  .catch(error => {
    console.log('Something went wrong when retrieving an access token', error);
  });

// the routes go here:

app.get('/', (req, res) => {
  res.render(__dirname + '/views/');
});

app.get('/artists', (req, res) => {
  const searchItem = req.query.search_query;
  spotifyApi
    .searchArtists(searchItem)
    .then(data => {
      console.log('\n\n\nThe received data from the API: ', data.body.artists);
      res.render('result', { artists: data.body.artists.items });
    })
    .catch(err => {
      console.log('The error while searching artists occurred: ', err);
    });
});

app.get('/albums', (req, res) => {
  const searchItem = req.query.search_query;
  spotifyApi.getArtistAlbums(searchItem).then(
    data => {
      console.log('Albums information', data.body.items);
      res.render('seeAlbums', { albums: data.body.items });
    },
    function(err) {
      console.error(err);
    }
  );
});

// app.get('/view_tracks/:id', (req, res) => {
//   const searchItem = req.params.id;
//   spotifyApi.searchTracks(searchItem).then(
//     data => {
//       console.log('tracks: ', data);
//       res.render('view_tracks', { tracks: data });
//     },
//     function(err) {
//       console.error(err);
//     }
//   );
// });

app.listen(3000, () =>
  console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊')
);
