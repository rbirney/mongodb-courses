// import products.json into replica set
mongoimport --drop \
--host m103-repl/192.168.103.100:27002,192.168.103.100:27001,192.168.103.100:27003 \
-u "m103-admin" -p "m103-pass" --authenticationDatabase "admin" \
--db applicationData --collection products /dataset/products.json

// check the dataset has loaded
use applicationData
db.products.count()

// connect directly to a secondary node
mongo --host "192.168.103.100:27003" -u "m103-admin" -p "m103-pass" --authenticationDatabase "admin"

// shut it down
use admin
db.shutdownServer()

// same for the other secondary
mongo --host "192.168.103.100:27002" -u "m103-admin" -p "m103-pass" --authenticationDatabase "admin"

// reconnect to replica set
// won't work as primary can't be elected; connect directly to node
mongo --host "192.168.103.100:27001" -u "m103-admin" -p "m103-pass" --authenticationDatabase "admin"

// read from secondary
rs.slaveOk()
use applicationData

// set read preference
db.products.find({"sku": 20000008}).readPref("nearest")

// Which of these readPreferences will allow you to read data from this node?

// primary - NO

// secondaryPreferred - YES

// primaryPreferred - YES

// secondary - YES

// nearest - YES
