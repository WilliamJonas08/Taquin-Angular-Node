const MongoClient = require('mongodb')

// Connection URL
const url = 'mongodb://localhost:27017';

// Database Name (> collections > data)
const dbName = 'Taquin-Angular';


const collections = {       //Permet de sortir la collection de la fonction connect, et donc de l'exporter une fois connecté
    results: /** @type {MongoClient.Collection} */null
}

async function connectDb() {
    const client = await MongoClient.connect(url)
    // console.log("Connected successfully to server");
    const db = client.db(dbName);
    // console.log("collection created")
    //Création d'une collection de la BDD
    collections.results = await db.createCollection("results")  //Contient tous les resultats

    // insertDocuments(db, function() {
    //   findDocuments(db, function() {
    //     client.close();
    //   });
    // });

    // client.close();
       
   

}

module.exports = {
    connectDb,
    collections
}



