// Which alliance from air_alliances flies the most routes with either a Boeing 747 or an Airbus A380 (abbreviated 747 and 380 in air_routes)?

db.air_routes.aggregate([
  {
    $match: {
      airplane: /747|380/
    }
  },
  {
    $lookup: {
      from: "air_alliances",
      foreignField: "airlines",
      localField: "airline.name",
      as: "alliance"
    }
  },
  {
    $unwind: "$alliance"
  },
  {
    $group: {
      _id: "$alliance.name",
      count: { $sum: 1 }
    }
  },
  {
    $sort: { count: -1 }
  }
])

// We begin by aggregating over our air_routes collection to allow for filtering of documents containing the string "747" or "380". If we started from air_alliances we would have to do this after the lookup!

{
  $match: {
    airplane: /747|380/
  }
},

// Next, we use the $lookup stage to match documents from air_alliances on the value of their airlines field against the current document's airline.name field

{
  $lookup: {
    from: "air_alliances",
    foreignField: "airlines",
    localField: "airline.name",
    as: "alliance"
  }
},

// We then use $unwind on the alliance field we created in $lookup, creating a document with each entry in alliance

{
  $unwind: "$alliance"
},

// We end with a $group and $sort stage, grouping on the name of the alliance and counting how many times it appeared

{
  $group: {
    _id: "$alliance.name",
    count: { $sum: 1 }
  }
},
{
  $sort: { count: -1 }
}

// This produces the following output

{ "_id" : "SkyTeam", "count" : 16 }
{ "_id" : "Star Alliance", "count" : 11 }
{ "_id" : "OneWorld", "count" : 11 }
