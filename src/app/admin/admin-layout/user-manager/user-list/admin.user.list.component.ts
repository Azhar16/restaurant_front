import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { PerfectScrollbarConfigInterface, PerfectScrollbarComponent } from 'ngx-perfect-scrollbar';

import { AdminUserService } from '../admin.user.service';
import { ConfirmPopupComponent } from '../../../../shared/components/confirm.popup.component';
import { IDepartment } from '../../manage-department/Department';
import { IUserList, IUsersDetails } from '../UserDetails';

@Component({
    selector: 'app-admin-phone-extension-plan',
    templateUrl: './admin.user.list.component.html'
})
export class AdminUserListComponent implements OnInit {
    modalRef: BsModalRef;
    alertMessageDetails = {
        response: false,
        type: null,
        message: null
    };

    departmentList: IDepartment[];
    userList: IUserList[];
    userDetails: IUsersDetails;
    public config: PerfectScrollbarConfigInterface = {};
    public scrollBarContainerHeight: number;
    public selectedUser: any;
    public userView: string;
    public userMappedModuleList: any;

    @ViewChild('editUserModal') editUserModal: ModalDirective;
    @ViewChild('permitUserModal') permitUserModal: ModalDirective;

    constructor(
        private modalService: BsModalService,
        private _adminData: AdminUserService
    ) { }

    ngOnInit() {
        let headerBuffer = 65;
        this.scrollBarContainerHeight = $(document).height() - ($("#main-navbar").outerHeight() + $("#sub-navbar").outerHeight() + $("#footerButtonContainer").outerHeight() + $("#pageHeading").outerHeight() + headerBuffer + 155);
        //console.log("in ng on in it: ", $(document).height(), $("#main-navbar").outerHeight(), $("#sub-navbar").outerHeight(), $("#footerButtonContainer").outerHeight(), $("#pageHeading").outerHeight(), headerBuffer, this.scrollBarContainerHeight);      
        this.getUserList();
        this.userView = 'user_basic_details';
    }

    public getUserList() {
        this._adminData.getDataList('Config/UserManagement/getUserList/', 'usersDetails').subscribe(userListRes => {
            console.log("user list: ", userListRes);
            this.userList = userListRes;
        });
    }

    public editUser(template: object, userObj: IUserList) {
        //console.log("in edit user: ", userObj, typeof template);
        this._adminData.getDataList('Config/Departments/getDepartments/', 'departments', false).subscribe(deptRes => {
            this.departmentList = deptRes;
        });
        this._adminData.getEmployeeDetails('Config/UserManagement/getEmployeebyId/' + userObj.empID).subscribe(userDetailsRes => {
            this.userDetails = userDetailsRes;
            this.openBasicDetailsView(1);
            this.modalRef = this.modalService.show(
                template,
                Object.assign({}, { class: 'gray modal-dialog-centered modal-lg mw-100 w-75' })
            );
        })
    }

    public permitUser(template, userObj: any) {
        this.userMappedModuleList = [];
        this.selectedUser = userObj;
        this._adminData.getUserPermissionMappingData('Config/UserManagement/getModuleUserMapping/', userObj.userId).subscribe(mappedModuleList => {
            let mappedModuleListLength = mappedModuleList['modules'].length;
            console.log("on click: ", mappedModuleListLength);
            for (let indx = 0; indx < mappedModuleListLength; indx++) {
                this.userMappedModuleList[mappedModuleList['modules'][indx].moduleCode.toString()] = {"name": mappedModuleList['modules'][indx].moduleName};
                let subModuleLength = mappedModuleList['modules'][indx]['subModule'].length;
                if (subModuleLength > 0) {
                    for (let subindx = 0; subindx < subModuleLength; subindx++) {
                        console.log("in submodule: ", mappedModuleList['modules'][indx]);
                        this.userMappedModuleList[mappedModuleList['modules'][indx]['subModule'][subindx].subModuleCode.toString()] = mappedModuleList['modules'][indx]['subModule'][subindx].subModuleName;
                    }
                }
            }
            //console.log("user mapped module list: ", mappedModuleList);            
        });

        this.modalRef = this.modalService.show(
            template,
            Object.assign({}, { class: 'gray modal-dialog-centered modal-lg' })
        );
    }

    public submitPermission(event: any) {
        //console.log("in submitPermission: ", event);
        this._adminData.updateData('Config/UserManagement/mapUserModules/', event.mappedModuleReq).subscribe(res => {

            this.alertMessageDetails.response = true;
            this.modalRef.hide();
            if (res['successList'][0].status.toLowerCase() == 'success') {
                this.alertMessageDetails.type = 'success';
                this.alertMessageDetails.message = res['successList'][0].message;
            } else {
                this.alertMessageDetails.type = 'danger';
                this.alertMessageDetails.message = "Permission mapping failed! Please try again.";
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
                    'Config/UserManagement/removeEmployee/',
                    {
                        dataID: this.userList[indx].empID
                    }
                ).subscribe(res => {
                    this.alertMessageDetails.response = true;
                    if (res['successList'][0].status.toLowerCase() == 'success') {
                        this.userList.splice(indx, 1);
                        this.alertMessageDetails.type = 'success';
                        this.alertMessageDetails.message = res['successList'][0].message;
                    } else {
                        this.alertMessageDetails.type = 'danger';
                        this.alertMessageDetails.message = "User not deleted! Please try again.";
                    }

                    setTimeout(() => {
                        this.alertMessageDetails.response = false;
                    }, 5000);
                });
            } else {
                console.log('dont go for delete: ', this.userList[indx]);
            }
        });

    }

    public openWorkDetailsView(count) {
        this.userView = 'user_work_details';
    }

    public openBasicDetailsView(count) {
        this.userView = 'user_basic_details';
    }
}