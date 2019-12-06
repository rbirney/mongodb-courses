// Q4

db.trips.find({$and: [{tripduration: null}, {tripduration: {$exists: true}}]}).count()

// Q6

db.movies.find({
	"cast": {$in: ["Jack Nicholson", "John Huston"]},
	"viewerRating": {$gt: 7},
	"mpaaRating": "R"
}).count()
	
	