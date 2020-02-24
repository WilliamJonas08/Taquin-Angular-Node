import { Injectable } from '@angular/core';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class RoutingService {

  constructor(
    private router: Router,
  ) { }

  goToLogin(){
    this.router.navigate(['/']);
  }

  goToPlay():void{
    this.router.navigate(['/play']);
  }

  goToEnd():void{
    this.router.navigate(['/end']);
  }
}
