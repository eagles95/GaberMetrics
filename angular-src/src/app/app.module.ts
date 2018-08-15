import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { ScoresComponent } from './components/scores/scores.component';
import { StandingsComponent } from './components/standings/standings.component';
import { RequestGamesService } from './services/request-games.service';
import { HttpClientModule } from '@angular/common/http';
import { GameComponent } from './components/game/game.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    ScoresComponent,
    StandingsComponent,
    GameComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule
  ],
  providers: [RequestGamesService],
  bootstrap: [AppComponent]
})
export class AppModule { }
