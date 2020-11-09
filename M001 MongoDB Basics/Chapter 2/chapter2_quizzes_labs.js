// Scalar fields quiz

db.movieDetails.find({
	"awards.wins": 2,
	"awards.nominations": 2
}).count()

// Lab 2.3 Queries on scalar fields

db.movieDetails.find({
	"rated": "PG",
	"awards.nominations": 10
}).count()

// Array fields quiz

db.movieDetails.find({
	"writers": ["Ethan Coen", "Joel Coen"]
}).count()

// Lab 2.4 Queries on array fields, part 1

db.movieDetails.find({
	"genres": "Family"
}).count()

// Lab 2.5 Queries on array fields, part 2

db.movieDetails.find({
	"genres.1": "Western"
}).count()