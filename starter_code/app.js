require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
//const path = require('path');
const SpotifyWebApi = require('spotify-web-api-node');
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET
});

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
hbs.registerPartials(__dirname + "/views/partials");
app.use(express.static(__dirname + '/public'));
//app.use(express.static(path.join(__dirname, 'public')));


// setting the spotify-api goes here:
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
  res.render('index')
});

app.get('/artist', (req, res, next) => {
  spotifyApi.searchArtists(req.query.artist)
    .then(data => {  
      const artist = data.body.artists.items
      //console.log(data.body.artists.items)
      res.render('artist', {
        artist
      })  
    }) 
    .catch(error => {
      console.log("Error searching for artist")
    })
})

app.get("/album/:post_id", (req, res, next) => {
  spotifyApi.getArtistAlbums(req.params.post_id)
    .then(data => {  
      console.log(data.body.items)
      const albums = data.body.items
      res.render("album", {
        albums
      })  
    }) 
    .catch(error => {
      console.log("Error searching for album")
    })
})

app.get("/album/:post_id/:album_id", (req, res, next) => {
  spotifyApi.getAlbumTracks(req.params.album_id)
  .then(data => {
      const spotifyTracks = data.body.items;
      console.log(spotifyTracks);
      res.render("tracks", { spotifyTracks });
    })
    .catch(error => {
      console.log("Error searching for tracks")
    })

 });

app.listen(3000, () =>
  console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊')
);