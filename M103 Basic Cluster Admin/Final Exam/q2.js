// Given the following config file:

storage:
  dbPath: /data/db
systemLog:
  destination: file
  path: /var/log/mongod.log
net:
  bindIp: localhost,192.168.0.100
security:
  keyFile: /var/pki/keyfile
processManagement:
  fork: true
 
// How many directories must MongoDB have access to? Disregard the path to the configuration file itself.

// 3: MongoDB must be able to access the data directory /data/db/, the log file mongod.log in /var/log/, and the keyfile keyfile in /var/pki/.