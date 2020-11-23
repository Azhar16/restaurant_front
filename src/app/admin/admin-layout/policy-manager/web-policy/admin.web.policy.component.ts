import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { PerfectScrollbarConfigInterface, PerfectScrollbarComponent } from 'ngx-perfect-scrollbar';

import { AdminWebPolicyService } from './admin.web.policy.service';
import { ConfirmPopupComponent } from '../../../../shared/components/confirm.popup.component';

@Component({
    selector: 'app-admin-layout-web-policy',
    templateUrl: './admin.web.policy.component.html'
})
export class AdminWebPolicyComponent implements OnInit {
    modalRef: BsModalRef;
    alertMessageDetails = {
        response: false,
        type: null,
        message: null
    };
    webPolicyList:any;
    public config: PerfectScrollbarConfigInterface = {};
    public scrollBarContainerHeight: number;

    constructor(
        private modalService: BsModalService,
        private _adminData: AdminWebPolicyService
    ) { }

    ngOnInit() {
        let headerBuffer = 60;
        this.scrollBarContainerHeight = $(document).height() - ($("#main-navbar").outerHeight() + $("#sub-navbar").outerHeight() + $("#footerButtonContainer").outerHeight() + $("#pageHeading").outerHeight() + headerBuffer + 155);
        //console.log("in ng on in it: ", $(document).height(), $("#main-navbar").outerHeight(), $("#sub-navbar").outerHeight(), $("#footerButtonContainer").outerHeight(), $("#pageHeading").outerHeight(), headerBuffer, this.scrollBarContainerHeight);      
        this.getWebPolicyList();
    }

    public getWebPolicyList() {
        this.webPolicyList = [
            {
                id: 1,
                name: 'Deposits',
                isApplied: true,
                description: 'Deposits',
                charge: 100,
                percent: false,
                editable: false,
            },
            {
                id: 2,
                name: 'As Per Booking Policy',
                isApplied: true,
                description: 'As Per Booking Policy',
                charge: 20,
                percent: true,
                editable: false,
            },
            {
                id: 2,
                name: 'Only Nightly Charge',
                isApplied: true,
                description: 'Only Nightly Charge',
                charge: 70,
                percent: true,
                editable: false,
            }
        ];
    }
}