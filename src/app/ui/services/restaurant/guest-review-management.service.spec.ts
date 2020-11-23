import { TestBed, inject } from '@angular/core/testing';

import { GuestReviewManagementService } from './guest-review-management.service';

describe('GuestReviewManagementService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GuestReviewManagementService]
    });
  });

  it('should be created', inject([GuestReviewManagementService], (service: GuestReviewManagementService) => {
    expect(service).toBeTruthy();
  }));
});
