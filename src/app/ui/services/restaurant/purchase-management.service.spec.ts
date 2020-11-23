import { TestBed, inject } from '@angular/core/testing';

import { PurchaseManagementService } from './purchase-management.service';

describe('PurchaseManagementService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PurchaseManagementService]
    });
  });

  it('should be created', inject([PurchaseManagementService], (service: PurchaseManagementService) => {
    expect(service).toBeTruthy();
  }));
});
