import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';

import { AdminReportsEmailSetupService } from './admin.reports.email.setup.service';

@Component({
    selector: 'app-admin-report-email-setup',
    templateUrl: './admin.reports.email.setup.component.html'
  })
  export class AdminReportsEmailSetupComponent implements OnInit {
      constructor(
        private modalService: BsModalService,
        private _adminData: AdminReportsEmailSetupService
      ) { }

      ngOnInit() {

      }
  }