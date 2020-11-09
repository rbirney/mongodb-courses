//Problem:

//Now that you have been introduced to $graphLookup, let's use it to solve an interesting need. You are working for a travel agency and would like to find routes for a client! For this exercise, we'll be using the air_airlines, air_alliances, and air_routes collections in the aggregations database.

//The air_airlines collection will use the following schema:

{
    "_id" : ObjectId("56e9b497732b6122f8790280"),
    "airline" : 4,
    "name" : "2 Sqn No 1 Elementary Flying Training School",
    "alias" : "",
    "iata" : "WYT",
    "icao" : "",
    "active" : "N",
    "country" : "United Kingdom",
    "base" : "HGH"
}

//The air_routes collection will use this schema:

{
    "_id" : ObjectId("56e9b39b732b6122f877fa31"),
    "airline" : {
            "id" : 410,
            "name" : "Aerocondor",
            "alias" : "2B",
            "iata" : "ARD"
    },
    "src_airport" : "CEK",
    "dst_airport" : "KZN",
    "codeshare" : "",
    "stops" : 0,
    "airplane" : "CR2"
}

//Finally, the air_alliances collection will show the airlines that are in each alliance, with this schema:

{
    "_id" : ObjectId("581288b9f374076da2e36fe5"),
    "name" : "Star Alliance",
    "airlines" : [
            "Air Canada",
            "Adria Airways",
            "Avianca",
            "Scandinavian Airlines",
            "All Nippon Airways",
            "Brussels Airlines",
            "Shenzhen Airlines",
            "Air China",
            "Air New Zealand",
            "Asiana Airlines",
            "Brussels Airlines",
            "Copa Airlines",
            "Croatia Airlines",
            "EgyptAir",
            "TAP Portugal",
            "United Airlines",
            "Turkish Airlines",
            "Swiss International Air Lines",
            "Lufthansa",
            "EVA Air",
            "South African Airways",
            "Singapore Airlines"
    ]
}

// Determine the approach that satisfies the following question in the most efficient manner:
//
// Find the list of all possible distinct destinations, with at most one layover, departing from the base airports of airlines that make part of the "OneWorld" alliance. The airlines should be national carriers from Germany, Spain or Canada only. Include both the destination and which airline services that location. As a small hint, you should find 158 destinations.


//For this lab the correct answer would be

db.air_alliances.aggregate([
  {
    $match: { name: "OneWorld" }
  },
  {
    $graphLookup: {
      startWith: "$airlines",
      from: "air_airlines",
      connectFromField: "name",
      connectToField: "name",
      as: "airlines",
      maxDepth: 0,
      restrictSearchWithMatch: {
        country: { $in: ["Germany", "Spain", "Canada"] }
      }
    }
  },
  {
    $graphLookup: {
      startWith: "$airlines.base",
      from: "air_routes",
      connectFromField: "dst_airport",
      connectToField: "src_airport",
      as: "connections",
      maxDepth: 1
    }
  },
  {
    $project: {
      validAirlines: "$airlines.name",
      "connections.dst_airport": 1,
      "connections.airline.name": 1
    }
  },
  { $unwind: "$connections" },
  {
    $project: {
      isValid: {
        $in: ["$connections.airline.name", "$validAirlines"]
      },
      "connections.dst_airport": 1
    }
  },
  { $match: { isValid: true } },
  {
    $group: {
      _id: "$connections.dst_airport"
    }
  }
])

//This pipeline takes the most selective collection first, air_alliances, matching the document refering to the OneWorld alliance.

db.air_alliances.aggregate([
{
  $match: { name: "OneWorld" }
}

//It then iterates, with maxDepth 0 on the air_airlines collection to collect the details on the airlines, specially their base airport, but restricting that $lookup to airlines of the requested countries [Spain, Germany, Canada], using restrictSearchWithMatch.

db.air_alliances.aggregate([
  {
    $match: { name: "OneWorld" }
  },
  {
    $graphLookup: {
      startWith: "$airlines",
      from: "air_airlines",
      connectFromField: "name",
      connectToField: "name",
      as: "airlines",
      maxDepth: 0,
      restrictSearchWithMatch: {
        country: { $in: ["Germany", "Spain", "Canada"] }
      }
    }
  }
]).pretty()

//We then iterate over all routes up to maximum of one layover by setting our maxDepth to 1. We find all possible destinations when departing from the base airport of each carrier by specify $airlines.base in startWith

db.air_alliances.aggregate([
  {
    $match: { name: "OneWorld" }
  },
  {
    $graphLookup: {
      startWith: "$airlines",
      from: "air_airlines",
      connectFromField: "name",
      connectToField: "name",
      as: "airlines",
      maxDepth: 0,
      restrictSearchWithMatch: {
        country: { $in: ["Germany", "Spain", "Canada"] }
      }
    }
  },
  {
    $graphLookup: {
      startWith: "$airlines.base",
      from: "air_routes",
      connectFromField: "dst_airport",
      connectToField: "src_airport",
      as: "connections",
      maxDepth: 1
    }
  }
]).pretty()



//We now have a document with a field named connections that is an array of all routes that are within 1 layover. We use a $project here to remove unnecessary information from the documents. We also need to include information about valid airlines that match our initial restriction and the name of the current airline.

db.air_alliances.aggregate([
  {
    $match: { name: "OneWorld" }
  },
  {
    $graphLookup: {
      startWith: "$airlines",
      from: "air_airlines",
      connectFromField: "name",
      connectToField: "name",
      as: "airlines",
      maxDepth: 0,
      restrictSearchWithMatch: {
        country: { $in: ["Germany", "Spain", "Canada"] }
      }
    }
  },
  {
    $graphLookup: {
      startWith: "$airlines.base",
      from: "air_routes",
      connectFromField: "dst_airport",
      connectToField: "src_airport",
      as: "connections",
      maxDepth: 1
    }
  },
  {
    $project: {
      validAirlines: "$airlines.name",
      "connections.dst_airport": 1,
      "connections.airline.name": 1
    }
  }
]).pretty()


//After this, we'll unwind our connections array, and then use $project to add a field representing whether this particular route is valid, meaning it is a route flown by one of our desired carriers.

db.air_alliances.aggregate([
  {
    $match: { name: "OneWorld" }
  },
  {
    $graphLookup: {
      startWith: "$airlines",
      from: "air_airlines",
      connectFromField: "name",
      connectToField: "name",
      as: "airlines",
      maxDepth: 0,
      restrictSearchWithMatch: {
        country: { $in: ["Germany", "Spain", "Canada"] }
      }
    }
  },
  {
    $graphLookup: {
      startWith: "$airlines.base",
      from: "air_routes",
      connectFromField: "dst_airport",
      connectToField: "src_airport",
      as: "connections",
      maxDepth: 1
    }
  },
  {
    $project: {
      validAirlines: "$airlines.name",
      "connections.dst_airport": 1,
      "connections.airline.name": 1
    }
  },
  { $unwind: "$connections" },
  {
    $project: {
      isValid: {
        $in: ["$connections.airline.name", "$validAirlines"]
      },
      "connections.dst_airport": 1
    }
  }
]).pretty()



//Lastly, we use $match to filter out invalid routes, and then $group them on the destination.

db.air_alliances.aggregate([
  {
    $match: { name: "OneWorld" }
  },
  {
    $graphLookup: {
      startWith: "$airlines",
      from: "air_airlines",
      connectFromField: "name",
      connectToField: "name",
      as: "airlines",
      maxDepth: 0,
      restrictSearchWithMatch: {
        country: { $in: ["Germany", "Spain", "Canada"] }
      }
    }
  },
  {
    $graphLookup: {
      startWith: "$airlines.base",
      from: "air_routes",
      connectFromField: "dst_airport",
      connectToField: "src_airport",
      as: "connections",
      maxDepth: 1
    }
  },
  {
    $project: {
      validAirlines: "$airlines.name",
      "connections.dst_airport": 1,
      "connections.airline.name": 1
    }
  },
  { $unwind: "$connections" },
  {
    $project: {
      isValid: {
        $in: ["$connections.airline.name", "$validAirlines"]
      },
      "connections.dst_airport": 1
    }
  },
  { $match: { isValid: true } },
  {
    $group: {
      _id: "$connections.dst_airport"
    }
  }, 
  {
    $count: "destinations"
  }
])


//An important aspect to this pipeline is that the first $graphLookup will act as a regular $lookup since we are setting a maxDepth to zero. The reason why we are taking this approach is due to the match restriction that $graphLookup allows, which can make this stage more efficient. Think back to the earlier lab on $lookup, can you think of a way to simplify the aggregation using $graphLookup instead?
