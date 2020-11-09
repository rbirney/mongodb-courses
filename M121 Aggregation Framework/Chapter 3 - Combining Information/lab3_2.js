/*
Let's use our increasing knowledge of the Aggregation Framework to explore our movies collection in more detail. We'd like to calculate how many movies every cast member has been in and get an average imdb.rating for each cast member.

What is the name, number of movies, and average rating (truncated to one decimal) for the cast member that has been in the most number of movies with English as an available language?

Provide the input in the following order and format

{ "_id": "First Last", "numFilms": 1, "average": 1.1 }
*/

// match English language
// unwind cast
// group by cast member and count documents
// get average imdb.rating
// project _id as First and Last name, numFilms and average
// show only first result (most movies) using sort and limit

db.movies.aggregate([
  {
    $match: {
      "languages": "English"
    }
  },
  {
    $unwind: "$cast"
  },
  {
    $group: {
      "_id": "$cast",
      average: { $avg: "$imdb.rating" },
      numFilms: { $sum: 1 }
    }
  },
  {
    $project: {
      cast: 1,
      numFilms: 1,
      average: { $divide: [ { $trunc: { $multiply: ["$average", 10] } }, 10 ] }
    }
  },
  { $sort: { "numFilms": -1 } },
  { $limit: 1 }
])
