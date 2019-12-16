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

/*
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
*/


db.air_alliances.findOne()
{
        "_id" : ObjectId("5980bef9a39d0ba3c650ae9b"),
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

db.air_airlines.findOne() 
{
        "_id" : ObjectId("56e9b497732b6122f879030f"),
        "airline" : 144,
        "name" : "Air Afrique Vacancies",
        "alias" : "",
        "iata" : "AFV",
        "icao" : "AFRIQUE VACANCE",
        "active" : "N",
        "country" : "Ivory Coast",
        "base" : "RTB"
}

db.air_routes.findOne()  
{
        "_id" : ObjectId("56e9b39b732b6122f877fa95"),
        "airline" : {
                "id" : 470,
                "name" : "Air Burkina",
                "alias" : "2J",
                "iata" : "VBW"
        },
        "src_airport" : "OUA",
        "dst_airport" : "DKR",
        "codeshare" : "",
        "stops" : 0,
        "airplane" : "M87"
}