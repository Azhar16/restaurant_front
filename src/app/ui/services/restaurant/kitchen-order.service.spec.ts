import { TestBed, inject } from '@angular/core/testing';

import { KitchenOrderService } from './kitchen-order.service';

describe('KitchenOrderService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [KitchenOrderService]
    });
  });

  it('should be created', inject([KitchenOrderService], (service: KitchenOrderService) => {
    expect(service).toBeTruthy();
  }));
});
