import { TestBed, inject } from '@angular/core/testing';

import { RevenuereportsService } from './revenuereports.service';

describe('RevenuereportsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RevenuereportsService]
    });
  });

  it('should be created', inject([RevenuereportsService], (service: RevenuereportsService) => {
    expect(service).toBeTruthy();
  }));
});
