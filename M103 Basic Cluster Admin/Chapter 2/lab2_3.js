// connect directly to a secondary node
mongo --host "192.168.103.100:27003" -u "m103-admin" -p "m103-pass" --authenticationDatabase "admin"

// shut it down
use admin
db.shutdownServer()

// reconnect to replica set
mongo --host "m103-repl/192.168.103.100:27001" -u "m103-admin" -p "m103-pass" --authenticationDatabase "admin"

// attempt to insert doc with writeConcern set to 3
use testDatabase
db.new_data.insert({"m103": "very fun"}, { writeConcern: { w: 3, wtimeout: 1000 }})


// Which of these apply?

// The write operation will always return with an error, even if wtimeout is not specified.
// NO - it just hangs indefinitely

// When a writeConcernError occurs, the document is still written to the healthy nodes.
// YES! I did not expect that...

// w: "majority" would also cause this write operation to return with an error.
// NO - no error in this case

// The unhealthy node will be receiving the inserted document when it is brought back online.
// YES. Isn't that clever :)