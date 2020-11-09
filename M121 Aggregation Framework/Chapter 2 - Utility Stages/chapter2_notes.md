# Chapter 2: Utility Stages

## $addFields

Similar to project but only allows you to add new fields or modify existing fields (no options re: which to remove or retain). If we use project to modify a field then we need to specify all other fields we wish to retain; this can become tedious. We can also use addFields and project as two separate stages in the pipeline.

```js
db.solarSystem.aggregate([
  { $addFields: { gravity: "$gravity.value"} }
])
```

https://docs.mongodb.com/manual/reference/operator/aggregation/addFields/


## $geoNear

Used for working with geoJSON documentation.

```js
db.places.aggregate([
   {
     $geoNear: {
        near: { type: "Point", coordinates: [ -73.99279 , 40.719296 ] },
        distanceField: "dist.calculated",
        maxDistance: 2,
        query: { category: "Parks" },
        includeLocs: "dist.location",
        spherical: true
     }
   }
])
```

https://docs.mongodb.com/manual/reference/operator/aggregation/geoNear/


## Cursor-like stages

Cursor methods (which can be used with the find operation) are sort, skip, limit, count - these are also available as stages in the aggregation pipeline.

Note on "natural order": the default order for sorting documents is the order in which they were created (oldest first).

- Limit: limits results to n results
- Skip: skips the first n results
- Count: counts the results
- Sort: sorts the results

### $limit

```js
db.solarSystem.aggregate([
  { "$project": {
    _id:0,
    name:1,
    numberOfMoons: 1
  } },
  { $limit: 5 }
])
```

### $skip

```js
db.solarSystem.aggregate([
  { "$project": {
    _id:0,
    name:1,
    numberOfMoons: 1
  } },
  { $skip: 1 }
])
```

### $count

```js
db.solarSystem.aggregate([
  { "$match": {
      type: "Terrestrial planet"
  } },
  { $count: "terrestrial planets" }
])
```

### $sort

```js
db.solarSystem.aggregate([
  { "$project": {
      _id:0,
      name:1,
      hasMagneticField: 1,
      numberOfMoons: 1
  } },
  { $sort: {
    hasMagneticField: -1,
    numberOfMoons: -1
  } }
], {allowDiskUse: true})
```
Using negative 1 sorts in descending order. Positive 1 sorts in ascending order. You can sort on a number of different fields, as shown above. Setting the allow disk use option to true allows the sort to use more than 100mb of RAM.


## $sample

Selects a set of random documents from a collection. Useful when working with large collections, where we want to see a random subset of results.

```js
db.nycFacilities.aggregate([{ $sample: {size:200} }])
```
