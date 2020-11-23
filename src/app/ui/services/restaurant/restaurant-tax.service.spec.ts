import { TestBed, inject } from '@angular/core/testing';

import { RestaurantTaxService } from './restaurant-tax.service';

describe('RestaurantTaxService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RestaurantTaxService]
    });
  });

  it('should be created', inject([RestaurantTaxService], (service: RestaurantTaxService) => {
    expect(service).toBeTruthy();
  }));
});
