# Chapter 0

## Prerequisites and connecting

To connect to M121 course Atlas Cluster, using the mongo shell, you will need to use the following connection command:

mongo "mongodb://cluster0-shard-00-00-jxeqq.mongodb.net:27017,cluster0-shard-00-01-jxeqq.mongodb.net:27017,cluster0-shard-00-02-jxeqq.mongodb.net:27017/aggregations?replicaSet=Cluster0-shard-0" --authenticationDatabase admin --ssl -u m121 -p aggregations --norc

Need to have MongoDB Enterprise version installed also.

## Pipelines

Like conveyor belt in a factory with one to many stages.

![](img/pipeline.png)
![](img/stages.png)

e.g. match (to select only certain documents), project (decide which features of those documents we wish to see in the results) and group (summarise features of the documents by grouping them together).

## Aggregation structure and syntax

Aggregation is an array of stages; each stage is a JSON object made up of key-value pairs.

```js
db.userColl.aggregate([{stage1}, {stage2}, {stageN}], {options})
```

https://docs.mongodb.com/manual/meta/aggregation-quick-reference/
