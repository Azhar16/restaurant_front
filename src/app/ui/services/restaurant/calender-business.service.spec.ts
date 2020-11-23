import { TestBed, inject } from '@angular/core/testing';

import { CalenderBusinessService } from './calender-business.service';

describe('CalenderBusinessService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CalenderBusinessService]
    });
  });

  it('should be created', inject([CalenderBusinessService], (service: CalenderBusinessService) => {
    expect(service).toBeTruthy();
  }));
});
