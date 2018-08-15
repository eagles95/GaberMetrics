import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class RequestGamesService {

  constructor(private http: HttpClient) { }
  url = "/api/games"
  getGames() {
    return this.http.get(this.url);
  }
}
