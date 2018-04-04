import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { AngularFireModule } from 'angularfire2';
import { environment } from '../environments/environment';
import { ButtonComponent } from './button/button.component';
import { MatchmakingComponent } from './matchmaking/matchmaking.component';
import { RouterModule, Routes } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { LogoHeadComponent } from './logo-head/logo-head.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { AngularFirestoreModule } from 'angularfire2/firestore';

import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { KeyboardComponent } from './keyboard/keyboard.component';



const appRoutes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'button', component: ButtonComponent },
  { path: 'matchmaking', component: MatchmakingComponent },
  { path: 'login', component: LoginComponent },

];

@NgModule({
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes),
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
  ],
  declarations: [AppComponent, ButtonComponent,
    MatchmakingComponent, HeaderComponent,
    LogoHeadComponent, LoginComponent,
    HomeComponent, KeyboardComponent],
  bootstrap: [AppComponent],
  providers: [AngularFireAuth]
})
export class AppModule { }


