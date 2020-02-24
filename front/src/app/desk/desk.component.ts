import { Component, OnInit} from '@angular/core';
import { Piece } from '../piece';
import { Store } from 'src/app/services/store.service'; //on ajoute la donnée au service TransefertData (BDD interne)
// import { RouterModule, Routes, Router } from '@angular/router';        //ROUTER
// import { Subject } from 'rxjs';
import { RoutingService } from '../services/routing.service';

// import { newGame } from '../user-observable';

@Component({
  selector: 'app-desk',
  templateUrl: './desk.component copy.html',
  styleUrls: ['./desk.component copy.css']
})
export class DeskComponent implements OnInit {
  //CurrentUser properties -> JE NE SAIS PAS À QUOI ILS SERVENT SUR CE COMPOSANT
  username: string
  score: number
  victories: number
  
  idNoir: number;
  victoire : boolean = false; // Permet de définir quand arreter de prendre en compte les clicks sur le plateau
  pieces: Piece[];
  //L'index de chaque composant dans l'array définit sa position dans la grille
  //L'identifiant de chaque objet de l'array définit également la position du composant dans la grille et est égal à l'index (mis à jour à chaque déplacement d'objet)
  //  REMARQUE : On pourrait éventuellement supprimer la propriété id d'un objet de type piece. On pourrait peut être chercher à réévaluer sa position dans la grille "pieces" à chaque tentative de mouvement.
  //tab.foundIndex()

  constructor(
    public store: Store,
    private routingService: RoutingService,
    // private newGame: newGame,
    ) { 
    // this.init()
  }

  ngOnInit() {
    // Si pas de user -> redirection vers la page de login
    if (this.store.currentUser === undefined){
      this.routingService.goToLogin()
    }
    //subscribes 
    this.store.userSubject.subscribe((user)=> {
    this.username=user.username
    this.score=user.score
    this.victories=user.victories
    })
    //initialisation du jeu: mélange (contient la fonction init)
    this.melange()
  }

  init(){
    this.pieces = [];
    for (let i = 0; i < 9; i++) {
      this.pieces.push(new Piece(i));
    }
    this.idNoir = 8;
    this.victoire=false; // Voire implementations
    console.log(this.store.currentUser)
    console.log(this.store.currentUser.score)
    this.store.currentUser.score=0
    this.store.userSubject.next(this.store.currentUser)
    this.store.message =""
  }

/**
 *  MOUVEMENT
 */

mouvement(id:number):void{
  if (this.victoire===false){
    const idNoir=this.idNoir
    this.store.message=""

    if ((id !== idNoir)&&(
       (id==idNoir+3 || id==idNoir-3) //click sur case de ligne supérieure ou inférieure
    || ((id==0||id==3||id==6)&&(id==idNoir-1)) //click sur case de colonne de gauche
    || ((id==2||id==5||id==8)&&(id==idNoir+1)) //click sur case de colonne de droite
    || ((id==1||id==4||id==7)&&(id==idNoir+1||id==idNoir-1)) //click sur case de colonne centrale
    )){
      this.idNoir=id
      this.echange(id,idNoir)
      this.store.scoreUp()  
      this.testVictoire() //Si cette fct est appellée uniquement ici, il pourrait être judicieux de la développer ici
      return   
      //permet de sortir de la fonction (=break pour loops)   
      //permet d'éviter "deplacementEffectue" -> il faudrait alors déplacer l'appel de test victoire
    }
    if (id==idNoir){
      this.store.message="Il faut cliquer sur une case à coté pour que ça bouge"
      return 
    }
    else{
      this.store.message="Ce mouvement est impossible";
      console.log("wrong move")
      return
    }
  }
}

/**
 *  ÉCHANGE DANS ARRAY
 */


echange(id1:number,id2:number):void{
  //On échange juste les images 
  // 1- On échange les positions dans le array pieces
  const a :Piece =this.pieces[id1] ;
  const b :Piece = this.pieces[id2];
  this.pieces[id2]=a;
  this.pieces[id1]=b;
  // 2- On replace ensuite les id dans le bon ordre (afin que l'id soit associé à une position dans le tableau et non pas à une image) 
  // -> POINT DIFFICILE à comprendre (faire schéma papier)
  this.pieces[id2].id=id2;       
  this.pieces[id1].id=id1;       
}

/**
 *  TEST VICTOIRE
 */

testVictoire():void {
  let counter: number = 0;
  for (let i = 0; i < this.pieces.length; i++) {
    if (this.pieces[i].id==this.pieces[i].finalPlace){
      counter++;
    }
  }
  if (counter==this.pieces.length){ //on teste si tous les id sont égaux aux finalPlace ( dans ce cas tous les piece sont à leur place finale = dans l'ordre)
    this.pieces[8].imageUrl="/assets/"+10+".jpg";
    this.store.message="FÉLICITATIONS"
    this.victoire= true

    this.username=this.store.currentUser.username
    this.score=this.store.currentUser.score
    this.victories=this.store.currentUser.victories

    //Maj BDD avec données CurrentUser et maj victoires de chacune des parties de cet user
    this.store.addData(this.username,this.score,this.victories)
    this.store.majVictories(this.store.currentUser.username)  //Augmente de 1 le nb de victoire de l'utilisateur ( pour toutes ses parties)
    // JE NE SAIS PAS SI C'EST UTILE PUISQUE ON CHANGE DE PAGE LORSQUE VICTOIRE...  
    setTimeout(()=>{this.routingService.goToEnd()},1500)   //Redirection vers end screen avec petit délais
  } 
}

/**
 *  MÉLANGE -> Va devenir la fonction INIT
 * voir pour recommenter
 */

  melange(): void{
    this.init() //On reconstruit DeskComponent (surtout pieces mais idNoir doit être remis à 8 sinon problème)

  //On peut sélectionner uniquement les 8 premières cases à mélanger car, en ayant reconstruit pieces, les cases sont dans l'ordre (on veut la case noire en bas a droite)
    let piecesReduit : Piece[] = this.pieces.slice(0, this.pieces.length-1)     // contient les 8 cases en question ("case"=objet associé)
    //On va maintenant réattribuer la cohérence entre index dans "pieces" et l'id de chaque objet
    this.shuffleArray(piecesReduit)
    for (let i = 0; i < piecesReduit.length; i++) {
      piecesReduit[i].id=i;
    }
    //On redéfinit pieces et on rajoute la case noire
    this.pieces = piecesReduit
    this.pieces.push(new Piece(8))
  }

  //Fonction du net pour shuffle
  shuffleArray(array: any[]) {
    var m = array.length, t, i;
    // While there remain elements to shuffle
    while (m) {
      // Pick a remaining element…
      i = Math.floor(Math.random() * m--);
      // And swap it with the current element.
      t = array[m];
      array[m] = array[i];
      array[i] = t;
    }
    return array;
  }

/**
 *  TRICHER
 */

  tricher(){
    this.init()
    this.idNoir=7
    this.store.message=""
    this.echange(7,8)
  }

}
