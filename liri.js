//Require node packages
require("dotenv").config();

var axios = require("axios");

var moment = require('moment');


var Spotify = require("node-spotify-api");

var keys = require("./keys.js");

var spotify = new Spotify(keys.spotify);

//Store user command in variable
var command = process.argv[2];

//Functions
function concert() {
    var artist = process.argv.slice(3).join("");

    var queryUrl= "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=anything";

   axios.get(queryUrl).then(function(response) {
       var results = response.data;
       for (var i = 0; i < results.length; i++) {
           console.log(`Venue Name: ${results[i].venue.name}`);
           console.log(`Venue Location: ${results[i].venue.city}, ${results[i].venue.country} ------Lat: ${results[i].venue.latitute}, Lon: ${results[i].venue.longitude} `);
           console.log(`Date of Event: ${moment(results[i].datetime).format("MM DD YYYY")}\n`);
       }
   })
}

function spotifySong() {
    var song = process.argv.slice(3).join(" ");

    spotify.search({type: 'track', query: song}, function(err, data) {
        if (err) {
            return console.log("Error occured: " + err);
        } 
        console.log(`Artist: ${data.tracks.items[0].artists[0].name}`);
        console.log(`Song Name: ${data.tracks.items[0].name}`);
        console.log(`Preview link: ${data.tracks.items[3].preview_url}`);
        console.log(`Album: ${data.tracks.items[0].album.name}`); 
    });
}


// Switch/Case for command
switch(command) {
    case "concert-this":
        concert();
        break;
    case "spotify-this-song":
        spotifySong();
        break;
    case "movie-this":
        console.log("movie-this");
        break;
    case "do-what-it-says":
        console.log("do-what-it-says");
        break;
    default:
        console.log("Unrecognized command");
}
