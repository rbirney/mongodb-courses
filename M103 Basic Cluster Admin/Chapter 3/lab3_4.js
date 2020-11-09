// Query 1:
db.products.explain("executionStats").find({"sku": 23153496})

// Query 2: 
db.products.explain("executionStats").find({"shippingWeight": 1.00})

// Assuming the only indexes on this collection are { _id: 1 } and { sku: 1 }, which of the following statements are true?

// Query 2 performs a collection scan.

// Query 2 uses the shard key.

// Query 1 performs an index scan before the sharding filter.

/*
Correct Answers:

Query 1 performs an index scan before the sharding filter.

The sharding filter ensures that documents returned by each shard are not orphan documents. It does this by comparing the value of the shard key to the chunk ranges inside that particular shard.

Mongos will try to minimize the number of documents checked by the shard filter. To do this, mongos will only send the documents matching the query (i.e. are returned by the index scan) to be compared against the chunk ranges.

Query 2 performs a collection scan.

Assuming there is no index on shippingWeight, then Query 2 would need to perform a collection scan.

Incorrect Answers:

Query 2 uses the shard key.

We know that Query 2 doesn't use the shard key because the shard key is not in the query predicate.
*/