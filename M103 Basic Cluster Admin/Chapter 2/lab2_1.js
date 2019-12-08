// launch first mongod process
mongod --config "/shared/mongod-repl-1.conf"

// launch second
mongod --config "/shared/mongod-repl-2.conf"

// launch third 
mongod --config "/shared/mongod-repl-3.conf"

// connect to mongo shell on primary node 27001
mongo --port 27001

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
mongo --host "m103-repl/192.168.103.100:27001" -u "m103-admin" -p "m103-pass" --authenticationDatabase "admin"

// add the other two nodes to the replica set
rs.add("192.168.103.100:27002")
rs.add("192.168.103.100:27003")

// check who is master of replica set
rs.isMaster()