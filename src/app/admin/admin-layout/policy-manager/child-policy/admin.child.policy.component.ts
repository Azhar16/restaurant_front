import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { PerfectScrollbarConfigInterface, PerfectScrollbarComponent } from 'ngx-perfect-scrollbar';

import { AdminChildPolicyService } from './admin.child.policy.service';
import { ConfirmPopupComponent } from '../../../../shared/components/confirm.popup.component';
import { IChildPolicy } from './ChildPolicy';

@Component({
    selector: 'app-admin-layout-child-policy',
    templateUrl: './admin.child.policy.component.html'
})
export class AdminChildPolicyComponent implements OnInit {
    modalRef: BsModalRef;
    alertMessageDetails = {
        response: false,
        type: null,
        message: null
    };

    public config: PerfectScrollbarConfigInterface = {};
    public scrollBarContainerHeight: number;
    public monthList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
    public yearList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17];

    public allChildPolicyCkbox: boolean;
    public childPolicyList: IChildPolicy[];
    public showAddChildPolicyRow: boolean;
    public newChildPolicy: IChildPolicy;

    constructor(
        private modalService: BsModalService,
        private _adminData: AdminChildPolicyService
    ) { }

    ngOnInit() {
        let headerBuffer = 60;
        this.scrollBarContainerHeight = $(document).height() - ($("#main-navbar").outerHeight() + $("#sub-navbar").outerHeight() + $("#footerButtonContainer").outerHeight() + $("#pageHeading").outerHeight() + headerBuffer + 155);
        //console.log("in ng on in it: ", $(document).height(), $("#main-navbar").outerHeight(), $("#sub-navbar").outerHeight(), $("#footerButtonContainer").outerHeight(), $("#pageHeading").outerHeight(), headerBuffer, this.scrollBarContainerHeight);      
        this.showAddChildPolicyRow = false;
        this.getChildPolicyList();
    }

    public getChildPolicyList() {

        this._adminData.getDataList('Config/Policy/getChildPolicy/', 'childPolicies').subscribe(childPolicyRes => {
            console.log("childPolicyList: ", childPolicyRes);
            this.childPolicyList = childPolicyRes;
        });
    }

    /*public selectChildPolicyCKBStatus(ckBoxType: any) {
        if (ckBoxType == 'all') {
            for (let i = 0; i < this.childPolicyList.length; i++) {
              this.childPolicyList[i].checked = this.allChildPolicyCkbox;
            }
          } else {
            this.allChildPolicyCkbox = this.childPolicyList.every(childPolicyItem => childPolicyItem.checked);
          }
    }*/

    public onSelectionChange(entryType: string, val: string, indx: number) {
        if (entryType == 'new') {
            this.newChildPolicy.percentageOfBooking = val;
        } else {
            this.childPolicyList[indx].percentageOfBooking = val;
        }
        console.log("in onSelectionChange: ", entryType, val, this.newChildPolicy);
    }

    public createChildPolicy() {
        this.newChildPolicy = {
            charge: null,
            childPolicyName: null,
            maxAge: 1,
            minAge: 1,
            percentageOfBooking: '0'
        }
        this.showAddChildPolicyRow = !this.showAddChildPolicyRow;
    }

    public saveNewChildPolicy() {
        console.log("in save child policy: ", this.newChildPolicy);
        let newChildPolicyItem = {
            childPolicies: [
                this.newChildPolicy
            ]
        };

        this._adminData.addData('Config/Policy/createChildPolicy/', newChildPolicyItem).subscribe(childPolicyRes => {
            this.alertMessageDetails.response = true;
            this.showAddChildPolicyRow = false;
            this.getChildPolicyList();

            if (childPolicyRes['message'].toLowerCase() == 'success') {
                this.alertMessageDetails.type = 'success';
                this.alertMessageDetails.message = "Child policy added successfully";
            } else {
                this.alertMessageDetails.type = 'danger';
                this.alertMessageDetails.message = "Child policy details not added! Please try again.";
            }
            setTimeout(() => {
                this.alertMessageDetails.response = false;
            }, 5000);
        });
    }

    public openConfirmModal(indx: number) {
        this.modalRef = this.modalService.show(ConfirmPopupComponent);
        this.modalRef.content.title = 'Are you sure to delete?';
        this.modalRef.content.event.subscribe(data => {
            this.modalRef.hide();
            if (data.confirm == true) {
                this._adminData.removeData(
                    'Config/Policy/removeChildPolicy/',
                    {
                        dataID: this.childPolicyList[indx].childPolicyId
                    }
                ).subscribe(res => {
                    this.alertMessageDetails.response = true;
                    if (res['message'].toLowerCase() == 'success') {
                        this.childPolicyList.splice(indx, 1);
                        this.alertMessageDetails.type = 'success';
                        this.alertMessageDetails.message = "Child policy deleted successfully";
                    } else {
                        this.alertMessageDetails.type = 'danger';
                        this.alertMessageDetails.message = "Child policy not deleted! Please try again.";
                    }

                    setTimeout(() => {
                        this.alertMessageDetails.response = false;
                    }, 5000);
                });
            } else {
                console.log('dont go for delete: ', this.childPolicyList[indx]);
            }
        });
    }
}