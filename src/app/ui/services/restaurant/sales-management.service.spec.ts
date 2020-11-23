import { TestBed, inject } from '@angular/core/testing';

import { SalesManagementService } from './sales-management.service';

describe('SalesManagementService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SalesManagementService]
    });
  });

  it('should be created', inject([SalesManagementService], (service: SalesManagementService) => {
    expect(service).toBeTruthy();
  }));
});
