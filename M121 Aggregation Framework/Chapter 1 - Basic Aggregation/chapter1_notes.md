# Chapter 1: Basic Aggregation

## $match

Think of as a filter, rather than find. Can be used multiple times in a pipeline; often comes first/early in the pipeline.

```js
db.solarSystem.aggregate([{
  $match: {}
}])
```

https://docs.mongodb.com/manual/reference/operator/aggregation/match/

Uses the same query syntax as find; however, it does not allow for projection (as find does). This will be done in the $project stage of the pipeline instead.


## $project

More powerful than the projection available within the find operation. Can create new fields and reassign values.

```js
db.solarSystem.aggregate([{
  $project: {_id:0, name:1}
}])
```
The above removes the `_id` field (this is one that we must specify to remove, if specifying any fields to retain) and keeps the name field. Any fields (other than id) that we haven't specified will not be passed through.


```js
db.solarSystem.aggregate([{
  $project: {_id:0, name:1, "gravity.value": 1}
}])
```
If accessing properties within arrays or subdocuments, wrap subfield name in quotes.


```js
db.solarSystem.aggregate([{
  $project: {_id:0, name:1, gravity: "$gravity.value"}
}])
```
The above reassigns the value in the gravity field with the value from the gravity.value subfield. Prepend with $ dollar sign.


```js
db.solarSystem.aggregate([{
  $project: {_id:0, name:1, surfaceGravity: "$gravity.value"}
}])
```
This creates a new field called surfaceGravity and assigns the value from gravity.value.


```js
db.solarSystem.aggregate([{
  $project: {
    _ id:0,
    name:1,
    myWeight: { $multiply: [{ $divide: [ "$gravity.value", 9.8 ]}, 76]}
  }
}])
```
This uses multiply and divide to find out my weight on each different planet; planet's gravity divided by earth gravity (9.8) and then multiplied by my weight.
