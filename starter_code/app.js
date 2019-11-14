require("dotenv").config();

const express = require("express");
const hbs = require("hbs");
const Spotify = require("spotify-web-api-js");
const spotify = new Spotify();
const SpotifyWebApi = require("spotify-web-api-node");

// require spotify-web-api-node package here:

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
app.get("/", (req, res) => {
  res.render(__dirname + "/views/index");
});

app.get("/artists", (req, res) => {
  const searchQuery = req.query.search_query;
  console.log(searchQuery);
  spotifyApi
    .searchArtists(searchQuery)
    .then(data => {
      const artistsData = data.body.artists.items;
      res.render(__dirname + "/views/artists", {
        artistsData
      });
      //console.log("The received data from the API: ", artistsData);
      // console.log();
    })
    .catch(err => {
      console.log("The error while searching artists occurred: ", err);
    });
});

app.get("/album/:post_id", (req, res, next) => {
  const spotifyId = spotifyApi.getArtistAlbums(req.params.post_id);
  spotifyId.then(
    function(data) {
      const spotifyAlbum = data.body.items;
      //console.log(spotifyAlbum);
      res.render("album", { spotifyAlbum });
    },
    function(err) {
      console.error(err);
    }
  );
});

/* app.post("/tracks/:albumID", (req, res, next) => {
  let albumId = req.params.albumID;
  spotifyApi.getAlbumTracks(albumId, { limit: 5, offset: 1 }).then(
    function(data) {
      const dataTracks = {
        albums: data.body.items
      };
      console.log(dataTracks);
      res.render("tracks", dataTracks);
    },
    function(err) {
      console.log("Something went wrong!", err);
    }
  );
}); */

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
