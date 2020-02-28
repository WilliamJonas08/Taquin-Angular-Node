import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Store } from 'src/app/services/store.service'
import { User } from '../user';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  // private store: Store // J'AI PEUR DE NE PAS POUVOIR UTILISER LE STORE
  constructor(
    private http: HttpClient,
    private store: Store,
    ) { }

  try(){
    this.http.get(`http://localhost:3000/service/try`).subscribe(res => {
      console.log(res)
      return res
    })
  }
 
  //Permet de récupérer les résultats sous this.console.log("http firts")forme de liste de User
  getResults():Observable<User[]>{
   return this.http.get<User[]>('http://localhost:3000/service/results')
   // la on doit subscribe lors de chaque appel de cette fonction dans les différents composants
   // OU .toPromise() ici et await lors de l'appel dans les composants ( mais pas les propriétés des observables si on choisit cette solution)
  }

  //Ajoute currentUser à la BDD suite à une victoire
  addResult():void{
    this.isNewUser(this.store.currentUser.username).subscribe(res=>{ 
      if(res){
        return this.http.post<void>(`http://localhost:3000/service/results/${this.store.currentUser.username}`, this.store.currentUser);
      }
      else {  // (ancien user)
        return this.updateUserResult(this.store.currentUser.username);
      }
    })
  }

  //Mise à jour du résultat d'un joueur déja existant (que l'on suppose déja existant (pas de test de sécurité))
  updateUserResult(username:string):void{   
    this.getLatestScore(username).subscribe(res=>{
      const latestScore: number= res 
      //record battu 
      if (this.store.currentUser.score >= latestScore){ // attention on a supposé ici que la victoire a déja été incrémentée dans le currentUser
        // console.log("Case updated successfully (new record:Observable<void>): ")
        return this.http.put<void>(`http://localhost:3000/service/results/${username}`, this.store.currentUser)
      } 
      //record non battu -> on incrémente de 1 le nombre de victoires
      else{
        // console.log("Case updated successfully : ")
        return this.http.put<void>(`http://localhost:3000/service/results/${username}`, {
          username: username,
          score: latestScore, 
          victories: this.store.currentUser.victories, // mettre +1 si le nb de victoires du current user n'a pas déja été incrémenté lors du passage vers le end screen
        })
      }
    })
  }

  // Récupère l'ancien score réalisé par le user
  getLatestScore(username:string):Observable<number>{
    return this.http.get<number>(`http://localhost:3000/service/getlatestscore/${username}`)
  }

  // Récupère le nb de victoires réalisées par le user
  /**
   * TESTER EXISTENCE DE USER EN AMONT SVP
   */
  getVictories(username:string):Observable<number>{
    return this.http.get<number>(`http://localhost:3000/service/getVictories/${username}`)
  }

  isNewUser(username:string):Observable<boolean>{ 
    return this.http.get<boolean>(`http://localhost:3000/service/results/isnewuser/${username}`) //.subscribe(res=>{
    //   return res
    // })
  }
}