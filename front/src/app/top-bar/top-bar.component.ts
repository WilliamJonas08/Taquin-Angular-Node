import { Component, OnInit } from '@angular/core';
import { Store } from 'src/app/services/store.service'
import { User } from '../user';


// import { User } from '../user';
// import { newGame } from '../user-observable';

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.css']
})
export class TopBarComponent implements OnInit {
  //CurrentUser properties
  username: string
  score: number
  victories: number

  title: string = 'Taquin Angular chez Rofim';

  constructor(
    public store: Store,
    // private newGame: newGame,
  ) {}

  ngOnInit() {
    //subscribes 
    this.store.userSubject.subscribe((user:User)=> {
      this.username=user.username
      this.score=user.score
      this.victories=user.victories
    })       
  }

}
