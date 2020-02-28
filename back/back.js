// @ts-check
const express = require('express')
const { collections, connectDb } = require('./db')
var cors = require('cors')


const app = express()
app.use(cors())
const port = 3000



//#PompéDuNet
var whitelist = ['http://localhost:4200']
var corsOptions = {
  // origin: 'http://localhost:4200',
  // optionsSuccessStatus: 200

  // origin: function (origin, callback) {
  //   if (whitelist.indexOf(origin) !== -1) {
  //     callback(null, true)
  //   } else {
  //     callback(new Error('Not allowed by CORS'))
  //   }
  // }

  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}



connectDb().then(() => {
console.log("---------- STARTING --------------")

// // app.options('/service/results/:username', ) // enable pre-flight request for DELETE request
// app.get('/test/:username/:score/:victories', function (req, res) {
//   console.log("test en cours de traitement")
//   const username = req.params.username
//   const score = req.params.score
//   const victories=req.params.victories
//   const userData = {username: username, score:score, victories:victories}
//   // collections.results.insertOne(userData)   
//   res.json(userData)
// })

app
//GET RESULTS
.get('/service/results', cors(corsOptions), async function (req, res) {
  const resultsCursor = await collections.results.find({}, { projection: { _id: 0, username: 1, score: 1, victories: 1 } }) // en soit la projection ne sert à rien car on utilise uniquement les 3 propriétés qui nous intéressent dans la vue (endcomponent)
  const results = resultsCursor.toArray()  //la méthode find() renvoie un Curseur, que l'on traduit sous forme d'array
  results.then(r => res.json(r)).catch(err => res.status(500).json(err))
})
//ADD RESULTS - POST
.get(`/service/addresult/:username/:score/:victories`, cors(corsOptions), async function (req, res) { //devrait être post
  console.log("addResult en cours de traitement")
  const username = req.params.username
  const user = await collections.results.findOne({ username: username })
  const score = req.params.score
  const victories=req.params.victories
  const currentUserData = {username: username, score:score, victories:victories}
  
  if (user==null){
    //Nouvel username
    collections.results.insertOne(currentUserData)     
    console.log("NEW RESULT ADDED")
    res.json("NEW RESULT ADDED")
    return
  }
  else{ //(user != null)               //DESO JE ME SOUVIENS PLUS DES REGLES POUR LES SEND SUCCESSSIFS DU COUP JE METS 2 IF
    //Username already exist
    const UserScoreToFind = await collections.results.findOne({ username: username })
    const latestScore = UserScoreToFind.score
    if (score<latestScore){
      //Record battu
      collections.results.update({ username:username }, currentUserData)   
      console.log("NEW BEST RESULT ADDED")
      res.json("NEW BEST RESULT ADDED")
      return
    }
    else{
      //Record non battu
      collections.results.update({ username:username }, {username:username, score:latestScore, victories:victories })     
      console.log("RESULT UDPDATED")
      res.json("RESULT UPDATED")
    }
  }
  // res.set('Access-Control-Allow-Origin','http://localhost:4200')  //TEST
})
//ADD RESULTS - POST2
// .post(`/service/results/:username`, cors(corsOptions), function (req, res) {
  //   console.log("addResult en cours de traitement")
  //   collections.results.insertOne(req.body)     //PB OU PAS ?
  //   console.log("NEW RESULT ADDED")
  //   // res.set('Access-Control-Allow-Origin','http://localhost:4200')  //TEST
  //   res.json("NEW RESULT ADDED")
  // })
  
  //ADD RESULTS - UpdateUserResults   //REMPLACÉ PAR REQUETE PRÉCÉDENTE
  // .put(`/service/results/:username`, cors(corsOptions), async function (req, res) {
  //   console.log("UpdateResult en cours de traitement")
  //   const result = req.body
  //   await collections.results.update({ username: result.username }, { score: result.score, victories: result.victories })
  //   console.log("NEW UPDATED RESULT")
  //   res.json("NEW UPDATED RESULT")
  // })
  //GET LATEST SCORE
  .get(`/service/getlatestscore/:username`, cors(corsOptions), async function (req, res) {
    const username = req.params.username
    const UserToFind = await collections.results.findOne({ username: username }) //INCOMPRÉHENSION
    res.json(UserToFind.score)
  })
  //GET VICTORIES
  .get(`/service/getVictories/:username`, cors(corsOptions), async function (req, res) {
    const username = req.params.username
    const UserToFind = await collections.results.findOne({ username: username })
    res.json(UserToFind.victories)
  })
  //IS NEW USER
  .get(`/service/results/isnewuser/:username`, cors(corsOptions), async function (req, res) {
    const username = req.params.username
    const user = await collections.results.findOne({ username: username })
    // console.log("isNewUser = " + user == null)
    res.json(user == null)
  })
  
  app.listen(port)
})



/**
 * Définition des fonctions utilisées
 * ATTENTION : IL S'AGIT DE PROMESSES  -> POURQUOI Y A T'IL 2 AWAIT DU COUP ? 1 DANS LA DEF DE LA PROMESSE ET 1 POUR ATTENDRE LA RESOL DE LA PROMESSE
 */
// const getResults = async function () {    //normalement on try /catch
//   const results = await collections.results.find({}, { projection: { _id: 0, username: 1, score: 1, victories: 1 } }) // en soit la projection ne sert à rien car on utilise uniquement les 3 propriétés qui nous intéressent dans la vue (endcomponent)
//   console.log(results)
//   return results
// }

// const addNewResult = async function (result) {
//   await collections.results.insertOne(result)
//   console.log("NEW RESULT ADDED")
// }

// const addUpdatedResult = async function (result) {
//   await collections.results.update({ username: result.username }, { score: result.score, victories: result.victories })
//   console.log("RESULT ADDED")
// }

// const getLatestScore = async function (username) {
//   const UserToFind = await collections.results.find({ username: username })
//   return UserToFind.score
// }

// Récupère le nb de victoires réalisées par le user
// const getVictories = async function (username) {
  // const UserToFind = await collections.results.find({ username: username })
  // return UserToFind.victories
// }










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

