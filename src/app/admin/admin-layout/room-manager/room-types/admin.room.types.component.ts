import { AfterViewChecked, Component, ChangeDetectorRef, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { BsModalService, ModalDirective } from 'ngx-bootstrap/modal';
import { PerfectScrollbarComponent } from 'ngx-perfect-scrollbar';
import { PopoverDirective } from 'ngx-bootstrap/popover';

import { AdminRoomTypesService } from './admin.room.types.service';
import { IAminity } from '../room-amenities/Aminities';
import { IRatePlan } from '../../price-manager/rate-plans/RatePlan';
import { IRoomType } from './RoomTypes';
import { IRoomUnit } from '../room-units/RoomUnit';

import _ from 'lodash';
import __ from 'underscore';

@Component({
   templateUrl: './admin.room.types.component.html'
  // styles: [
  //   `:host >>> .popover {
  //         max-width:500px;
  //       }`
  // ]
})
export class AdminRoomTypesComponent implements AfterViewChecked, OnInit  {

  @ViewChild(PerfectScrollbarComponent) componentRef?: PerfectScrollbarComponent;
  @ViewChildren(PopoverDirective) popupref: QueryList<PopoverDirective>;

  modalRef: BsModalRef;
  alertMessageDetails = {
    response: false,
    type: null,
    message: null
  };
  public scrollBarContainerHeight: number;

  public roomTypeList: IRoomType[];
  public roomUnitList: IRoomUnit[];
  public ratePlanList: IRatePlan[];
  private aminityList: IAminity[];
  public selectedRoomTypeObject: IRoomType;
  public roomPopoverIndex: number;
  public ratePopoverIndex: number;
  public amenitiesPopoverIndex: number;
  public allRoomUnitMapCkbox: boolean;
  public allAmenityMapCkbox: boolean;
  public allRatePlanMapCkbox: boolean;
  public roomTypeRatePlanMapping: any[];
  public roomTypeAmenitiesMapping: any[];
  public roomTypeRoomUnitMapping: any[];
  public roomRateMappingDataList: any[];
  public addRoomType: IRoomType;
  public showAddNewRoomType: boolean;

  isOpen = false;
  constructor(
    private modalService: BsModalService,
    private _adminData: AdminRoomTypesService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.getAllRoomTypeData();
    this.showAddNewRoomType = false;    
  }

  ngAfterViewChecked(){
    let headerBuffer = 65;
    this.scrollBarContainerHeight = $(document).height() - ($("#main-navbar").outerHeight() + $("#sub-navbar").outerHeight() + $("#pageHeading").outerHeight() + $("#footerButtonContainer").outerHeight() + headerBuffer + 120);
    //console.log("in ng on in it: ", $(document).height(), $("#main-navbar").outerHeight(), $("#sub-navbar").outerHeight(), headerBuffer, this.scrollBarContainerHeight);
    this.cdr.detectChanges();
  }

  // Fetching all the necessary data for this page
  public getAllRoomTypeData() {
    this._adminData.roomTypeDataList().subscribe(roomTypeResponseList => {
      this.roomTypeList = roomTypeResponseList[0];
      this.ratePlanList = roomTypeResponseList[1];
      this.roomUnitList = roomTypeResponseList[2];
      this.aminityList = roomTypeResponseList[3];
      this.roomTypeRoomUnitMapping = roomTypeResponseList[4];
      this.roomTypeRatePlanMapping = roomTypeResponseList[5];
      this.roomTypeAmenitiesMapping = roomTypeResponseList[6];
    });
  }

  public saveRoomType(roomTypeObject: IRoomType) {
    //console.log("roomTypeObject: ", roomTypeObject);
    let updateRoomTypeObject = {
      'roomType': [
        roomTypeObject
      ]
    };

  }
 
  // This method is for opening the popover for room unit, amenity and rate plan
  public generatePopoverContent(popoverType: string, indx: number, roomTypeItem: IRoomType) {
    let self = this; 
    self.selectedRoomTypeObject = roomTypeItem;
    if (popoverType == 'room') {

      this.roomPopoverIndex = indx * 3;
      for (let popoverCounterIndex = 0; popoverCounterIndex < this.popupref['_results'].length; popoverCounterIndex++) {
        this.popupref['_results'][popoverCounterIndex].isOpen = this.roomPopoverIndex == popoverCounterIndex ? true : false;
      }
      
      this.roomRateMappingDataList = _.unionBy(
        self.roomTypeRoomUnitMapping.filter(roomUnitMappingObj => roomUnitMappingObj.roomID == roomTypeItem.roomID)
          .map(item => {
            item['checked'] = true;
            return item; 
          }), 
        self.roomUnitList.filter(ruObj => !__.findWhere(self.roomTypeRoomUnitMapping, {ruid: ruObj.ruid}))
        .map(item => {
          item['checked'] = false;
          return item; 
        })
      );                                     
    }else if (popoverType == 'amenities') {
      this.amenitiesPopoverIndex = indx * 3 + 1;
      for (let popoverCounterIndex = 0; popoverCounterIndex < this.popupref['_results'].length; popoverCounterIndex++) {
        this.popupref['_results'][popoverCounterIndex].isOpen = this.amenitiesPopoverIndex == popoverCounterIndex ? true : false;
      }

      this.aminityList.map( amenityItem => {
        let roomTypeAmenitiesMappingObj = __.findWhere(self.roomTypeAmenitiesMapping, {roomID: roomTypeItem.roomID, aminityId: amenityItem.aminityID});
        if(typeof(roomTypeAmenitiesMappingObj) !== 'undefined'){
          amenityItem['checked'] = true;
          amenityItem['roomAminityMapId'] = roomTypeAmenitiesMappingObj.roomAminityMapId;
        } else {
          amenityItem['checked'] = false;
        }
        return amenityItem;
      });

    }else if (popoverType == 'rate') {

      this.ratePopoverIndex = indx * 3 + 2;
      for (let popoverCounterIndex = 0; popoverCounterIndex < this.popupref['_results'].length; popoverCounterIndex++) {
        this.popupref['_results'][popoverCounterIndex].isOpen = this.ratePopoverIndex == popoverCounterIndex ? true : false;
      }

      //console.log("ratePlanMappingDataList: ", this.ratePlanMappingDataList);
      this.ratePlanList.map(ratePlanItem => {
        //console.log("in rate plan list map: ", roomTypeItem.roomID, ratePlanItem.ratePlanCode, typeof(__.findWhere(self.roomTypeRatePlanMapping, {roomId: roomTypeItem.roomID, rateCode: ratePlanItem.ratePlanCode})) !== 'undefined' );
        let roomTypeRatePlanMappingObj = __.findWhere(self.roomTypeRatePlanMapping, {roomId: roomTypeItem.roomID, rateCode: ratePlanItem.ratePlanCode});
        if(typeof(roomTypeRatePlanMappingObj) !== 'undefined'){
          ratePlanItem['checked'] = true;
          ratePlanItem['rtRPMapID'] = roomTypeRatePlanMappingObj.rtRPMapID;
        } else {
          ratePlanItem['checked'] = false;
        }
        return ratePlanItem;
      })

    }
  }

  public mapRoomOnHide() {    
    this.popupref['_results'][this.roomPopoverIndex].isOpen = false;
    let roomTypeRoomUnitMappingRequestObj = {'rtrumaps':[]};
    let self = this;
    //console.log("on map: ", this.roomRateMappingDataList);
    this.roomRateMappingDataList.map(roomRateMappingItem => {
      if(roomRateMappingItem.checked) {
        let reqObj = {
          ruid: roomRateMappingItem.ruid,
          roomID: self.selectedRoomTypeObject.roomID,
          status: "1"
        };
        
        if(roomRateMappingItem.hasOwnProperty('rtruMapID'))
          reqObj['rtruMapID'] = roomRateMappingItem.rtruMapID

        roomTypeRoomUnitMappingRequestObj.rtrumaps.push(reqObj)
      }
    });
    //console.log("roomTypeRoomUnitMappingRequestObj: ", roomTypeRoomUnitMappingRequestObj);
    this._adminData.updateData('Config/RoomTypeNumberMap/createUpdateRTRUMapping/', roomTypeRoomUnitMappingRequestObj)
      .subscribe(roomTypeRoomUnitMappingRes => {
        this.alertMessageDetails.response = true;
        //console.log("after getting response: ", roomTypeRoomUnitMappingRes['successList'][0]['status']);
        if (roomTypeRoomUnitMappingRes['successList'][0]['status'].toLowerCase() == 'success') {
          this.alertMessageDetails.type = 'success';
          this.alertMessageDetails.message = "Room Type Mapping Successful";
          self.getAllRoomTypeData();
        } else {
          this.alertMessageDetails.type = 'danger';
          this.alertMessageDetails.message = "Room Unit Mapping not successful! Please try again.";
        }

        setTimeout(() => {
          this.alertMessageDetails.response = false;
        }, 5000);
      });
  }

  public mapAmenityOnHide() {
    let self = this;
    this.popupref['_results'][this.amenitiesPopoverIndex].isOpen = false;
    let roomTypeRoomAmenityMappingRequestObj = {'roomAminityMaps':[]};

    console.log("this.aminityList: ", this.aminityList);
    self.aminityList.map((mappedAmenityItem: any) => {
      if(mappedAmenityItem.checked){
        let reqObj = {
          aminityId: mappedAmenityItem.aminityID,
          roomID: self.selectedRoomTypeObject.roomID,
          status: "1"
        };

        if(mappedAmenityItem.hasOwnProperty('roomAminityMapId'))
          reqObj['roomAminityMapId'] = mappedAmenityItem.roomAminityMapId

          roomTypeRoomAmenityMappingRequestObj.roomAminityMaps.push(reqObj);
      }
    });

    //console.log("self.roomTypeRoomAmenityMappingRequestObj: ", roomTypeRoomAmenityMappingRequestObj);
    this._adminData.updateData('Config/RoomAminityMap/createUpdateRoomAminityMapping/', roomTypeRoomAmenityMappingRequestObj)
      .subscribe(roomTypeRoomAmenityMappingRes => {
        this.alertMessageDetails.response = true;

        if (roomTypeRoomAmenityMappingRes['successList'][0]['status'].toLowerCase() == 'success') {
          this.alertMessageDetails.type = 'success';
          this.alertMessageDetails.message = "Amenity Mapping Successful";
          self.getAllRoomTypeData();
        } else {
          this.alertMessageDetails.type = 'danger';
          this.alertMessageDetails.message = "Amenity Mapping not successful! Please try again.";
        }

        setTimeout(() => {
          this.alertMessageDetails.response = false;
        }, 5000);
      });

  }

  public mapRateOnHide() {
    let self = this;
    this.popupref['_results'][this.ratePopoverIndex].isOpen = false;
    let roomTypeRatePlanMappingRequestObj = {'RTRPMappings': []};

    this.ratePlanList.map(mappedRatePlanItem => {
      if(mappedRatePlanItem.checked){
        let reqObj = {
          ratePlanId: mappedRatePlanItem.ratePlanID,
          roomId: self.selectedRoomTypeObject.roomID
        };

        if(mappedRatePlanItem.hasOwnProperty('rtRPMapID'))
          reqObj['rtRPMapID'] = mappedRatePlanItem.rtRPMapID

        roomTypeRatePlanMappingRequestObj.RTRPMappings.push(reqObj);
      }
    })

    this._adminData.updateData('RatePlans/createUpdateRoomRateMapping/', roomTypeRatePlanMappingRequestObj)
      .subscribe(roomTypeRatePlanMappingRes => {
        //console.log("after getting response: ", roomTypeRatePlanMappingRes);
        this.alertMessageDetails.response = true;

        if (roomTypeRatePlanMappingRes['successList'][0]['status'].toLowerCase() == 'success') {
          this.alertMessageDetails.type = 'success';
          this.alertMessageDetails.message = "Rate Plan Mapping Successful";
          self.getAllRoomTypeData();
        } else {
          this.alertMessageDetails.type = 'danger';
          this.alertMessageDetails.message = "Rate Plan Mapping not successful! Please try again.";
        }

        setTimeout(() => {
          this.alertMessageDetails.response = false;
        }, 5000);
        
      });
  }

  public selectRoomTypeCKBStatus(ckBoxType: any) {
    if (ckBoxType == 'all') {
      for (let i = 0; i < this.roomRateMappingDataList.length; i++) {
        this.roomRateMappingDataList[i].checked = this.allRoomUnitMapCkbox;
      }
    } else {
      this.allRoomUnitMapCkbox = this.roomRateMappingDataList.every(rmutItem => rmutItem.checked);
    }
  }

  public selectAmenityCKBStatus(ckBoxType: any) {
    if (ckBoxType == 'all') {
      for (let i = 0; i < this.aminityList.length; i++) {
        this.aminityList[i].checked = this.allAmenityMapCkbox;
      }
    } else {
      this.allAmenityMapCkbox = this.aminityList.every(aminityItem => aminityItem.checked);
    }
  }

  public selectRatePlanCKBStatus(ckBoxType: any) {
    if (ckBoxType == 'all') {
      for (let i = 0; i < this.ratePlanList.length; i++) {
        this.ratePlanList[i].checked = this.allRatePlanMapCkbox;
      }
    } else {
      this.allRatePlanMapCkbox = this.ratePlanList.every(rpmItem => rpmItem.checked);
    }
  }

  public toggleNewRoomType() {
    this.showAddNewRoomType = !this.showAddNewRoomType;
    this.componentRef.directiveRef.scrollToBottom(-140, 300);
    this.addRoomType = {
      basePax: 1,
      basePrice: null,
      extraBedPrice: null,
      extraBedsAllowed: 0,
      extraPersonPrice: null,
      isBaseRoom: false,
      maxPax: 1,
      numberOfRooms: 1,
      roomCode: null,
      roomDesc: null,
      roomName: null,
      roomType: null,
    };
  }
  
}