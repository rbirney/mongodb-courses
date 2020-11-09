//mongod connection string
mongod --port 27000 --dbpath /data/db --auth --bind_ip 192.168.103.100,127.0.0.1

//mongo connection string
mongo --port 27000

//create user

use admin

db.createUser({
  user: "m103-admin",
  pwd: "m103-pass",
  roles: [
    {role: "root", db: "admin"}
  ]
})