# Chapter 3: Core Aggregation - Combining Information

## $group

The `_id` is required in the group stage; whatever is specified with the id field becomes the grouping criteria used to bundle items together.

```js
{ $group: { _id: matching/grouping criteria } }
```

Grouping movies by year (grouping on one field is functionally equivalent to distinct):
```js
db.movies.aggregate([
  { $group: {
      _id: "$year"
  } }
])
```

Adding another field:
```js
db.movies.aggregate([
  { $group: {
      _id: "$year",
      num_films_in_year: { $sum: 1 }
  } },
  { $sort: { num_films_in_year: -1 } }
])
```

The above relies on all documents having a common piece of information used to group (i.e. all documents must have a year field). For scenarios where there may be incomplete information:
```js
db.movies.aggregate([
  { $group: {
      _id: {
        numDirectors: {
          $cond: [{ $isArray: "$directors" }, { $size: "$directors" }, 0]
        }
      },
      numFilms: { $sum: 1 },
      averageMetacritic: { $avg: "$metacritic" }
  } },
  { $sort: { "_id.numDirectors": -1 } }
])
```
In the example above, $cond is used to check if the directors field is an array: if it is, $size is used to return the size of the array. Otherwise, numDirectors is set to 0.

Not all documents have a metacritic rating. This example uses match to filter out documents where the field or value is missing and then uses group to find the average of all the rest (id field set to null to perform the operation on all documents).
```js
db.movies.aggregate([
  { $match: {
    metacritic: { $gte: 0 }
  } },
  { $group: {
      _id: null,
      averageMetacritic: { $avg: "$metacritic" }
  } }
])
```

## Accumulator Expressions in $project

```js
db.icecream_data.aggregate([
  { $project: {
      _id: 0,
      max_high: {
        $reduce: {
          input: "$trends",
          initialValue: -Infinity,
          in: {
            $cond: [
              { $gt: ["$$this.avg_high_tmp", "$$value"] },
              "$$this.avg_high_tmp",
              "$$value"
            ]
          }
        }
      }
  } }
])
```
Double $$dollar symbols are used to specify variables that are only used in the current context (i.e. within the context of the reduce method). $$this refers to the current array element and $$value refers to the accumulator value.

Accumulator expressions greatly simplify examples like the above. The following code will achieve the same result:
```js
db.icecream_data.aggregate([
  { $project: {
      _id: 0,
      max_high: { $max: "$trends.avg_high_tmp" }
  } }
])
```

$min can be used in the same way.

This example calculates the average consumer price index for icecream and also the standard deviation using $avg and $stdDevPop.
```js
db.icecream_data.aggregate([
  { $project: {
      _id: 0,
      average_cpi: { $avg: "$trends.icecream_cpi" },
      cpi_deviation: { $stdDevPop: "$trends.icecream_cpi" }
  } }
])
```
$stdDevPop is used when looking at the entire set of data. $stdDevSamp is used when only looking at a sample.

Lastly, $sum is used to calculate a total.
```js
db.icecream_data.aggregate([
  { $project: {
      _id: 0,
      "yearly_sales (millions)": { $sum: "$trends.icecream_sales_in_millions" }
  } }
])
```
https://docs.mongodb.com/manual/reference/operator/aggregation/#group-accumulator-operators
