import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { PerfectScrollbarConfigInterface, PerfectScrollbarComponent } from 'ngx-perfect-scrollbar';

import { AdminPolicyService } from '../../../services/admin.policy.service';
import { ConfirmPopupComponent } from '../../../../shared/components/confirm.popup.component';
import { ICheckInOutPolicy } from './CheckInOutPolicy';

@Component({
    selector: 'app-admin-layout-checkin-chekout-policy',
    templateUrl: './admin.checkin.checkout.policy.component.html'
})
export class AdminCheckinCheckoutPolicyComponent implements OnInit {
    modalRef: BsModalRef;
    alertMessageDetails = {
        response: false,
        type: null,
        message: null
    };
    public checkInCheckOutPolicyList: ICheckInOutPolicy[];
    public newCheckInOutPolicyObj: ICheckInOutPolicy;
    public config: PerfectScrollbarConfigInterface = {};
    public scrollBarContainerHeight: number;

    constructor(
        private modalService: BsModalService,
        private _adminData: AdminPolicyService
    ) { }

    ngOnInit() {
        let headerBuffer = 60;
        this.scrollBarContainerHeight = $(document).height() - ($("#main-navbar").outerHeight() + $("#sub-navbar").outerHeight() + $("#footerButtonContainer").outerHeight() + $("#pageHeading").outerHeight() + headerBuffer + 155);
        //console.log("in ng on in it: ", $(document).height(), $("#main-navbar").outerHeight(), $("#sub-navbar").outerHeight(), $("#footerButtonContainer").outerHeight(), $("#pageHeading").outerHeight(), headerBuffer, this.scrollBarContainerHeight);      
        this.getCiCoPolicyList();
    }

    public getCiCoPolicyList() {        
        this._adminData.getCheckInCheckOutPolicyList().subscribe(checkInOutPolicyRes => {
            console.log("checkINOutPolicyRes: ", checkInOutPolicyRes);
            this.checkInCheckOutPolicyList = checkInOutPolicyRes;
        });
    }
}