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

app.get("/artists", (req, res, next) => {
  spotifyApi
    .searchArtists(req.query.search_query)
    .then(data => {
      const searchResult = { artists: data.body.artists.items };
      console.log("The received data from the API: ", searchResult);
      res.render("artists", searchResult);
    })
    .catch(error => {
      console.log("The error while searching artists occurred: ", error);
    });
});

app.get("/albums/:artistsId", (req, res, next) => {
  console.log(req.params.artistsId);
  spotifyApi
    .getArtistAlbums(req.params.artistsId)
    .then(albums => {
      console.log("The received data from the API: ", albums.items);
      res.render("albums", { albums });
    })
    .catch(error => {
      console.log("The error while searching artists albums occurred: ", error);
    });
});

//////////////////////////////////////////////////
app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
