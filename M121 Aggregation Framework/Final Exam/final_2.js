// Problem:

// Consider the following collection:

db.collection.find()
{
  "a": [1, 34, 13]
}

// The following pipelines are executed on top of this collection, using a mixed set of different expression accross the different stages:

// Pipeline 1
db.collection.aggregate([
  {"$match": { "a" : {"$sum": 1}  }},
  {"$project": { "_id" : {"$addToSet": "$a"}  }},
  {"$group": { "_id" : "", "max_a": {"$max": "$_id"}  }}
])

// Pipeline 2
db.collection.aggregate([
    {"$project": { "a_divided" : {"$divide": ["$a", 1]}  }}
])

// Pipeline 3
db.collection.aggregate([
    {"$project": {"a": {"$max": "$a"}}},
    {"$group": {"_id": "$$ROOT._id", "all_as": {"$sum": "$a"}}}
])

// Given these pipelines, which of the following statements are correct?
// Check all answers that apply:

// INCORRECT
// Pipeline 1 will fail because $max can not operator on _id field

// INCORRECT
// Pipeline 2 is incorrect since $divide cannot operate over field expressions

// CORRECT
// Pipeline 2 fails because the $divide operator only supports numeric types

// CORRECT
// Pipeline 1 is incorrect because you cannot use an accumulator expression in a $match stage.

// CORRECT
// Pipeline 3 is correct and will execute with no error
