import { NgModule } from '@angular/core';
import { RouterModule, Routes, Router} from '@angular/router';      //Router
import { DeskComponent } from './desk/desk.component';
import { EndScreenComponent } from './end-screen/end-screen.component';
import { LoginScreenComponent } from './login-screen/login-screen.component';
//QUESTION : Nécessité d'importer le module Location ?


const routes: Routes = [
  { path: 'login', component: LoginScreenComponent },
  { path: 'play', component: DeskComponent },
  { path: 'end', component: EndScreenComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' }, //pathMatch ??
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
  ],
  exports: [
    RouterModule,
  ]
})

// @NgModule({
//   imports: [Router],
//   exports: [Router]        //Export Router // Quand ce ngModule est défini, rooter-outlet ne l'est plus :'( 
// })

export class AppRoutingModule { }
