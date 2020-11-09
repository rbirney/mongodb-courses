// remove a node from the replica set
rs.remove("192.168.103.100:27003")

// reconfigure node to use m103 hostname
rs.add("m103:27003")

// check configuration
rs.conf()

