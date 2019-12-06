// Let's find how many movies in our movies collection are a "labor of love", where the same person appears in cast, directors, and writers

db.movies.aggregate([
  {
    $match: {
      cast: { $elemMatch: { $exists: true } },
      directors: { $elemMatch: { $exists: true } },
      writers: { $elemMatch: { $exists: true } }
    }
  },
  {
    $project: {
      _id: 0,
      cast: 1,
      directors: 1,
      writers: {
        $map: {
          input: "$writers",
          as: "writer",
          in: {
            $arrayElemAt: [
              {
                $split: ["$$writer", " ("]
              },
              0
            ]
          }
        }
      }
    }
  },
  {
    $project: {
      labor_of_love: {
        $gt: [
          { $size: { $setIntersection: ["$cast", "$directors", "$writers"] } },
          0
        ]
      }
    }
  },
  {
    $match: { labor_of_love: true }
  },
  {
    $count: "labors of love"
  }
])

// Explanation

/*
With our first $match stage, we filter out documents that are not an array or have an empty array for the fields we are interested in.

{
  $match: {
    cast: { $elemMatch: { $exists: true } },
    directors: { $elemMatch: { $exists: true } },
    writers: { $elemMatch: { $exists: true } }
  }
},

Next is a $project stage, removing the _id field and retaining both the directors and cast fields. We replace the existing writers field with a new computed value, cleaning up the strings within writers

  {
    $project: {
      _id: 0,
      cast: 1,
      directors: 1,
      writers: {
          $map: {
            input: "$writers",
            as: "writer",
            in: {
              $arrayElemAt: [
                {
                  $split: ["$$writer", " ("]
                },
                0
              ]
            }
          }
        }
      }
    }
  }
},

*** More about $map ***

Thankfully there is a powerful expression to help us, $map. $map lets us iterate over an array, element by element, performing some transformation on each element. The result of that transformation will be returned in the same place as the original element.

Within $map, the argument to input can be any expression as long as it resolves to an array. The argument to 'as' is the name of the variable we want to use to refer to each element of the array when performing whatever logic we want. The field as is optional, and if omitted each element must be referred to as $$this:: The argument to 'in' is the expression that is applied to each element of the input array, referenced with the variable name specified in as, and prepending two dollar signs.

in is where the work is performed. Here, we use the $arrayElemAt expression, which takes two arguments, the array and the index of the element we want. We use the $split expression, splitting the values on " (".

If the string did not contain the pattern specified, the only modification is it is wrapped in an array, so $arrayElemAt will always work


*** Back to explanation ***

We use another $project stage to computer a new field called labor_of_love that ensures the intersection of cast, writers, and our newly cleaned directors is greater than 0. This definitely means that at least one element in each array is identical! $gt will return true or false.

{
  $project: {
    labor_of_love: {
      $gt: [
        { $size: { $setIntersection: ["$cast", "$directors", "$writers"] } },
        0
      ]
    }
  }
},

Lastly, we follow with a $match stage, only allowing documents through where labor_of_love is true. In our example we use a $match stage, but itcount() works too.

{
  $match: { labor_of_love: true }
},
{
  $count: "labors of love"
}

// or

  {
    $match: { labor_of_love: true }
  }
]).itcount()

This produces 1597, as expected.
*/
