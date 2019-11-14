require("dotenv").config();

const express = require("express");
const hbs = require("hbs");

// require spotify-web-api-node package here:
const SpotifyWebApi = require("spotify-web-api-node");

const app = express();
hbs.registerPartials(__dirname + "/views/partials");

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET
});

console.log(process.env);

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
  const artistQuery = `${req.query.search_query}`
  spotifyApi
    .searchArtists(artistQuery)
    .then(data => {
      const dataArtists = data.body.artists.items;
      //console.log("artists----", dataArtists);
      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
      res.render("artists", {
        dataArtists
      });
    })
    .catch(err => {
      console.log("The error while searching artists occurred: ", err);
    });
});

app.get("/albums/:artistId", (req, res, next) => {
  // .getArtistAlbums() code goes here
  const albumsParams = `${req.params.artistId}`
  res.send(req.params);
  spotifyApi
    .getArtistAlbums(albumsParams)
    .then(function (data) {
      const dataAlbums = data.body.albums;
      console.log("albums----", dataAlbums)
      return dataAlbums.map(function (a) {
        return a.id;
      });
    })
    .then(function (albums) {
      return spotifyApi.getAlbums(albums);
    })
    .then(function (data) {
      console.log(data.body);
    });
    
});

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);