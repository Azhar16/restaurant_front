import { TestBed, inject } from '@angular/core/testing';

import { CloseCounterService } from './close-counter.service';

describe('CloseCounterService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CloseCounterService]
    });
  });

  it('should be created', inject([CloseCounterService], (service: CloseCounterService) => {
    expect(service).toBeTruthy();
  }));
});
