//imdb.rating is at least 7
//genres does not contain "Crime" or "Horror"
//rated is either "PG" or "G"
//languages contains "English" and "Japanese"

//db.movies.aggregate(pipeline).itcount()

var pipeline = [{$match:{
	$and: [ 
		{ "imdb.rating": { $gte: 7 } }, 
		{ "genres": { $nin: ["Crime", "Horror"] } },
		{ "rated": { $in: ["G", "PG"] } },
		{ $and: [ {"languages": "English"}, {"languages": "Japanese"} ] }
	] 
}}]


