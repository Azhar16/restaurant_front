import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { PerfectScrollbarConfigInterface, PerfectScrollbarComponent } from 'ngx-perfect-scrollbar';

import { AdminPetPolicyService } from './admin.pet.policy.service';
import { ConfirmPopupComponent } from '../../../../shared/components/confirm.popup.component';
import { IPetPolicy } from './PetPolicy';

@Component({
    selector: 'app-admin-layout-pet-policy',
    templateUrl: './admin.pet.policy.component.html'
})
export class AdminPetPolicyComponent implements OnInit {
    modalRef: BsModalRef;
    alertMessageDetails = {
        response: false,
        type: null,
        message: null
    };
    public petPolicyList: IPetPolicy[];
    public newPetPolicyObject: IPetPolicy;
    public newPetPolicyRowShow: boolean;
    public config: PerfectScrollbarConfigInterface = {};
    public scrollBarContainerHeight: number;

    constructor(
        private modalService: BsModalService,
        private _adminData: AdminPetPolicyService
    ) { }

    ngOnInit() {
        let headerBuffer = 60;
        this.scrollBarContainerHeight = $(document).height() - ($("#main-navbar").outerHeight() + $("#sub-navbar").outerHeight() + $("#footerButtonContainer").outerHeight() + $("#pageHeading").outerHeight() + headerBuffer + 155);
        //console.log("in ng on in it: ", $(document).height(), $("#main-navbar").outerHeight(), $("#sub-navbar").outerHeight(), $("#footerButtonContainer").outerHeight(), $("#pageHeading").outerHeight(), headerBuffer, this.scrollBarContainerHeight);      
        this.newPetPolicyRowShow = false;
        this.petPolicyList = null;
        this.getPetPolicyList();
    }

    public getPetPolicyList() {
        this._adminData.getDataList('Config/Policy/getPetPolicy/', 'petPolicies').subscribe(petPolicyRes => {
            console.log("petPolicyList: ", petPolicyRes);
            this.petPolicyList = petPolicyRes;
        });
    }

    public displayNewPetPolicyRow() {
        this.newPetPolicyRowShow = true;
        this.newPetPolicyObject = {
            percent: true,
            petPolicyName: null,
            policyCharge: 0,
        }
    }

    public createPetPolicy() {
        let addPetPolicyObj = {
            "petPolicies": [
                this.newPetPolicyObject
            ]
        }
        this._adminData.addData('Config/Policy/createPetPolicy/', addPetPolicyObj).subscribe(res => {
            console.log("pet policy add response: ", res);
            this.alertMessageDetails.response = true;
            if (res['message'].toLowerCase() == 'success') {
                this.newPetPolicyRowShow = false;
                this.newPetPolicyObject = null;
                this.getPetPolicyList();
                this.alertMessageDetails.type = 'success';
                this.alertMessageDetails.message = "New pet policy created successfully";
            } else {
                this.alertMessageDetails.type = 'danger';
                this.alertMessageDetails.message = "Pet policy details creation failed! Please try again.";
            }

            setTimeout(() => {
                this.alertMessageDetails.response = false;
            }, 5000);

        })
    }

    public openConfirmModal(indx: number) {
        this.modalRef = this.modalService.show(ConfirmPopupComponent);
        this.modalRef.content.title = 'Are you sure to delete?';
        this.modalRef.content.event.subscribe(data => {
            this.modalRef.hide();
            if (data.confirm == true) {
                this._adminData.removeData(
                    'Config/Policy/removePetPolicy/',
                    {
                        dataID: this.petPolicyList[indx].petPolicyID
                    }
                ).subscribe(res => {
                    this.alertMessageDetails.response = true;
                    if (res['message'].toLowerCase() == 'success') {
                        this.petPolicyList.splice(indx, 1);
                        this.alertMessageDetails.type = 'success';
                        this.alertMessageDetails.message = "Pet policy deleted successfully";
                    } else {
                        this.alertMessageDetails.type = 'danger';
                        this.alertMessageDetails.message = "Pet policy details not deleted! Please try again.";
                    }

                    setTimeout(() => {
                        this.alertMessageDetails.response = false;
                    }, 5000);
                });
            } else {
                console.log('dont go for delete: ', this.petPolicyList[indx]);
            }
        });
    }
}