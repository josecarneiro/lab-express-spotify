require("dotenv").config();

const express = require("express");
const hbs = require("hbs");

// require spotify-web-api-node package here:
const SpotifyWebApi = require("spotify-web-api-node");

const app = express();

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

hbs.registerPartials(__dirname + "/views/partials");

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then(data => {
    spotifyApi.setAccessToken(data.body["access_token"]);
  })
  .catch(error => {
    console.log("Something went wrong when retrieving an access token", error);
  });

// the routes go here:
app.get("/", (req, res, next) => {
  res.render("index");
});

app.get("/artist", (req, res) => {
  const searchQuery = req.query.search_query;
  spotifyApi
    .searchArtists(searchQuery)
    .then(data => {
      const result = { artists: data.body.artists.items };
      console.log("The received data from the API: ", data.body.artists.items);

      res.render("artists", result);
    })
    .catch(err => {
      console.log("The error while searching artists occurred: ", err);
    });
});

app.get('/albums/:id', (req, res, next) => {
  const id = req.params.id;
  console.log(id)
  spotifyApi.getArtistAlbums(id)
  .then(function(data) {
    const dataAlbum = data.body.items;
    //console.log('Artist albums', data);
    res.render('albums', {dataAlbum} )
  }, function(err) {
    console.error(err);
  });
});

app.get('/tracks/:id', (req, res, next) => {
  const id = req.params.id;
  spotifyApi.getAlbumTracks(id)
  .then(function(data) {
    const dataTrack = data.body.items;
    res.render('tracks', {dataTrack})
    console.log("stuff", data.body)
    //console.log(data.body.items);
  }, function(err) {
    console.log('Something went wrong!', err);
  });
 
});


app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
