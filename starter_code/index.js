require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

hbs.registerPartials(__dirname + '/views/partials');

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
  let artistID = req.params.id
  spotifyApi
  .getArtistAlbums(artistID)
  .then(data => {
    let albums = data.body.items
    res.render("albums", {
      albums: albums
    });
  })
  .catch(error => {
    console.log(error);
    next(error);
  });
});

app.get("/tracks/:id", (req, res, next) => {
  let artistID = req.params.id;
  spotifyApi
    .getAlbumTracks(artistID)
    .then(data => {
      let albumTracks = data.body.items;
      res.render("tracks", { tracks: albumTracks });
    })
    .catch(err => {
      console.log("The error while searching albuns occurred: ", err);
    });
});


app.listen(3000, () =>
  console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊')
);