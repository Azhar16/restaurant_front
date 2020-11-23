import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { PerfectScrollbarConfigInterface, PerfectScrollbarComponent } from 'ngx-perfect-scrollbar';

import { AdminNoShowPolicyService } from '../policy-manager/no-show-policy/admin.no.show.policy.service';

@Component({
  templateUrl: './admin.hqfund.manager.component.html'
})
export class HQFundManagerComponent implements OnInit {

  public scrollBarContainerHeight: number;
  public showAddHqManagerRow: boolean;

  public alertMessageDetails = {
    response: false,
    type: null,
    message: null
  };

  constructor(
    private _adminData: AdminNoShowPolicyService
  ) {
  }

  ngOnInit() {
    let headerBuffer = 60;
    this.scrollBarContainerHeight = $(document).height() - ($("#main-navbar").outerHeight() + $("#sub-navbar").outerHeight() + $("#footerButtonContainer").outerHeight() + $("#pageHeading").outerHeight() + headerBuffer + 155);
    //console.log("in ng on in it: ", $(document).height(), $("#main-navbar").outerHeight(), $("#sub-navbar").outerHeight(), $("#footerButtonContainer").outerHeight(), $("#pageHeading").outerHeight(), headerBuffer, this.scrollBarContainerHeight);      
    this.showAddHqManagerRow = false;
  }
}