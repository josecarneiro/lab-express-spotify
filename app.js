require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
var SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('views', __dirname + '/views');
app.set('view engine', 'hbs');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:
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

app.get('/', (req, res) => res.render('index'));

app.get('/search', (req, res) => {
	console.log(req.query.artist);
	const artist = req.query.artist;
	spotifyApi
		.searchArtists(artist)
		.then(data => {
			const artists = {
				listOfArtist: data.body.artists.items
			};
			// console.log(data.body.artists.items[0].images);
			// ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
			res.render('artistsearchresult', artists);
		})
		.catch(err => console.log('The error while searching artists occurred: ', err));
});

app.get('/albums/:artistId', (req, res, next) => {
	// .getArtistAlbums() code goes here
	const id = req.params.artistId;
	spotifyApi
		.getArtistAlbums(id)
		.then(data => {
			const albums = {
				listOfAlbums: data.body.items
			};
			// ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
			// console.log(albums);
			res.render('albums', albums);
		})
		.catch(err => console.log('The error while searching albums occurred: ', err));
});

app.get('/tracks/:artistId', (req, res, next) => {
	const id = req.params.artistId;
	spotifyApi
		.getAlbumTracks(id)
		.then(data => {
			const tracks = {
				listOfTracks: data.body.items
			};
			// ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
			console.log(data.body.items);
			res.render('tracks', tracks);
		})
		.catch(err => console.log('The error while searching albums occurred: ', err));
});

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
