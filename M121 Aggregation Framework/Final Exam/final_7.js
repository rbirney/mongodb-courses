// Problem:

// Using the air_alliances and air_routes collections, find which alliance has the most unique carriers(airlines) operating between the airports JFK and LHR, in either directions.

// Names are distinct, i.e. Delta != Delta Air Lines

// src_airport and dst_airport contain the originating and terminating airport information.

// Choose the best answer:

// SkyTeam, with 4 carriers - INCORRECT
// OneWorld, with 4 carriers - CORRECT
// Star Alliance, with 6 carriers - INCORRECT
// OneWorld, with 8 carriers - INCORRECT

// A pipeline that can be used to get these results is

db.air_routes.aggregate([
  {
    $match: {
      src_airport: { $in: ["LHR", "JFK"] },
      dst_airport: { $in: ["LHR", "JFK"] }
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
    $match: { alliance: { $ne: [] } }
  },
  {
    $addFields: {
      alliance: { $arrayElemAt: ["$alliance.name", 0] }
    }
  },
  {
    $group: {
      _id: "$airline.id",
      alliance: { $first: "$alliance" }
    }
  },
  {
    $sortByCount: "$alliance"
  }
])
