import { Component, OnInit } from '@angular/core';
import { RequestGamesService } from '../../services/request-games.service'


@Component({
  selector: 'app-scores',
  templateUrl: './scores.component.html',
  styleUrls: ['./scores.component.css']
})
export class ScoresComponent implements OnInit {
  public data = {};
  constructor(private _gamesService: RequestGamesService) { }

  ngOnInit() {
    this.data = this._gamesService.getGames()
      .subscribe(gameData => {
        console.log(gameData);
        this.data = gameData;
      });
  }
}
