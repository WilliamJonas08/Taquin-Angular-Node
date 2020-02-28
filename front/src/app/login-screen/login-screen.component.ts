import { Component, OnInit} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Store} from 'src/app/services/store.service'
import { RoutingService } from '../services/routing.service';
import { User } from '../user';
// import { TestBed } from '@angular/core/testing';

@Component({
  selector: 'app-login-screen',
  templateUrl: './login-screen.component.html',
  styleUrls: ['./login-screen.component.css']
})
export class LoginScreenComponent implements OnInit{
  checkoutForm : FormGroup

  constructor(
    public store: Store, 
    private formBuilder: FormBuilder, 
    private routingService: RoutingService,
    ) {
      this.checkoutForm = this.formBuilder.group({
        name: '',
      })
    }

    ngOnInit() {
      this.store.currentUser= new User ("", 0,0)
    }

  onSubmit(username:string):void {
    if (username==""){
      this.routingService.goToLogin()
      console.log("Merci de chosir un nom d'utilisateur valide")
      return
    }
    this.store.createCurrentUser(username)
    setTimeout(()=>{this.routingService.goToPlay()},1500) // Je ne sais pas comment faire pour retarder lexécution de la redirection vers Play (le temps de créer le CurrentUser)
  }

}