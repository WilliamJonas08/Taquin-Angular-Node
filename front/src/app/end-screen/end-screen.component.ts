import { Component, OnInit} from '@angular/core';
import { Store} from 'src/app/services/store.service'
import { User } from '../user';
import { TranslatePipe } from '../pipes/translate.pipe';
import { RoutingService } from '../services/routing.service';



@Component({
  selector: 'app-end-screen',
  templateUrl: './end-screen.component.html',
  styleUrls: ['./end-screen.component.css'],
  providers: [TranslatePipe],
})
export class EndScreenComponent implements OnInit {
  //CurrentUser properties  -> ne sert pas vraiment à grand chose, on pourrait les remplacer par this.store.currentUser
  username: string
  score: number
  victories: number

  public tabDonnees:User[]


  constructor(
    public store: Store,
    private routingService: RoutingService,
    // private http: HttpService,
    ) {
      this.store.getResults().subscribe(res=>{      // PAS DE PB si jamais on récupère pas encore tabDonnées ?
        console.log(res)
        this.tabDonnees = res
      });

    }

  ngOnInit() {
    // Si pas de user -> redirection vers la page de login
    if (!this.store.currentUser){
      this.routingService.goToLogin()
    }
    //subscribes 
    // this.store.userSubject.subscribe((user:User)=> {
    //   this.username=user.username
    //   this.score=user.score
    //   this.victories=user.victories
    // })
    
  }

  rejouer(){
    this.store.createCurrentUser("")
    this.routingService.goToLogin()
  }

}
