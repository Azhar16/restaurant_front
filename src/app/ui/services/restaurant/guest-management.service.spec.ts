import { TestBed, inject } from '@angular/core/testing';

import { GuestManagementService } from './guest-management.service';

describe('GuestManagementService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GuestManagementService]
    });
  });

  it('should be created', inject([GuestManagementService], (service: GuestManagementService) => {
    expect(service).toBeTruthy();
  }));
});
