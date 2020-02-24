const MongoClient = require('mongodb').MongoClient;

const express = require('express')
const app = express()
const port = 3000

// Connection URL
const url = 'mongodb://localhost:27017';

// Database Name (> collections > data)
const dbName = 'Taquin-Angular';

MongoClient.connect(url, async(err, client)=>{
    console.error(err)
    console.log("Connected successfully to server");
    const db = client.db(dbName);

    //Création d'une collection de la BDD
    const resultsCollection = db.collection("results")  //Contient tous les resultats

    // insertDocuments(db, function() {
    //   findDocuments(db, function() {
    //     client.close();
    //   });
    // });

    //compter le nb de data dans la collection
    // nbResults = await resultsCollection.count()
   

    // client.close();
  });

  // serve-static : permet de renvoyer des fichiers statiques contenus dans un dossier (images, fichiers à télécharger...)
  // app.use(express.static( '../front'))

  //Permet de récupérer les résultats sous forme de liste de User

    app
      //Get Results
      .get('/results', function(req,res){
        res.send("URL TO RESULTS") //PAS BON -> doit send une var
      })
      //Add Results
      .get(`/results/:username`, function(req, res){ //savoir si le username donnée est celle du current user ou non 
        if (this.store.isNewUser(this.store.currentUser.username)){
          app.post(`/results/${this.store.currentUser.username}`, this.store.currentUser)
          res.send("New User data added to the leaderboard")
        }
        else{
          this.updateUserResult(this.store.currentUser.username)
          res.send("User data added to the leaderboard")
        }
      })




/**
 * define :
 * isNewUser
 * getscore
 * getVictories
 * updateUser result
 * 
 * Requete vers le front pour récupérer le current user ? -> mettre ses paramètres dans l'url de la requete
*/

app.listen(port) //console.log(`Example app listening on port ${port}!`)





  //Mise à jour du résultat d'un joueur déja existant
  //BESOIN GET SCORE+VICTORIES+LATEST SCORE
  const updateUserResult=function(username:string, db){
    //Création d'une collection de la BDD
    const resultsCollection = db.collection("results") //Contient tous les resultats
    async getLatestScore(username).subscribe(res => {             //SUBSCRIBE C'EST DANS LE FRONT (SUR OBSERVABLES DE LA REQ HTTP) ET PAS DANS LE BACK
      const latestScore:number = res
      //record battu 
      if (this.store.currentUser.score >= latestScore){     
        // app.put(`/results/${username}`, this.store.currentUser);
        //Insertion d'un object dans la BDD -> a créer dans une fonction appart
        const toSave = this.store.currentUser // a changer
        await resultsCollection.insertOne(toSave)  //.insertMany
        console.log(toSave)
      } 
      //record non battu -> on incrémente de 1 le nombre de victoires
      else{
        app.put(`/results/${username}`, {
          username: username,
         score: latestScore, 
          victories: this.store.currentUser.victories+1, // mettre +1 si le nb de victoires du current user n'a pas déja été incrémenté lors du passage vers le end screen
        });
      }
    }) 

  }

  // Récupère l'ancien score réalisé par le user
  const getLatestScore=function (username:string):number{
    const results = getResults();
    //On cherche l'index de l'User dans results
    let i = 0
    while (username !== results[i].username){
      i++
      //simple sécurité -> utile ?
      if (i >=results.length){
        console.error('error')
        return -1;        
      }
    };
    return results[i].score
  }

  const isNewUser = function(username:string):boolean{

  }

  const getCurrentUserScore = function(username:string):number{

  }

  const getCurrentUserVictories = function(username:string):number{
    
  }

  const getResults= function(){//Erreur de faire ça ?

  }














//Est ce que l'utilisation de callback est nécessaire ? pourquoi pas ne pas appeller les fonctions dans le bon ordre dans le script ?
//Est ce que c'est psk c'est lié à l'asynchronisme des fonctions et aux différences dans leurs durée d'éxecution ?
// oû sont définis les err et res dans les fonctions de callback ?
// A quoi servent les index dans une bdd mongo ?

// const insertDocuments = function(db, callback) {
//   // Get the documents collection
//   const resultsCollection = db.collection('results');
//   // Insert some documents
//   resultsCollection.insertOne( {username: "username"} , function(err, result) {
//     console.log("Inserted 3 documents into the collection");
//     callback(result);
//   });
// }

// const findDocuments = function(db, callback) {
//   // Get the documents collection
//   const collection = db.collection('documents');
//   // Find some documents
//   collection.find({}).toArray(function(err, docs) {      //remplacer {} par {'username': toto} pour filtrer
//     console.log("Found the following records");
//     console.log(docs)
//     callback(docs);
//   });
// }

// const updateDocument = function(db, callback) {
//   // Get the documents collection
//   const collection = db.collection('documents');
//   // Update document where a is 2, set b equal to 1
//   collection.updateOne({ username : "toto" }
//     , { $set: { victories : nbVictories+1 } }, function(err, result) {
//     console.log("Updated the document with the field a equal to nbVictories+1");
//     callback(result);
//   });
// }

//A utiliser plutot que d'insérer un attribut "bestScore" pour un résultat unique par utilisateur
// On supprime l'ancien résultat utilisateur si son score actuel est supérieur à l'ancien score enregistré
// Supprimer la fonction updateScores()
// const removeDocument = function(db, callback) {
//   // Get the documents collection
//   const collection = db.collection('documents');
//   // Delete document where a is 3
//   collection.deleteOne({ username : "toto", score : LATESTSCORE }, function(err, result) {
//     console.log("Removed the document with the field username equal to toto and score equal to ???");
//     callback(result);
//   });
// }

