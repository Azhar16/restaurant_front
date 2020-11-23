import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { PerfectScrollbarConfigInterface, PerfectScrollbarComponent } from 'ngx-perfect-scrollbar';

import { AdminManageDepartmentService } from './admin.manage.department.service';
import { IDepartment, IDepartmentList } from './Department';
import { ConfirmPopupComponent } from '../../../shared/components/confirm.popup.component';

@Component({
    selector: 'app-admin-layout-no-show-policy',
    templateUrl: './admin.manage.department.component.html'
})
export class ManageDepartmentComponent implements OnInit {
    modalRef: BsModalRef;
    alertMessageDetails = {
        response: false,
        type: null,
        message: null
    };
    public allDepartmentCkbox: boolean;
    public departmentList: IDepartment[];
    public newDepartmentObject: IDepartment;
    public showNewDepartmentRow: boolean;
    public config: PerfectScrollbarConfigInterface = {};
    public scrollBarContainerHeight: number;

    constructor(
        private modalService: BsModalService,
        private _adminData: AdminManageDepartmentService
    ) { }

    ngOnInit() {
        let headerBuffer = 10;
            this.scrollBarContainerHeight = $(document).height() - ($("#main-navbar").outerHeight() + $("#sub-navbar").outerHeight() + $("#footerButtonContainer").outerHeight() + $("#pageHeading").outerHeight() + headerBuffer);
            console.log("element height: ",$(document).height(), $("#main-navbar").outerHeight(), $("#sub-navbar").outerHeight(), $("#footerButtonContainer").outerHeight(), $("#pageHeading").outerHeight(), headerBuffer);
        this.getDepartmentList();
    }

    public getDepartmentList() {
        this._adminData.getDataList('Config/Departments/getDepartments/', 'departments').subscribe(deptRes => {          
            this.departmentList = deptRes;            
        });
        this.showNewDepartmentRow = false;
    }

    public openConfirmModal(indx: number) {
        this.modalRef = this.modalService.show(ConfirmPopupComponent);
        this.modalRef.content.title = 'Are you sure to delete?';
        this.modalRef.content.event.subscribe(data => {
            this.modalRef.hide();
            if (data.confirm == true) {
                this._adminData.removeData(
                    'Config/Departments/removeDepartment/',
                    {
                        dataID: this.departmentList[indx].departmentId
                    }
                ).subscribe(res => {
                    this.alertMessageDetails.response = true;
                    if (res['successList'][0]['status'].toLowerCase() == 'success') {
                        this.departmentList.splice(indx, 1);
                        this.alertMessageDetails.type = 'success';
                        this.alertMessageDetails.message = res['successList'][0]['message'];
                    } else {
                        this.alertMessageDetails.type = 'danger';
                        this.alertMessageDetails.message = "Department details not deleted! Please try again.";
                    }

                    setTimeout(() => {
                        this.alertMessageDetails.response = false;
                    }, 5000);
                });
            } else {
                console.log('dont go for delete: ', this.departmentList[indx]);
            }
        });
    }

    public editDepartment(policyIndex: number) {
        console.log("index number: ", policyIndex);
    }

    public displayNewDepartmentRow() {
        this.showNewDepartmentRow = true;
        this.newDepartmentObject = {
            departmentName: null,
            departDesc: null,
        }
    }

    public createNewDepartment() {
        let newDepartmentRequestObject = {
            "departments": [
                this.newDepartmentObject
            ]
        }

        this._adminData.addData('Config/Departments/createDepartments/', newDepartmentRequestObject).subscribe(res => {
            this.alertMessageDetails.response = true;
            if (res['successList'][0]['status'].toLowerCase() == 'success') {
                this.showNewDepartmentRow = false;
                this.newDepartmentObject = null;
                this.getDepartmentList();
                this.alertMessageDetails.type = 'success';
                this.alertMessageDetails.message = res['successList'][0]['message'];
            } else {
                this.alertMessageDetails.type = 'danger';
                this.alertMessageDetails.message = "Department details creation failed! Please try again.";
            }

            setTimeout(() => {
                this.alertMessageDetails.response = false;
            }, 5000);
        });
    }
    // public selectDepartmentCKBStatus(ckBoxType: any) {
    //     if (ckBoxType == 'all') {
    //         for (let i = 0; i < this.departmentList.length; i++) {
    //             this.departmentList[i].checked = this.allDepartmentCkbox;
    //         }
    //     } else {
    //         this.allDepartmentCkbox = this.departmentList.every(deptItem => deptItem.checked);
    //     }
    // }
}