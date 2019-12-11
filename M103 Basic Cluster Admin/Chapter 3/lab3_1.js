// make directories and change ownership
sudo mkdir /var/mongodb/db/{csrs1,csrs2,csrs3}
sudo chown -R vagrant:vagrant /var/mongodb/db/csrs1
sudo chown -R vagrant:vagrant /var/mongodb/db/csrs2
sudo chown -R vagrant:vagrant /var/mongodb/db/csrs3

// bring up config servers
mongod --config "/shared/csrs-1.conf"
mongod --config "/shared/csrs-2.conf"
mongod --config "/shared/csrs-3.conf"

// connect to mongo shell on primary node 27001
mongo --port 26001

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
mongo --host "m103-csrs/192.168.103.100:26001" -u "m103-admin" -p "m103-pass" --authenticationDatabase "admin"

// add the other two nodes to the replica set
rs.add("192.168.103.100:26002")
rs.add("192.168.103.100:26003")

// check that all three members exist in replica set
rs.isMaster()

// bring up mongos
mongos --config "/shared/mongos.conf"

// connect to the mongos
mongo --port 26000 --username m103-admin --password m103-pass --authenticationDatabase admin

// check sharding status
sh.status()

// reconfigure replica set to use sharding
// done in config files
// launch with new configuration
mongod --config "/shared/mongod-repl-1.conf"
mongod --config "/shared/mongod-repl-2.conf"
mongod --config "/shared/mongod-repl-3.conf"

// add m103-repl as the first shard
sh.addShard("m103-repl/192.168.103.100:27001")
