import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { PerfectScrollbarConfigInterface, PerfectScrollbarComponent } from 'ngx-perfect-scrollbar';

import { AdminUserService } from '../admin.user.service';
import { ConfirmPopupComponent } from '../../../../shared/components/confirm.popup.component';
import { IUsersDetails } from '../UserDetails';
import { IDepartmentList } from '../../manage-department/Department';

import moment from 'moment';

@Component({
    selector: 'app-admin-user-work-details',
    templateUrl: './admin.user.work.details.component.html'
})
export class AdminUserWorkDetailsComponent implements OnInit {

    @Output() userDetailViewChange = new EventEmitter();

    @Input() departmentList: IDepartmentList;
    @Input() userDetails: IUsersDetails;

    bsConfigJoiningDate: Partial<BsDatepickerConfig>;
    modalRef: BsModalRef;
    alertMessageDetails = {
        response: false,
        type: null,
        message: null
    };
    confirmPassword: string;
    confirmPosUnlockPin: string;
    public config: PerfectScrollbarConfigInterface = {};
    public scrollBarContainerHeight: number;

    public shiftStartTime: any;
    public shiftEndTime: any;

    constructor(
        private modalService: BsModalService,
        private _adminData: AdminUserService
    ) {
        this.bsConfigJoiningDate = Object.assign({}, {
            containerClass: 'theme-blue',
            dateInputFormat: 'DD-MMM-YYYY',
            //minDate: new Date(),
            showWeekNumbers: false
        });
    }

    ngOnInit() {

        this.shiftStartTime = {
            "timeval": this.userDetails.User.shiftFrom.split(':')[0],
            "meridian": this.userDetails.User.shiftFrom.split(':')[1]
        };
        this.shiftEndTime = {
            "timeval": this.userDetails.User.shiftTo.split(':')[0],
            "meridian": this.userDetails.User.shiftTo.split(':')[1]
        };
        this.userDetails.Employee.dOJ = moment(this.userDetails.Employee.dOJ, "YYYY-MM-DD").format("DD-MMM-YYYY");
        let headerBuffer = 65;
        this.scrollBarContainerHeight = $(document).height() - ($("#main-navbar").outerHeight() + $("#sub-navbar").outerHeight() + $("#footerButtonContainer").outerHeight() + $("#pageHeading").outerHeight() + headerBuffer + 155);
        //console.log("in ng on in it: ", $(document).height(), $("#main-navbar").outerHeight(), $("#sub-navbar").outerHeight(), $("#footerButtonContainer").outerHeight(), $("#pageHeading").outerHeight(), headerBuffer, this.scrollBarContainerHeight);      
        console.log("user details in work details: ", this.userDetails, this.departmentList);
    }

    public setPermittedIps(event) {
        this.userDetails.User.permittedIps = event.target.value.split(',');
    }

    public setSift(shiftType, key, value) {
        console.log("in set shift: ", shiftType, key, value);
        if (shiftType == 'start') {
            this.shiftStartTime[key] = value;
        } else {
            this.shiftEndTime[key] = value;
        }
    }

    public saveUser() {

        this.userDetails.User.shiftFrom = this.shiftStartTime.timeval + ':' + this.shiftStartTime.meridian;
        this.userDetails.User.shiftTo = this.shiftEndTime.timeval + ':' + this.shiftEndTime.meridian;
        this.userDetails.Employee.dOJ = moment(this.userDetails.Employee.dOJ, "DD-MMM-YYYY").format("YYYY-MM-DD");
        this.userDetails.Employee.dOB = moment(this.userDetails.Employee.dOB, "DD-MMM-YYYY").format("YYYY-MM-DD");

        console.log("this.userDetails.Employee.empId: ", this.userDetails.Employee.empId, typeof this.userDetails.Employee.empId);

        if (this.userDetails.Employee.empId == null) {
            this._adminData.addData('Config/UserManagement/createEmployee/', this.userDetails).subscribe(saveUserRes => {
                this.alertMessageDetails.response = true;
                if (saveUserRes['successList'][0].status.toLowerCase() == 'success') {
                    this.alertMessageDetails.type = 'success';
                    this.alertMessageDetails.message = "User details added successfully";
                } else {
                    this.alertMessageDetails.type = 'danger';
                    this.alertMessageDetails.message = "User details add failed! Please try again.";
                }
            });
        } else {
            this._adminData.updateEmployeeDetails('Config/UserManagement/updateEmployee/' + this.userDetails.Employee.empId, this.userDetails).subscribe(saveUserRes => {
                this.alertMessageDetails.response = true;
                if (saveUserRes['successList'][0].status.toLowerCase() == 'success') {
                    this.alertMessageDetails.type = 'success';
                    this.alertMessageDetails.message = "User details updated successfully";
                } else {
                    this.alertMessageDetails.type = 'danger';
                    this.alertMessageDetails.message = "User details update failed! Please try again.";
                }
            });
        }

        setTimeout(() => {
            this.alertMessageDetails.response = false;
        }, 5000);
    }

    public openUserBasicDetails() {
        let count = 1;
        //console.log("in user details",count);        
        this.userDetailViewChange.emit(count);
    }
}