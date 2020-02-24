import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Store } from 'src/app/services/store.service'
import { User } from '../user';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(
    private http: HttpClient,
    public store: Store,
    ) { }

  //Permet de récupérer les résultats sous forme de liste de User
  getResults():User[] {
    //Faut il stringifier puis parser ?
    const dataResults = JSON.stringify(this.http.get('/results')); // est-ce la bonne url ? -> est ce que on les récupère tous comme ça ?
    return JSON.parse(dataResults)
  }

  // A appeller lorsque une partie est terminée
  addResult():Observable<Object>{
    if (this.store.isNewUser(this.store.currentUser.username))
      return this.http.post(`/results/${this.store.currentUser.username}`, this.store.currentUser); // est-ce la bonne url ?
    //else (ancien user)
        return this.updateUserResult(this.store.currentUser.username);
  }

  //Mise à jour du résultat d'un joueur déja existant
  updateUserResult(username:string):Observable<Object>{
    const latestScore: number = this.getLatestScore(username) // mettre await ?
    //record battu 
    if (this.store.currentUser.score >= latestScore){
      return this.http.put(`/results/${username}`, this.store.currentUser);
    } 
    //record non battu -> on incrémente de 1 le nombre de victoires
    else{
      return this.http.put(`/results/${username}`, {
        username: username,
        score: latestScore, 
        victories: this.store.currentUser.victories+1, // mettre +1 si le nb de victoires du current user n'a pas déja été incrémenté lors du passage vers le end screen
      });
    }

  }
  // Récupère l'ancien score réalisé par le user
  getLatestScore(username:string):number{
    const results = this.getResults();
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

}