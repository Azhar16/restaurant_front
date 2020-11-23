import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { BsModalService, ModalDirective } from 'ngx-bootstrap/modal';
import { PerfectScrollbarConfigInterface, PerfectScrollbarComponent } from 'ngx-perfect-scrollbar';

import { AdminReportsScheduleReportService } from './admin.reports.schedule.report.service';
import { ConfirmPopupComponent } from '../../../../shared/components/confirm.popup.component';
import { IScheduleReport } from './ScheduleReport';

@Component({
  templateUrl: './admin.reports.schedule.report.component.html'
})
export class AdminReportsScheduleReportComponent implements OnInit {
  modalRef: BsModalRef;
  alertMessageDetails = {
    response: false,
    type: null,
    message: null
  };
  public allDepartmentCkbox: boolean;
  public scheduleReportList: IScheduleReport[];
  public newScheduleReportObject: IScheduleReport;
  public showNewScheduleReportRow: boolean;
  public config: PerfectScrollbarConfigInterface = {};
  public scrollBarContainerHeight: number;

  public recurrenceTypeView: string;

  @ViewChild('configureReportsModal') configureReportsModal: ModalDirective;
  @ViewChild(PerfectScrollbarComponent) componentRef?: PerfectScrollbarComponent;

  constructor(
    private modalService: BsModalService,
    private _adminData: AdminReportsScheduleReportService
  ) { }

  ngOnInit() {
    let headerBuffer = 70;
    this.scrollBarContainerHeight = $(document).height() - ($("#main-navbar").outerHeight() + $("#sub-navbar").outerHeight() + $("#footerButtonContainer").outerHeight() + $("#pageHeading").outerHeight() + headerBuffer + 155);
    this.getScheduleReportList();
  }

  public getScheduleReportList() {
    /*this._adminData.getDataList('Config/Departments/getDepartments/', 'departments').subscribe(deptRes => {
        console.log("deptList: ", deptRes);
        this.departmentList = deptRes;
    });*/

    this.scheduleReportList = [
      {
        srID: 1,
        reportType: "Reservation Report",
        startDate: "2019-02-05",
        endDate: "2019-02-08",
        days: 8,
        recurrence: "Daily",
        recepiantEmail: "anb@gmail.com",
        status: true,
        editable: false,

      },
      {
        srID: 2,
        reportType: "Reservation Small Report",
        startDate: "2019-01-05",
        endDate: "2019-01-12",
        days: 8,
        recurrence: "Weekly",
        recepiantEmail: "rajub@gmail.com",
        status: false,
        editable: false,

      },
    ];
    this.showNewScheduleReportRow = false;
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
            dataID: this.scheduleReportList[indx].srID
          }
        ).subscribe(res => {
          this.alertMessageDetails.response = true;
          if (res['successList'][0]['status'].toLowerCase() == 'success') {
            this.scheduleReportList.splice(indx, 1);
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
        console.log('dont go for delete: ', this.scheduleReportList[indx]);
      }
    });
  }

  public editDepartment(policyIndex: number) {
    console.log("index number: ", policyIndex);
  }

  public displayNewDepartmentRow() {
    this.showNewScheduleReportRow = true;
    this.newScheduleReportObject = {
      recepiantEmail: null,
      reportType: null,
      startDate: null,
      endDate: null,
      days: null,
      recurrence: null,
      status: false
    }
  }

  public createNewDepartment() {
    let newDepartmentRequestObject = {
      "departments": [
        this.newScheduleReportObject
      ]
    }

    this._adminData.addData('Config/Departments/createDepartments/', newDepartmentRequestObject).subscribe(res => {
      this.alertMessageDetails.response = true;
      if (res['successList'][0]['status'].toLowerCase() == 'success') {
        this.showNewScheduleReportRow = false;
        this.newScheduleReportObject = null;
        this.getScheduleReportList();
        this.alertMessageDetails.type = 'success';
        this.alertMessageDetails.message = res['successList'][0]['message'];
      } else {
        this.alertMessageDetails.type = 'danger';
        this.alertMessageDetails.message = "Schedule report creation failed! Please try again.";
      }

      setTimeout(() => {
        this.alertMessageDetails.response = false;
      }, 5000);
    });
  }

  public onRecurrenceChange(recurrenceType) {
    this.recurrenceTypeView = recurrenceType;
  }

  public configureNewReport(template) {    
    this.recurrenceTypeView = 'daily';
    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, { class: 'gray modal-dialog-centered modal-lg mw-100 w-75' })
      );
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