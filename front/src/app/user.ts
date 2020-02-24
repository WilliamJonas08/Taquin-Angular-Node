export class User {
    //Classe inutile apparemment :'( 
    username: string;
    score: number;
    victories : number;

    constructor(username:string, score:number, victories:number){
        this.username= username
        this.score = score
        this.victories = victories
    }
  }