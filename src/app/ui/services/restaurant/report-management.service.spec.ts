import { TestBed, inject } from '@angular/core/testing';

import { ReportManagementService } from './report-management.service';

describe('ReportManagementService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ReportManagementService]
    });
  });

  it('should be created', inject([ReportManagementService], (service: ReportManagementService) => {
    expect(service).toBeTruthy();
  }));
});
