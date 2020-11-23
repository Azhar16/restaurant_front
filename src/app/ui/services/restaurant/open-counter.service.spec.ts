import { TestBed, inject } from '@angular/core/testing';

import { OpenCounterService } from './open-counter.service';

describe('OpenCounterService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OpenCounterService]
    });
  });

  it('should be created', inject([OpenCounterService], (service: OpenCounterService) => {
    expect(service).toBeTruthy();
  }));
});
