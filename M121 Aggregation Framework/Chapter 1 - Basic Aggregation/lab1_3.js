//Our movies dataset has a lot of different documents, some with more convoluted titles than others. If we'd like to analyze our collection to find movie titles that are composed of only one word, we could fetch all the movies in the dataset and do some processing in a client application, but the Aggregation Framework allows us to do this on the server!

//Using the Aggregation Framework, find a count of the number of movies that have a title composed of one word. To clarify, "Cinderella" and "3-25" should count, where as "Cast Away" would not.

//Make sure you look into the $split String expression and the $size Array expression

//To get the count, you can append itcount() to the end of your pipeline

//db.movies.aggregate([...]).itcount()

// my answer (which worked)

db.movies.aggregate([
	{ $project : { 
		number_of_words: { $size: { $split: ["$title", " "] } }
	}},
	{ $match: {
		number_of_words: { $lte: 1 }
	}}
]).itcount()

// their answer

db.movies.aggregate([
  {
    $match: {
      title: {
        $type: "string"
      }
    }
  },
  {
    $project: {
      title: { $split: ["$title", " "] },
      _id: 0
    }
  },
  {
    $match: {
      title: { $size: 1 }
    }
  }
]).itcount()

// answer is 8068