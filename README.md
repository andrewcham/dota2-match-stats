# DOTA 2 Match Stats

Simple MEAN App that takes in a Match ID and returns relevant information.

## Setup

A file `key.js` has been purposely ignored, which contains a personal developer 
key. To run yourself, create said file in `server/api`, containing the following
code:

````
var key = <Steam API Key Here>;

module.exports = key;
````
