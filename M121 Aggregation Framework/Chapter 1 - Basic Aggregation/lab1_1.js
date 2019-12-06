//imdb.rating is at least 7
//genres does not contain "Crime" or "Horror"
//rated is either "PG" or "G"
//languages contains "English" and "Japanese"

var pipeline = [{$match:{
	$and: [ 
		{ "imdb.rating": { $gte: 7 } }, 
		{ "genres": { $nin: ["Crime", "Horror"] } },
		{ "rated": { $in: ["G", "PG"] } },
		{ $and: [ {"languages": "English"}, {"languages": "Japanese"} ] }
	] 
}}]

// To check documents returned (should be 23)

db.movies.aggregate(pipeline).itcount()

// Load validation script
// Remember to run Mongo shell from folder where file is located

load('validateLab1.js')

// Run validation method

validateLab1(pipeline)

// Answer is 15