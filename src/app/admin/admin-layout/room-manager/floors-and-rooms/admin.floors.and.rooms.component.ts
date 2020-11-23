import { AfterViewInit, Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { BsModalService, ModalDirective } from 'ngx-bootstrap/modal';
import { PerfectScrollbarConfigInterface, PerfectScrollbarComponent } from 'ngx-perfect-scrollbar';

import { AdminFloorsAndRoomsService } from './admin.floors.and.rooms.service';
import { ConfirmPopupComponent } from '../../../../shared/components/confirm.popup.component';
import { IRoomUnit } from '../room-units/RoomUnit';
import { IFloor } from './Floors';

import _ from 'lodash';

@Component({
  templateUrl: './admin.floors.and.rooms.component.html'
})
export class AdminFloorsAndRoomsComponent implements OnInit {

  modalRef: BsModalRef;
  alertMessageDetails = {
    response: false,
    type: null,
    message: null
  };

  public config: PerfectScrollbarConfigInterface = {};
  public scrollBarContainerHeight: number;
  public floorList: IFloor[];
  public showAddFloor: boolean = false;
  public mappedFloorRoomList: any[];
  public selectedFloorMappedRoomLength: number;
  private newFloorNumber: number;
  private newNoOfRooms: number;
  private newFloorName: string;
  
  mappedFloor: IFloor = {
    "floorID": null,
    "floorNumber": null,
    "floorName": null,
    "numberOfRooms": null
  };
  floorRoomMapReqObj: any;
  disabled: boolean = true;

  optionsModel: number[];
  roomList: IRoomUnit[];
  availableRoomListForMap: any[];

  @ViewChild(PerfectScrollbarComponent) componentRef?: PerfectScrollbarComponent;
  @ViewChild('floorRoomMapModal') floorRoomMapModal: ModalDirective;

  constructor(
    private modalService: BsModalService,
    private _adminData: AdminFloorsAndRoomsService
  ) { }

  ngOnInit() {
    let headerBuffer = 65;
    this.scrollBarContainerHeight = $(document).height() - ($("#main-navbar").outerHeight() + $("#sub-navbar").outerHeight() + $("#footerButtonContainer").outerHeight() + $("#pageHeading").outerHeight() + headerBuffer + 155);

    // first getting the available room list then calling the floor component
    this._adminData.getDataList('Config/RoomUnits/getRoomUnits/', 'roomUnits').subscribe(roomList => {
      this.roomList = roomList;
      this.getFloorList();
    });
  }

  public getFloorList() {
    this._adminData.getFloorComponentDetails().subscribe(floorDetailsRes => {

      this.floorList = floorDetailsRes[0];
      this.mappedFloorRoomList = floorDetailsRes[1];

      for (let i = 0; i < this.floorList.length; i++) {
        this.floorList[i]['mapprdRoomList'] = [];
        let roomListData = this.mappedFloorRoomList.filter(mappedRoomFloorObj => mappedRoomFloorObj.floorId == this.floorList[i].floorID);
        if (roomListData.length > 0) {
          roomListData.map(roomListObj => {
            this.floorList[i]['mapprdRoomList'].push(roomListObj.ruId);
          });
        }
      }
      //console.log("ultimatet floor list: ", this.floorList);
    });
  }

  public addFloor() {
    this.showAddFloor = !this.showAddFloor;
    this.componentRef.directiveRef.scrollToBottom(-45, 300);
  }

  public createFloor() {
    let maxFloorNumber: number = 0;
    this.floorList.map(floorItem => {
      maxFloorNumber = (maxFloorNumber < floorItem.floorNumber) ? floorItem.floorNumber : maxFloorNumber;
    });
    this.newFloorNumber = maxFloorNumber + 1;

    let createFloorObject = {
      'floors': [
        {
          "floorNumber": this.newFloorNumber,
          "floorName": this.newFloorName,
          "numberOfRooms": this.newNoOfRooms
        }
      ]
    };

    this._adminData.addData('Config/floors/', createFloorObject).subscribe(res => {
      this.alertMessageDetails.response = true;

      if (res['message'].toLowerCase() == 'success') {
        this.newFloorName = '';
        this.newFloorNumber = null;
        this.newNoOfRooms = null;
        this.showAddFloor = false;

        this.getFloorList();
        this.alertMessageDetails.type = 'success';
        this.alertMessageDetails.message = "New floor created successfully";
      } else {
        this.alertMessageDetails.type = 'danger';
        this.alertMessageDetails.message = "Floor details creation failed! Please try again.";
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
          'Config/floors/removefloors/',
          {
            dataID: this.floorList[indx].floorID
          }
        ).subscribe(res => {
          this.alertMessageDetails.response = true;
          if (res['message'].toLowerCase() == 'success') {
            this.floorList.splice(indx, 1);
            this.alertMessageDetails.type = 'success';
            this.alertMessageDetails.message = "Floor deleted successfully";
          } else {
            this.alertMessageDetails.type = 'danger';
            this.alertMessageDetails.message = "Floor details not deleted! Please try again.";
          }

          setTimeout(() => {
            this.alertMessageDetails.response = false;
          }, 5000);
        });
      } else {
        console.log('dont go for delete: ', this.floorList[indx]);
      }
    });
  }

  public mapFloorRoom(template: TemplateRef<any>, floorData: IFloor) {
    let self = this;
    self.availableRoomListForMap = [];
    self.mappedFloor = floorData;
    self.selectedFloorMappedRoomLength = 0;

    for (let index = 0; index < self.roomList.length; index++) {
      let mappedRoomObj = _.find(self.mappedFloorRoomList, function (mappedRoomObj) {
        return mappedRoomObj.ruId == self.roomList[index].ruid
      });

      if (typeof mappedRoomObj === 'undefined') {
        self.availableRoomListForMap.push({
          ruid: self.roomList[index].ruid,
          roomNumber: self.roomList[index].roomNumber,
          mapped: false
        })
      } else if (mappedRoomObj.floorId == floorData.floorID) {
        self.availableRoomListForMap.push({
          ruid: self.roomList[index].ruid,
          roomNumber: self.roomList[index].roomNumber,
          mapped: true
        });
        self.selectedFloorMappedRoomLength++;
      }
    }

    //console.log("available room list: ", this.availableRoomListForMap, floorData);

    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, { class: 'gray modal-dialog-centered modal-lg' })
    );
  }

  public floorMapSelectionUpdate() {
    this.selectedFloorMappedRoomLength = _.size(this.availableRoomListForMap.filter(floorRoom => floorRoom.mapped));
  }

  public saveFloorRoomMapping() {

    this.floorRoomMapReqObj = {
      "floorRoomMap": []
    };

    for (let i = 0; i < this.availableRoomListForMap.length; i++) {
      if (this.availableRoomListForMap[i].mapped) {
        this.floorRoomMapReqObj.floorRoomMap.push({
          "floorId": this.mappedFloor.floorID,
          "ruId": this.availableRoomListForMap[i].ruid,
          "status": "1"
        });
      }
    }

    this._adminData.addData('Config/FloorRoomMap/', this.floorRoomMapReqObj).subscribe(res => {

      this.modalRef.hide();
      this.alertMessageDetails.response = true;

      if (res['successList'][0]['status'].toLowerCase() == 'success') {
        this.alertMessageDetails.type = 'success';
        this.alertMessageDetails.message = res['successList'][0]['message'];
        this._adminData.getDataList('Config/FloorRoomMap/getFloorRoomMap/', 'floorRoomMap').subscribe(floorMapDetailsRes => {
          this.mappedFloorRoomList = floorMapDetailsRes;
        });
      } else {
        this.alertMessageDetails.type = 'danger';
        this.alertMessageDetails.message = "Room - Floor mapping failed! Please try again.";
      }

      setTimeout(() => {
        this.alertMessageDetails.response = false;
      }, 5000);

    });
  }
}