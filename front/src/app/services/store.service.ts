import { Injectable} from '@angular/core';
// import { Observable, of } from 'rxjs';
import { User } from '../user';
import { RoutingService } from './routing.service';
import { Subject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class Store{
  message:string;
  currentUser: User;

  //Instanciation
  userSubject: Subject<User>= new Subject()

  constructor(
    private routingService: RoutingService,
  ) { 
    //Subscribes
    //A REVOIR PROBABLEMENT
    // this.userSubject.subscribe(user => {
    //   this.currentUser=user
    // })
  }

/**
 *  ECHANGE DONNEES AVEC STOCKAGE LOCAL
 */

//Récupère la BDD
getData=function():User[]{
  //Récupération de l'objet ({'monTableau', JSON.stringify(tabDonnees)})
  let tabDonneesString:string = localStorage.getItem('monTableau') || '[]';
  let tabDonnees: User[] =JSON.parse(tabDonneesString)
  return tabDonnees
}

//Ajoute currentUser à la BDD suite à une victoire
addData (username:string, score:number, victories:number ):void{
  let tabDonnees= this.getData()
  tabDonnees.push({username,score,victories});
  //Suppression de la mémoire locale avant réinsertion
  localStorage.clear();
  //Stockage d'un objet supplémentaire dans tabDonnees
  localStorage.setItem('monTableau', JSON.stringify(tabDonnees));
  return;
}

//Cette fonction devrait être appellee par un utilisateur admin (ne pas raffraichir la page après avoir reset)
resetdata= function():void{
  // this.currentUser= new User('',0,0)//utile ?
  localStorage.clear()
  this.routingService.goToLogin()
  // this.createFirstData() //utile ?
}

/**
 *  FONCTIONS ANNEXES (USER)
 */

createNewUser(customerData){
      //Test existence username utilisateur pour récupérer les victoires précédentes (désormais la BDD existe dans tous les cas)
      //Instantiation des données utilisateur pour la partie
  let victories = this.getVictories(customerData)
  this.currentUser=new User(customerData,0,victories)
  console.log(this.currentUser)
  this.userSubject.next(this.currentUser)
}

//Teste si nouvel utilisateur
isNewUser(username:string): boolean{
  let tabDonnees=this.getData()
  // Username pas dans la bdd ?
  for (let i:number = 0; i < tabDonnees.length; i++) {
    //On teste si le username apparait dans la BDD
    if (tabDonnees[i].username===username){
      return false
    }   
  }
  return true
}

indexUser(username:string):number{
  let tabDonnees=this.getData()
  if (!this.isNewUser(username)){
    for (let index:number = 0; index < tabDonnees.length; index++) {
      if (tabDonnees[index].username===username){
        return index
      }   
    }
  }
  console.log("gros problème indexUser")
  return (-1)
}


//Teste l'existence d'un array (ici de la bdd)
// Pas utile si tjr array vide au moins
ifTabExist(tabDonnees):boolean{
  if(tabDonnees !==null){
    return true
  }
  else{
    return false
  }
}

// Récupère le nombre de  victoires pour un username
getVictories(username:string):number{
  let tabDonnees=this.getData()
  if (this.isNewUser(username)){
                //Cette fonction n'est pas appellée dans le login dans le cas d'un newUser (victoires automatiquement instancié à 0)
                // Appelée suite à une victoire -> donc return 1
      // Dans le cas d'une fonction générique (générale) on met return 0 ( peut etre appellé lors de l'initialisation désormais )
    return 0
  }
  else{
    let indexUser = this.indexUser(username)
    for (let i:number = 0; i < tabDonnees.length; i++) {
      if (tabDonnees[i].username===username){
        return tabDonnees[indexUser].victories
      }   
    }
  }
  console.log("gros problème get Victories")
  return (-1)  
}
//Attention: la fonction récupère les victoires dans la BDD et non pas dans currentUser

scoreUp(){
  this.currentUser.score++
  this.userSubject.next(this.currentUser)
}

// Augmente le nombre de victoire d'un utilisateur (pour chacune de ses parties) de 1
majVictories(username:string):void{
  let tabDonnees=this.getData()
  tabDonnees.forEach(donnee => {
      if (donnee.username===username){
        donnee.victories+=1
      }
    })
  localStorage.clear()
  localStorage.setItem('monTableau', JSON.stringify(tabDonnees))
  //Pour l'affichage top-bar final, on modifie currentUser (même si il ne sera plus utilisé désormais)
  this.currentUser.victories++
  this.userSubject.next(this.currentUser)
}
}


// //UTILE SI GET DATA RENVOIE UN ARRAY VIDE ?
// //Dans le cas ou la BDD locale n'existe pas, on crée un bdd vide
// createFirstData():void{
//   const localContent = localStorage.getItem('monTableau')
//   if(!localContent){
//     localStorage.setItem('monTableau',JSON.stringify([]))     // [] est de type object
//     return
//   }
//   else {
//     console.log("Une BDD existe déja")
//     return
//   }
// }


