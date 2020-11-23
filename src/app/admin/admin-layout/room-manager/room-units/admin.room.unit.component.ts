import { AfterViewInit, Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { PerfectScrollbarConfigInterface, PerfectScrollbarComponent } from 'ngx-perfect-scrollbar';


import { AdminRoomUnitService } from './admin.room.unit.service';
import { ConfirmPopupComponent } from '../../../../shared/components/confirm.popup.component';
import { IRoomUnit } from './RoomUnit';

@Component({
  templateUrl: './admin.room.unit.component.html'
})
export class AdminRoomUnitComponent implements OnInit {

  modalRef: BsModalRef;
  alertMessageDetails = {
    response: false,
    type: null,
    message: null
  };

  public type: string = 'component';
  public disabled: boolean = false;
  public config: PerfectScrollbarConfigInterface = {};
  public scrollBarContainerHeight: number;
  public roomTypeBeCreated: string;
  public roomUnitList: IRoomUnit[];
  public roomStartNumber: number;
  public roomEndNumber: number;
  public roomPrefix: string;
  public roomsuffix: string;
  public spRoomName: string;

  @ViewChild(PerfectScrollbarComponent) componentRef?: PerfectScrollbarComponent;

  constructor(
    private modalService: BsModalService,
    private _adminData: AdminRoomUnitService
  ) { }

  ngOnInit() {
    let headerBuffer = 65;
    this.scrollBarContainerHeight = $(document).height() - ($("#main-navbar").outerHeight() + $("#sub-navbar").outerHeight() + $("#footerButtonContainer").outerHeight() + $("#pageHeading").outerHeight() + headerBuffer + 100);
    //console.log("in ng on in it: ", $(document).height(), $("#main-navbar").outerHeight(), $("#sub-navbar").outerHeight(), $("#footerButtonContainer").outerHeight(), $("#pageHeading").outerHeight(), headerBuffer, this.scrollBarContainerHeight);      
    this.getRoomUnitList();
  }

  public getRoomUnitList() {
    this._adminData.getDataList('Config/RoomUnits/getRoomUnits/', 'roomUnits').subscribe(roomUnitListRes => {
      this.roomUnitList = roomUnitListRes;
    });
  }

  public createRoomUnit(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, { class: 'gray modal-lg' })
    );
    this.roomTypeBeCreated = 'general';
  }

  public openConfirmModal(indx: number) {
    this.modalRef = this.modalService.show(ConfirmPopupComponent);
    this.modalRef.content.title = 'Are you sure to delete?';
    this.modalRef.content.event.subscribe(data => {
      this.modalRef.hide();
      if (data.confirm == true) {
        this._adminData.removeData(
          'Config/RoomUnits/removeRoomUnit/',
          {
            dataID: this.roomUnitList[indx].ruid
          }
        ).subscribe(res => {
          this.alertMessageDetails.response = true;
          //{"successList":[{"status":"Success","message":"roomUnitMapping deleted successfully for ruid: 6037","rowsUpdated":1,"bookingId":0,"folioId":0}]}
          if (res['successList'][0]['status'].toLowerCase() == 'success') {
            this.roomUnitList.splice(indx, 1);
            this.alertMessageDetails.type = 'success';
            this.alertMessageDetails.message = "Room unit deleted successfully";
            this.getRoomUnitList();
          } else {
            this.alertMessageDetails.type = 'danger';
            this.alertMessageDetails.message = "Room unit details not deleted! Please try again.";
          }

          setTimeout(() => {
            this.alertMessageDetails.response = false;
          }, 5000);
        });
      } else {
        console.log('dont go for delete: ', this.roomUnitList[indx]);
      }
    });
  }

  public addRoomUnit() {

    let roomCreationObj = {
      roomUnits: []
    };
    let mergedRoomPrefix = '';
    let mergedRoomSuffix = '';

    if (this.roomTypeBeCreated == 'general') {
      if (typeof this.roomPrefix !== 'undefined' && this.roomPrefix.length > 0) {
        mergedRoomPrefix = this.roomPrefix + '-';
      }

      if (typeof this.roomsuffix !== 'undefined' && this.roomsuffix.length > 0) {
        mergedRoomSuffix = '-' + this.roomsuffix;
      }

      for (let i = this.roomStartNumber; i <= this.roomEndNumber; i++) {
        roomCreationObj.roomUnits.push({
          roomNumber: mergedRoomPrefix + i + mergedRoomSuffix,
          roomStatus: 'Dirty',
          status: 1
        });
      }
    } else {
      roomCreationObj.roomUnits.push({
        roomNumber: this.spRoomName,
        roomStatus: 'Dirty',
        status: 1
      });
    }


    this._adminData.addData('Config/RoomUnits/createRoomUnit/', roomCreationObj).subscribe(res => {
      console.log("before send: ", roomCreationObj, res);

      this.modalRef.hide();
      this.alertMessageDetails.response = true;
      if (res['message'].toLowerCase() == 'success') {
        this.roomPrefix = '';
        this.roomsuffix = '';
        this.roomStartNumber = null;
        this.roomEndNumber = null;
        this.spRoomName = null;
        this.alertMessageDetails.type = 'success';
        this.alertMessageDetails.message = "New room(s) created successfully";
        this.getRoomUnitList();
      } else {
        this.alertMessageDetails.type = 'danger';
        this.alertMessageDetails.message = "Room creation failed! Please try again.";
      }

      setTimeout(() => {
        this.alertMessageDetails.response = false;
      }, 5000);

    });

  }
}