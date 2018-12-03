//Require node packages
require("dotenv").config();

var axios = require("axios");

var moment = require('moment');


var Spotify = require("node-spotify-api");

var keys = require("./keys.js");

var spotify = new Spotify(keys.spotify);

var fs = require("fs");

//Store user command in variable
var command = process.argv[2];

//Functions
function concert(artist) {

    var queryUrl= "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=anything";

   axios.get(queryUrl).then(function(response) {
       var results = response.data;
    
       for (var i = 0; i < results.length; i++) {
           console.log(`Venue Name: ${results[i].venue.name}`);
           console.log(`Venue Location: ${results[i].venue.city}, ${results[i].venue.country} ------Lat: ${results[i].venue.latitute}, Lon: ${results[i].venue.longitude} `);
           console.log(`Date of Event: ${moment(results[i].datetime).format("MM DD YYYY")}\n`);
       }
   });
}

function spotifySong(song) {
    
    if (song) {
        spotify.search({type: 'track', query: song}, function(err, data) {
            if (err) {
                return console.log("Error occured: " + err);
            } 
            console.log(`Artist: ${data.tracks.items[0].artists[0].name}`);
            console.log(`Song Name: ${data.tracks.items[0].name}`);
            console.log(`Preview link: ${data.tracks.items[3].preview_url}`);
            console.log(`Album: ${data.tracks.items[0].album.name}`); 
        });

    } else {
        console.log(`Artist: Ace of Base`);
        console.log(`Song Name: The Sign`);
        console.log(`Preview link: https://p.scdn.co/mp3-preview/4c463359f67dd3546db7294d236dd0ae991882ff?cid=942dabaa12b7443e8b71e746966e31d6`);
        console.log(`Album: The Sign (US)`);
    }
}

function movie(movieName) {
    
    if (!movieName) {
        movieName = "Mr+Nobody";
    }
    var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";

    axios.get(queryUrl).then(function(response){
        console.log(`Title: ${response.data.Title}`);
        console.log(`Year: ${response.data.Year}`);
        console.log(`IMDB Rating: ${response.data.Ratings[0].Value}`);
        console.log(`Rotten Tomatoes Rating: ${response.data.Ratings[1].Value}`);
        console.log(`Country: ${response.data.Country}`)
        console.log(`Language: ${response.data.Language}`);
        console.log(`Plot: ${response.data.Plot}`);
        console.log(`Actors: ${response.data.Actors}`);
    });
}

function doWhat() {
    fs.readFile("random.txt", "utf8", function(error, data) {
        if (error) {
            return console.log(error);
        }

        var randomCommand = data.split(",");
        var action = randomCommand[0];
        var data = randomCommand[1];
        data = data.replace(/"/g,"");
        
       switch(action) {
           case "spotify-this-song":
                spotifySong(data);
                break;
            case "concert-this":
                concert(data);
                break;
            case "movie-this":
                movie(data);
                break;
            default:
                console.log("Error");
       }
    
    });
}


// Switch/Case for command
switch(command) {
    case "concert-this":
        concert(process.argv.slice(3).join(""));
        break;
    case "spotify-this-song":
        spotifySong(process.argv.slice(3).join(" "));
        break;
    case "movie-this":
        movie(process.argv.slice(3).join("+"));
        break;
    case "do-what-it-says":
        doWhat();
        break;
    default:
        console.log("Unrecognized command");
}
