// Given the following shard key:

{ "country": 1, "_id": 1 }
 
// Which of the following queries will be routed (targeted)? Remember that queries may be routed to more than one shard.

// routed
db.customers.find({"_id": 914, "country": "Sweden"})

// routed
db.customers.find({"country": "Norway", "_id": 54})

// routed
db.customers.find({"country": { $gte: "Portugal", $lte: "Spain" }})

// not routed (doesn't contain country field)
db.customers.find({"_id": 455})