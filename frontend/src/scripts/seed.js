var pg = require('pg');
//var conString = "postgres://postgres:DataFitness8!@finalcs542.cle4qgwiih1x.us-east-2.rds.amazonaws.com:5432/finalcs542";

//var client = new pg.Client(conString)

var client = new pg.Client({
    user: "postgres",
    password: "DataFitness8!",
    database: "postgres",
    port: 5432,
    host: "finalcs542.cle4qgwiih1x.us-east-2.rds.amazonaws.com",
    ssl: true
});
//client.connect();

try{
  client.connect();
  console.log("successfully connected");
}
catch(error){
    console.error('Error connecting:', error);
    throw error;
}