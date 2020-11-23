import { TestBed, inject } from '@angular/core/testing';

import { OrderreportsService } from './orderreports.service';

describe('OrderreportsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OrderreportsService]
    });
  });

  it('should be created', inject([OrderreportsService], (service: OrderreportsService) => {
    expect(service).toBeTruthy();
  }));
});
