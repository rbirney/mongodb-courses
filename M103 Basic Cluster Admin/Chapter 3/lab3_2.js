// make directories and change ownership
sudo mkdir /var/mongodb/db/{4,5,6}
sudo chown -R vagrant:vagrant /var/mongodb/db/4
sudo chown -R vagrant:vagrant /var/mongodb/db/5
sudo chown -R vagrant:vagrant /var/mongodb/db/6

// bring up config servers
mongod --config "/shared/mongod-repl-4.conf"
mongod --config "/shared/mongod-repl-5.conf"
mongod --config "/shared/mongod-repl-6.conf"

// connect to mongo shell on primary node 27004
mongo --port 27004

// initiate replica set
rs.initiate()

// check status
rs.status()

// create user
use admin

db.createUser({
  user: "m103-admin",
  pwd: "m103-pass",
  roles: [
    {role: "root", db: "admin"}
  ]
})

// reconnect as this user
mongo --host "m103-repl-2/192.168.103.100:27004" -u "m103-admin" -p "m103-pass" --authenticationDatabase "admin"

// add the other two nodes to the replica set
rs.add("192.168.103.100:27005")
rs.add("192.168.103.100:27006")

// check that all three members exist in replica set
rs.isMaster()

// back in mongos
// add m103-repl as the first shard
sh.addShard("m103-repl-2/192.168.103.100:27004")

// in vagrant shell
// import dataset
mongoimport --drop /dataset/products.json --port 26000 -u "m103-admin" \
-p "m103-pass" --authenticationDatabase "admin" \
--db m103 --collection products

// in mongos
// check the dataset has loaded
use m103
db.products.count()

// enable sharding
sh.enableSharding("m103")

// create index on sku
db.products.createIndex({"sku": 1})

// shard on sku
db.adminCommand( { shardCollection: "m103.products", key: { "sku": 1 } } )

// check status
sh.status()

// note: had to drop m103 from both replica sets and try again 