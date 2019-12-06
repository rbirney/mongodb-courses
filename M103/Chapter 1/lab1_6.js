// Import the products.json dataset with your application's user m103-application-user into a collection called products, in the database applicationData.

mongoimport --drop --port 27000 -u "m103-application-user" \
-p "m103-application-pass" --authenticationDatabase "admin" \
--db applicationData --collection products /dataset/products.json