import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { AngularFireModule } from 'angularfire2';
import { environment } from '../environments/environment';
import { ButtonComponent } from './button/button.component';
import { MatchmakingComponent } from './matchmaking/matchmaking.component';
import { RouterModule, Routes } from '@angular/router';

const appRoutes: Routes = [
  { path: 'button', component: ButtonComponent },
  { path: 'matchmaking', component: MatchmakingComponent },
];

@NgModule({
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes),
    AngularFireModule.initializeApp(environment.firebase, 'HangMan')
  ],
  declarations: [AppComponent, ButtonComponent, MatchmakingComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }


