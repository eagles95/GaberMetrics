import { TestBed, inject } from '@angular/core/testing';

import { RequestGamesService } from './request-games.service';

describe('RequestGamesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RequestGamesService]
    });
  });

  it('should be created', inject([RequestGamesService], (service: RequestGamesService) => {
    expect(service).toBeTruthy();
  }));
});
