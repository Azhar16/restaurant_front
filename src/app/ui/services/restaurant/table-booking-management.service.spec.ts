import { TestBed, inject } from '@angular/core/testing';

import { TableBookingManagementService } from './table-booking-management.service';

describe('TableBookingManagementService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TableBookingManagementService]
    });
  });

  it('should be created', inject([TableBookingManagementService], (service: TableBookingManagementService) => {
    expect(service).toBeTruthy();
  }));
});
