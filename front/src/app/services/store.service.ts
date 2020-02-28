import { Injectable } from '@angular/core';
import { User } from '../user';
import { RoutingService } from './routing.service';
import { Subject } from 'rxjs';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Store {
  message: string;
  currentUser: User;

  //Instanciation
  userSubject: Subject<User> = new Subject()

  constructor(
    private routingService: RoutingService,
    private http: HttpClient,
  ) {
  }

  /**
   *  ECHANGE DONNEES AVEC STOCKAGE DISTANT (MONGODB)
   */

  //Cette fonction devrait être appellee par un utilisateur admin (ne pas raffraichir la page après avoir reset)
  resetdata = function (): void {
    // this.currentUser= new User('',0,0)//utile ?
    localStorage.clear()
    this.routingService.goToLogin()
    // this.createFirstData() //utile ?
  }




  //#######################################
  //#           HTTP SERVICE              #
  //#######################################
  //Création de ce service au sein de StoreService afin d'éviter les problèmes de dépendance circulaire

  //UTILE ?? -> PEUT ETRE POUR UNE FUTURE REQUETE POST
  private optionRequete = {
    headers: new HttpHeaders({
      'Access-Control-Allow-Origin': 'http://localhost:4200', //http://localhost:4200/service/results/
      // 'mon-entete-personnalisee': 'maValeur'
    }) 
  };

  //Permet de récupérer les résultats sous this.console.log("http firts")forme de liste de User
  getResults(): Observable<User[]> {
    return this.http.get<User[]>('http://localhost:3000/service/results')
    // la on doit subscribe lors de chaque appel de cette fonction dans les différents composants
    // OU .toPromise() ici et await lors de l'appel dans les composants ( mais pas les propriétés des observables si on choisit cette solution)
  }

  //Ajoute ou met à jour currentUser à la BDD suite à une victoire
  addResult() { //avant c'était de type :void
    return this.http.get<string>(`http://localhost:3000/service/addresult/${this.currentUser.username}/${this.currentUser.score}/${this.currentUser.victories}`, this.optionRequete)
  }
  
  // Récupère l'ancien score réalisé par le user
  // getLatestScore(username: string): Observable<number> {
  //   return this.http.get<number>(`http://localhost:3000/service/getlatestscore/${username}`)
  // }

  // Récupère le nb de victoires réalisées par le user
  getVictories(username: string): Observable<number> {
    return this.http.get<number>(`http://localhost:3000/service/getVictories/${username}`)
  }

  isNewUser(username: string): Observable<boolean> {
    return this.http.get<boolean>(`http://localhost:3000/service/results/isnewuser/${username}`)
  }





  // ############################
  // # FONCTIONS ANNEXES (USER) #
  // ############################


  createCurrentUser(username: string): void {
    //Test existence username utilisateur pour récupérer les victoires précédentes (désormais la BDD existe dans tous les cas)
    this.isNewUser(username).subscribe(res => {
      if (res) {
        const victories = 0
        //Instantiation des données utilisateur pour la partie
        this.currentUser = new User(username, 0, victories)
        this.userSubject.next(this.currentUser)
        console.log("Bienvenue "+ username)
        return
      }
      else {
        this.getVictories(username).subscribe(res => {
          const victories = res
          this.currentUser = new User(username, 0, victories)
          this.userSubject.next(this.currentUser)
          console.log("Bon retour parmis nous "+ username)
          return
        })
      }
    })
  }

  //Teste l'existence d'un array (ici de la bdd)
  // UPDATE -> IL FAUT METTRE UNE FONCTION QUI ATTEND L'AJOUT DE CURRENTUSER À LA BDD
  // ifTabExist(tabDonnees): boolean {
  //   if (tabDonnees !== null) {
  //     return true
  //   }
  //   else {
  //     return false
  //   }
  // }

  //Augmente le score de CurrentUser
  scoreUp() {
    this.currentUser.score++
    this.userSubject.next(this.currentUser)
  }

  // Augmente le nombre de victoire de CurrentUser
  victoriesUp(): void {
    this.currentUser.victories++
    this.userSubject.next(this.currentUser)
    //La maj de la BDD sera réalisée lors de l'ajout du résultat final (=en parallèle)
  }

}




    //////////////////////////////////////////////////////////
   //                                                      //
  //  ECHANGE DONNEES AVEC STOCKAGE LOCAL (LOCAL STORAGE) //  
 //                                                      //
//////////////////////////////////////////////////////////
//Code à conserver pour exemple utilisation local storage


// //Récupère la BDD
// getData=function():User[]{
//   //Récupération de l'objet ({'monTableau', JSON.stringify(tabDonnees)})
//   let tabDonneesString:string = localStorage.getItem('monTableau') || '[]';
//   let tabDonnees: User[] =JSON.parse(tabDonneesString)
//   return tabDonnees
// }

// //Ajoute currentUser à la BDD suite à une victoire
// addData (username:string, score:number, victories:number ):void{
//   this.httpService.getResults()
//     tabDonnees.push({username,score,victories});
//     //Suppression de la mémoire locale avant réinsertion
//     localStorage.clear();
//     //Stockage d'un objet supplémentaire dans tabDonnees
//     localStorage.setItem('monTableau', JSON.stringify(tabDonnees));
//     return;
//   }

//   //Cette fonction devrait être appellee par un utilisateur admin (ne pas raffraichir la page après avoir reset)
//   resetdata= function():void{
//     // this.currentUser= new User('',0,0)//utile ?
//     localStorage.clear()
//     this.routingService.goToLogin()
//     // this.createFirstData() //utile ?
//   }

//   /**
//    *  FONCTIONS ANNEXES (USER)
//    */

//   createNewUser(customerData){
//         //Test existence username utilisateur pour récupérer les victoires précédentes (désormais la BDD existe dans tous les cas)
//         //Instantiation des données utilisateur pour la partie
//     let victories = this.getVictories(customerData)
//     this.currentUser=new User(customerData,0,victories)
//   // console.log(this.currentUser)
//     this.userSubject.next(this.currentUser)
//   }

//   //Teste si nouvel utilisateur
//   isNewUser(username:string): boolean{
//     let tabDonnees=this.httpService.getResults()
//     // Username pas dans la bdd ?
//     for (let i:number = 0; i < tabDonnees.length; i++) {
//       //On teste si le username apparait dans la BDD
//       if (tabDonnees[i].username===username){
//         return false
//       }   
//     }
//     return true
//   }

//   //Sert juste à retrouver le nb de victoires plus tard dans getVictories
//   indexUser(username:string):number{
//     let tabDonnees=this.httpService.getResults()
//     if (!this.isNewUser(username)){
//       for (let index:number = 0; index < tabDonnees.length; index++) {
//         if (tabDonnees[index].username===username){
//           return index
//         }   
//       }
//     }
//     console.log("gros problème indexUser")
//     return (-1)
//   }


//   //Teste l'existence d'un array (ici de la bdd)
//   // Pas utile si tjr array vide au moins
//   ifTabExist(tabDonnees):boolean{
//     if(tabDonnees !==null){
//       return true
//     }
//     else{
//       return false
//     }
//   }

//   // Récupère le nombre de  victoires pour un username
//   getVictories(username:string):number{
//     let tabDonnees=this.httpService.getResults()
//     if (this.isNewUser(username)){
//                   //Cette fonction n'est pas appellée dans le login dans le cas d'un newUser (victoires automatiquement instancié à 0)
//                   // Appelée suite à une victoire -> donc return 1
//         // Dans le cas d'une fonction générique (générale) on met return 0 ( peut etre appellé lors de l'initialisation désormais )
//       return 0
//     }
//     else{
//       let indexUser = this.indexUser(username)
//       for (let i:number = 0; i < tabDonnees.length; i++) {
//         if (tabDonnees[i].username===username){
//           return tabDonnees[indexUser].victories
//         }   
//       }
//     }
//     console.log("gros problème get Victories")
//     return (-1)  
//   }
//   //Attention: la fonction récupère les victoires dans la BDD et non pas dans currentUser

//   scoreUp(){
//     this.currentUser.score++
//     this.userSubject.next(this.currentUser)
//   }

//   // Augmente le nombre de victoire d'un utilisateur (pour chacune de ses parties) de 1
//   majVictories(username:string):void{
//     let tabDonnees=this.httpService.getResults()
//     tabDonnees.forEach(donnee => {
//         if (donnee.username===username){
//           donnee.victories+=1
//         }
//       })
//     localStorage.clear()
//     localStorage.setItem('monTableau', JSON.stringify(tabDonnees))
//     //Pour l'affichage top-bar final, on modifie currentUser (même si il ne sera plus utilisé désormais)
//     this.currentUser.victories++
//     this.userSubject.next(this.currentUser)
//   }