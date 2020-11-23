import { TestBed, inject } from '@angular/core/testing';

import { PrimaryCategoryFoodService } from './primary-category-food.service';

describe('PrimaryCategoryFoodService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PrimaryCategoryFoodService]
    });
  });

  it('should be created', inject([PrimaryCategoryFoodService], (service: PrimaryCategoryFoodService) => {
    expect(service).toBeTruthy();
  }));
});
