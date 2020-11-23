import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { PerfectScrollbarConfigInterface, PerfectScrollbarComponent } from 'ngx-perfect-scrollbar';

import { AdminNoShowPolicyService } from './admin.no.show.policy.service';
import { ConfirmPopupComponent } from '../../../../shared/components/confirm.popup.component';
import { INoShowPolicy } from './NoShowPolicy';

@Component({
    selector: 'app-admin-layout-no-show-policy',
    templateUrl: './admin.no.show.policy.component.html'
})
export class AdminNoShowPolicyComponent implements OnInit {
    modalRef: BsModalRef;
    alertMessageDetails = {
        response: false,
        type: null,
        message: null
    };
    public noShowPolicyList: INoShowPolicy[];
    public newNoShowPolicy: INoShowPolicy;
    public showAddNoShowRow: boolean;
    public config: PerfectScrollbarConfigInterface = {};
    public scrollBarContainerHeight: number;

    constructor(
        private modalService: BsModalService,
        //private _adminData: AdminPolicyService
        private _adminData: AdminNoShowPolicyService
    ) { }

    ngOnInit() {
        let headerBuffer = 60;
        this.scrollBarContainerHeight = $(document).height() - ($("#main-navbar").outerHeight() + $("#sub-navbar").outerHeight() + $("#footerButtonContainer").outerHeight() + $("#pageHeading").outerHeight() + headerBuffer + 155);
        //console.log("in ng on in it: ", $(document).height(), $("#main-navbar").outerHeight(), $("#sub-navbar").outerHeight(), $("#footerButtonContainer").outerHeight(), $("#pageHeading").outerHeight(), headerBuffer, this.scrollBarContainerHeight);      
        this.showAddNoShowRow = false;
        this.getNoShowPolicyList();
    }

    public getNoShowPolicyList() {

        this._adminData.getDataList('Config/Policy/getNoShowPolicy/', 'noShowPolicies').subscribe(noShowPolicyRes => {
            //console.log("nsPolicyList: ", noShowPolicyRes);
            this.noShowPolicyList = noShowPolicyRes;
        });
    }

    public editNoShowPolicy(noShowPolicyItem: INoShowPolicy) {
        console.log("index number: ", noShowPolicyItem);
        delete noShowPolicyItem['editable'];
        let updateNoShowPolicy = {
            "noShowPolicies": [noShowPolicyItem]
        }
        this._adminData.updateData('Config/Policy/updateNoShowPolicy/', updateNoShowPolicy).subscribe(res => {
            this.alertMessageDetails.response = true;
      
            if (res['message'].toLowerCase() == 'success') {
              this.alertMessageDetails.type = 'success';
              this.alertMessageDetails.message = "No Show Policy updated successfully";
            } else {
              this.alertMessageDetails.type = 'danger';
              this.alertMessageDetails.message = "No Show Policy details not updated! Please try again.";
            }
      
            setTimeout(() => {
              this.alertMessageDetails.response = false;
            }, 5000);
          });
        
    }

    public displayAddNoShowPolicy() {
        this.showAddNoShowRow = !this.showAddNoShowRow;
        this.newNoShowPolicy = {
            nsPolicyName: null,
            hours: null,
            hoursDesc: null,
            charge: null,
            roomNights: 0,
            percent: true,
            applied: false
        }
    }

    public saveNoShowPolicy() {
        let addNoShowPolicyObj = {
            "noShowPolicies": [
                this.newNoShowPolicy
            ]
        }
        this._adminData.addData('Config/Policy/createNoShowPolicy/', addNoShowPolicyObj).subscribe(res => {
            //console.log("no show policy add response: ", res);
            this.alertMessageDetails.response = true;
            if (res['message'].toLowerCase() == 'success') {
                this.showAddNoShowRow = false;
                this.newNoShowPolicy = null;
                this.getNoShowPolicyList();
                this.alertMessageDetails.type = 'success';
                this.alertMessageDetails.message = "New no show policy created successfully";
                this.getNoShowPolicyList();
            } else {
                this.alertMessageDetails.type = 'danger';
                this.alertMessageDetails.message = "Meal no show policy creation failed! Please try again.";
            }

            setTimeout(() => {
                this.alertMessageDetails.response = false;
            }, 5000);

        })
    }

    openConfirmModal(indx: number) {
        this.modalRef = this.modalService.show(ConfirmPopupComponent);
        this.modalRef.content.title = 'Are you sure to delete?';
        this.modalRef.content.event.subscribe(data => {
            this.modalRef.hide();
            if (data.confirm == true) {
                this._adminData.removeData(
                    'Config/Policy/removeNoShowPolicy/',
                    {
                        dataID: this.noShowPolicyList[indx].noshowPolicyID
                    }
                ).subscribe(res => {
                    this.alertMessageDetails.response = true;
                    //{"successList":[{"status":"Success","message":"NoShowPolicy deleted Successfully for NoShowPolicyId: 3","rowsUpdated":1,"bookingId":0,"folioId":0}]}
                    if (res['successList'][0]['status'].toLowerCase() == 'success') {
                        this.noShowPolicyList.splice(indx, 1);
                        this.alertMessageDetails.type = 'success';
                        this.alertMessageDetails.message = res['successList'][0]['message'];
                        this.getNoShowPolicyList();
                    } else {
                        this.alertMessageDetails.type = 'danger';
                        this.alertMessageDetails.message = "No show policy details not deleted! Please try again.";
                    }

                    setTimeout(() => {
                        this.alertMessageDetails.response = false;
                    }, 5000);
                });
            } else {
                console.log('dont go for delete: ', this.noShowPolicyList[indx]);
            }
        });
    }
}