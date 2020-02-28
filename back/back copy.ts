// @ts-check
import express from "express";
import cors from 'cors';
import { collections, connectDb } from './db';
// const { collections, connectDb } = require('./db')


// const express= Express
const app = express();  //"app" = "server"
const port = 3000

//#PompéDuNet
const whitelist = ['http://localhost:4200']
const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}

connectDb().then(() => {

  app
    .get(`/service/try`, cors(corsOptions), function (req, res){
      return res.json({toto : 'toto'})
    })
    //Get Results
    .get('/service/results', cors(corsOptions), function (req, res) {
      return res.json(getResults())   
    })
    //Add Results
    .post(`/service/results/:username`, cors(corsOptions), function (req, res) {
      addNewResult(req)
      return res.json(req)
    })
    .put(`/service/results/:username`, cors(corsOptions), function (req, res) {
      addUpdatedResult(req)
      return res.json(req)
    })
    .get(`/service/getlatestscore/:username`, cors(corsOptions), function (req, res) {
      const username = req.params.username
      return res.json(getLatestScore(username)) // username à récupérer username avec req.params
    })
    .get(`/service/getVictories/username`, cors(corsOptions), function(req,res){
      const username = req.params.username
      return res.json(getVictories(username))
    })
    .get(`/service/results/isnewuser/:username`, cors(corsOptions), function(req,res){
      const username = req.params.username
      return res.json(isNewUser(username))
    })



  app.listen(port)
})



/**
 * Définition des fonctions utilisées 
 */
const getResults = async function():Promise<Object[]> {    //normalement on try /catch
  const results /** @type {Promise<Object[]>} */ =await collections.results.find()
  return results
}

const addNewResult = async function (result):Promise<void> {
  await collections.results.insertOne(result)
}

const addUpdatedResult = async function (result):Promise<void> {
  await collections.results.update({ username: result.username }, { score: result.score, victories: result.victories })
}

const getLatestScore = async function (username):Promise<number> {
  const UserToFind = await collections.results.find({ username: username })
  return UserToFind.score
}

// Récupère le nb de victoires réalisées par le user
const getVictories = async function (username):Promise<number> { 
  const UserToFind = await collections.results.find({ username: username })
  return UserToFind.victories
}

const isNewUser=async function(username):Promise<boolean>{
  const data = await collections.results.find({ username: username })
  if (data == undefined){
    return true
  }
  else{
    return false
  }
}















// //insertion
// db.contacts.insert({ first: 'Quentin', last: 'Busuttil' })

// //sélection
// db.contacts.find()
// db.contacts.find({ first: 'quentin' })

// //Mise à jour du résultat d'un joueur déja existant
// //BESOIN GET SCORE+VICTORIES+LATEST SCORE
// const updateUserResult = function (username: string, db) {
//   //Création d'une collection de la BDD
//   const collections.results = db.collection("results") //Contient tous les resultats
//   async getLatestScore(username).subscribe(res => {             //SUBSCRIBE C'EST DANS LE FRONT (SUR OBSERVABLES DE LA REQ HTTP) ET PAS DANS LE BACK
//     const latestScore = res
//     //record battu 
//     if (this.store.currentUser.score >= latestScore) {
//       // app.put(`/results/${username}`, this.store.currentUser);
//       //Insertion d'un object dans la BDD -> a créer dans une fonction appart
//       const toSave = this.store.currentUser // a changer
//       await collections.results.insertOne(toSave)  //.insertMany
//       console.log(toSave)
//     }
//     //record non battu -> on incrémente de 1 le nombre de victoires
//     else {
//       app.put(`/results/${username}`, {
//         username: username,
//         score: latestScore,
//         victories: this.store.currentUser.victories + 1, // mettre +1 si le nb de victoires du current user n'a pas déja été incrémenté lors du passage vers le end screen
//       });
//     }
//   })

// }

// // Récupère l'ancien score réalisé par le user
// const getLatestScore = function (username) {
//   const results = getResults();
//   //On cherche l'index de l'User dans results
//   let i = 0
//   while (username !== results[i].username) {
//     i++
//     //simple sécurité -> utile ?
//     if (i >= results.length) {
//       console.error('error')
//       return -1;
//     }
//   };
//   return results[i].score
// }

// const isNewUser = function (username) {

// }

// const getCurrentUserScore = function (username) {

// }

// const getCurrentUserVictories = function (username) {

// }














//Est ce que l'utilisation de callback est nécessaire ? pourquoi pas ne pas appeller les fonctions dans le bon ordre dans le script ?
//Est ce que c'est psk c'est lié à l'asynchronisme des fonctions et aux différences dans leurs durée d'éxecution ?
// oû sont définis les err et res dans les fonctions de callback ?
// A quoi servent les index dans une bdd mongo ?

// const insertDocuments = function(db, callback) {
//   // Get the documents collection
//   const collections.results = db.collection('results');
//   // Insert some documents
//   collections.results.insertOne( {username: "username"} , function(err, result) {
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

