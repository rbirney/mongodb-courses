// Which of the following are valid command line instructions to start a mongod? You may assume that all specified files already exist.

// Check all answers that apply:


// VALID
mongod --logpath /var/log/mongo/mongod.log --dbpath /data/db --fork

// NOT VALID (log should be logpath, authentication should be auth
mongod --log /var/log/mongo/mongod.log --authentication

// VALID
mongod -f /etc/mongod.conf

// NOT VALID (can't use fork without logpath)
mongod --dbpath /data/db --fork