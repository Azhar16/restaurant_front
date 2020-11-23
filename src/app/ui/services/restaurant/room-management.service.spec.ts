import { TestBed, inject } from '@angular/core/testing';

import { RoomManagementService } from './room-management.service';

describe('RoomManagementService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RoomManagementService]
    });
  });

  it('should be created', inject([RoomManagementService], (service: RoomManagementService) => {
    expect(service).toBeTruthy();
  }));
});
