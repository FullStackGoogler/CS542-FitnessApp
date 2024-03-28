var pg = require('pg');

var client = new pg.Client({
    user: "postgres",
    password: "DataFitness8!",
    database: "postgres",
    port: 5432,
    host: "finalcs542.cle4qgwiih1x.us-east-2.rds.amazonaws.com",
    ssl: true
});

try{
  client.connect();
  console.log("successfully connected");
}
catch(error){
    console.error('Error connecting:', error);
    throw error;
}