require("dotenv").config();

const express = require("express");
const hbs = require("hbs");

// require spotify-web-api-node package here:
const SpotifyWebApi = require("spotify-web-api-node");

const app = express();

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

//register my partials
hbs.registerPartials(__dirname + "/views/partials");

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET
});

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
  res.render("index");
});

app.get("/artist", (req, res) => {
  const artistName = req.query.artist_name;

  spotifyApi
    .searchArtists(artistName)
    .then(data => {
      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'

      res.render("artist", {
        artists: data.body.artists.items
      });
    })
    .catch(err => {
      console.log("The error while searching artists occurred: ", err);
    });
});

app.get("/albums/:id", (req, res, next) => {
  let artistID = req.params.id;

  console.log(artistID);

  spotifyApi
    .getArtistAlbums(artistID)

    .then(data => {
      let arrayOfAlbums = data.body.items;
      res.render("albums", {
        albums: arrayOfAlbums
      });
    })
    .catch(err => {
      console.log("The error while searching albuns occurred: ", err);
    });
});

app.get("/tracks/:id", (req, res, next) => {
  let artistID = req.params.id;

  spotifyApi

    .getAlbumTracks(artistID)
    .then(data => {
      let albumTracks = data.body.items;
      console.log("we were successfull", data.body.items);
      res.render("tracks", {
        tracks: albumTracks
      });
      //I AM HERE, NEED TO INTRODUCE TRACKS
    })
    .catch(err => {
      console.log("The error while searching albuns occurred: ", err);
    });
});

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);