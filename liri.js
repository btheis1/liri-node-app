require("dotenv").config();

var moment = require('moment');
moment().format();

var Spotify = require("node-spotify-api");

var keys = require("./keys.js");

var spotify = new Spotify(keys.spotify);

console.log(spotify);
