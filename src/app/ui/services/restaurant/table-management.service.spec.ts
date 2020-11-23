import { TestBed, inject } from '@angular/core/testing';

import { TableManagementService } from './table-management.service';

describe('TableManagementService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TableManagementService]
    });
  });

  it('should be created', inject([TableManagementService], (service: TableManagementService) => {
    expect(service).toBeTruthy();
  }));
});
