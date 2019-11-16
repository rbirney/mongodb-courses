// Comparison operators quiz

db.movieDetails.find({
	"writers": { $in: ["Ethan Coen", "Joel Coen"] }
}).count()

// Element operators quiz

db.data.find({
	atmosphericPressureChange: {$exists: false}
}).count()

// Logical operators quiz

db.shipwrecks.find({
	$or: [ { "watlev": "always dry" }, { depth: 0 } ]
}).count()

// Array operators quiz all

db.data.find({
	sections: { $all: [ "AG1", "MD1", "OA1" ] }
}).count()

// Array operators quiz size

db.data.find({
	sections: { $size: 2 }
}).count()

// Array operators elem match

db.surveys.find({
	results: {$elemMatch: {product: "abc", score: 7 }}
}).count()

// Challenge problem

db.scores.find({
	results: { $elemMatch: { $gte: 70, $lt: 80 } } 
}).count()