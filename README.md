# DOTA 2 Match Stats

Simple MEAN App that takes in a Match ID and returns relevant information.

## Setup

### Installing Dependencies

Run the following when in the project root:

````
$ npm install
$ bower install
````

### Running

Running `gulp` in the terminal while in the project root will start the service
running on `http://localhost:3000`

### Missing key.js

A file `key.js` has been purposely ignored, which contains a personal developer 
key. To run yourself, create said file in `server/api`, containing the following
code:

````
var key = <Steam API Key Here>;

module.exports = key;
````
