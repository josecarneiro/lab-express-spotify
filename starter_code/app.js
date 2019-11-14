require("dotenv").config();

const express = require("express");
const hbs = require("hbs");
const SpotifyWebApi = require("spotify-web-api-node");

hbs.registerPartials(__dirname + "/views/partials");

// require spotify-web-api-node package here:

var Spotify = require("spotify-web-api-js");
var s = new Spotify();

const app = express();

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

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

app.get("/artists", (req, res, next) => {
  const artist = req.query.search;
  // console.log(artist);
  spotifyApi
    .searchArtists(artist)
    .then(data => {
      const artistReq = data.body.artists.items;
      // console.log(artistReq[0].images[0]);
      
      res.render("artists", { artistReq });
      // console.log("The received data from the API: ", data.body.artists);
      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
    })
    .catch(err => {
      console.log("The error while searching artists occurred: ", err);
    });
});


app.get('/albums/:artistId', (req, res, next) => {
  spotifyApi
    getArtistAlbums(req.params.id)
    .then(function(data) {
      console.log('Artist albums', data);
      res.render("albums")
    }, function(err) {
      console.error(err);
    });
});




app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
