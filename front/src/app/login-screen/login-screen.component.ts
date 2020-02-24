import { Component, OnInit} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Store } from 'src/app/services/store.service'
import { User } from '../user';
import { RoutingService } from '../services/routing.service';

// import { newGame } from '../user-observable';


@Component({
  selector: 'app-login-screen',
  templateUrl: './login-screen.component.html',
  styleUrls: ['./login-screen.component.css']
})
export class LoginScreenComponent implements OnInit{
  //Pas besoin d'interactions dynamiques avec le User sur cette page

  checkoutForm : FormGroup

  constructor(
    public store: Store,
    private formBuilder: FormBuilder, 
    private routingService: RoutingService,
    // private newGame:newGame,
    ) {
      this.checkoutForm = this.formBuilder.group({
        name: '',
      })
      // this.submit=false;
    }

    ngOnInit() {
      //subscribes
      // this.newGame.usernameObservable.subscribe(this.newGame.usernameObserver)
      // this.newGame.scoreObservable.subscribe(this.newGame.scoreObserver)
      // this.newGame.victoriesObservable.subscribe(this.newGame.victoriesObserver)
    }

  onSubmit(customerData:string):void {
      // //On importe la BDD ou un array vide en cas d'absence de BDD
      // let tabDonnees:User[] = this.store.getData(); // UTILE ??

    this.store.createNewUser(customerData)
    this.routingService.goToPlay()
  }

}