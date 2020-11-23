import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { PerfectScrollbarConfigInterface, PerfectScrollbarComponent } from 'ngx-perfect-scrollbar';

import { AdminService } from '../../../services/admin.service';
import { ConfirmPopupComponent } from '../../../../shared/components/confirm.popup.component';

@Component({
    selector: 'app-admin-phone-extension-plan',
    templateUrl: './admin.phone.extension.component.html'
})
export class AdminPhoneExtensionComponent implements OnInit {
    modalRef: BsModalRef;
    alertMessageDetails = {
        response: false,
        type: null,
        message: null
    };
    intercomList: any;
    public config: PerfectScrollbarConfigInterface = {};
    public scrollBarContainerHeight: number;

    constructor(
        private modalService: BsModalService,
        private _adminData: AdminService
    ) { }

    ngOnInit() {
        let headerBuffer = 65;
        this.scrollBarContainerHeight = $(document).height() - ($("#main-navbar").outerHeight() + $("#sub-navbar").outerHeight() + $("#footerButtonContainer").outerHeight() + $("#pageHeading").outerHeight() + headerBuffer + 155);
        //console.log("in ng on in it: ", $(document).height(), $("#main-navbar").outerHeight(), $("#sub-navbar").outerHeight(), $("#footerButtonContainer").outerHeight(), $("#pageHeading").outerHeight(), headerBuffer, this.scrollBarContainerHeight);      
        this.getIntercomList();
    }

    public getIntercomList() {
        this.intercomList = [
            {
                id: 1,
                roomNumber: '101',
                extension: '101',
                editable: false,
            },
            {
                id: 2,
                roomNumber: '201',
                extension: '201',
                editable: false,
            },
            {
                id: 3,
                roomNumber: '301',
                extension: '301',
                editable: false,
            },
            
        ];
    }
}