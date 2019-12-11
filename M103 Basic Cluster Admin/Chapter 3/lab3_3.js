// run this command in mongos
db.getSiblingDB("m103").products.find({"sku" : 21572585 })

// Locate the chunk that the specified document resides on and pass the full chunk ID to the validation script provided in the handout. You need to run the validation script in your vagrant and outside the mongo shell.
validate_lab_document_chunks "m103.products-sku_MinKey"

// For larger datasets, there may be many hundreds or thousands of chunks, making visual identification time consuming or unrealistic. Instead, we can perform a query against the config.chunks database to identify the chunk where min <= sku < max
db.getSiblingDB("config").chunks.find(
   {
      "ns" : "m103.products",
      $expr: {
         $and : [
          {$gte : [ 21572585, "$min.sku"]},
          {$lt : [21572585, "$max.sku"]}
         ]
      }
   }
)