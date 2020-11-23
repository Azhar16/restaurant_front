import { Component, OnInit, ViewChild } from '@angular/core';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { PerfectScrollbarConfigInterface, PerfectScrollbarComponent } from 'ngx-perfect-scrollbar';

import { AdminAvailAndRestrictService } from './admin.avail.and.resrtict.service';
import { IRatePlan } from '../../../../ui/frontdesk/Frontdesk';
import { IRoomType } from '../../room-manager/room-types/RoomTypes';

import * as $ from 'jquery';
import moment from 'moment';
import _ from 'underscore';

export class PriceAvailRestrictionObject {

    constructor(
        public avail: number, public mlos: number, public maxLOS: number,
        public cta: boolean, public ctd: boolean, public stopSell: boolean,
        public fordate: string, public roomId: string, public ratePlanId: string,
        public invTypeCode: string, public ratePlanCode: string, public indexVal: number
    ) { }
    private repetativeUpdateObjectStructure = {
        "bookingLimit": this.avail,
        "messageType": "SetLimit",
        "statusApplicationControl": {
            "start": this.fordate,
            "end": this.fordate,
            "invTypeCode": this.invTypeCode,
            "ratePlanCode": this.ratePlanCode
        },
        "uniquID": {
            "type": "16",
            "id": this.indexVal
        },
        "restrictionsStatus": {
            "restrictionStatus": [
                {
                    "restriction": "Arrival",
                    "status": this.cta ? "Close" : "Open"
                },
                {
                    "restriction": "Departure",
                    "status": this.ctd ? "Close" : "Open"
                },
                {
                    "restriction": "Master",
                    "status": this.stopSell ? "Close" : "Open"
                }
            ]
        },
        "lenthsOfStay": {
            "lengthsOfStay": [
                {
                    "minMaxMessageType": "SetMinLOS",
                    "time": this.mlos,
                    "timeUnit": "Day"
                },
                {
                    "minMaxMessageType": "SetMaxLOS",
                    "time": this.maxLOS,
                    "timeUnit": "Day"
                }
            ]
        }

    };

    generatedAvailRestrictionUpdate() {
        return this.repetativeUpdateObjectStructure;
    }
}

@Component({
    selector: 'app-admin-layout-rate-availability-restriction',
    templateUrl: './admin.rate.availability.restriction.component.html',
    styles: [
        '::ng-deep.bs-datepicker { left: 100px; top: 5px; }'
    ]
})
export class AdminRateAvailabilityComponent implements OnInit {

    alertMessageDetails = {
        response: false,
        type: null,
        message: null
    };
    public config: PerfectScrollbarConfigInterface = {};
    public scrollBarContainerHeight: number;
    @ViewChild(PerfectScrollbarComponent) componentRef?: PerfectScrollbarComponent;

    rateUpdateConfigStart: Partial<BsDatepickerConfig>;
    rateUpdateConfigEnd: Partial<BsDatepickerConfig>;

    public calMaxDate: any;
    public rateUpdateDatePickerStart: any;
    public rateUpdateDatePickerEnd: any;
    public seletedCalDays: number;
    public rateUpdateDateList: any = [];
    public dayCellPercentage: number;
    public ratePlanList: IRatePlan[];
    public roomTypeList: IRoomType[];
    public ratePlanRoomTypeMapping: any[];
    public mappedRoomList: IRoomType[]; // this variable for mapping the room list on rate plan selection
    public selectedRatePlan: IRatePlan;
    public selectedRoomCount: number;
    public selectedOptions: string;
    public showSelectedOption: string;
    public fullDataList: any;
    public quickFillMasterInput: any;

    constructor(private _adminData: AdminAvailAndRestrictService) { }

    ngOnInit() {

        let headerBuffer = 60;
        this.scrollBarContainerHeight = $(document).height() - ($("#main-navbar").outerHeight() + $("#sub-navbar").outerHeight() + $("#footerButtonContainer").outerHeight() + $("#pageHeading").outerHeight() + headerBuffer + 155);

        this.quickFillMasterInput = null;
        this.fullDataList = {};
        this.selectedRoomCount = 0;
        this.selectedOptions = 'avail';
        this.showSelectedOption = 'Avail';
        this._adminData.getAvailAndRestrictData().subscribe(availRestrictRes => {
            this.ratePlanList = availRestrictRes[0];
            this.roomTypeList = availRestrictRes[1];
            this.ratePlanRoomTypeMapping = availRestrictRes[2];
            this.selectedRatePlan = null;
        });

        this.rateUpdateConfigStart = Object.assign({}, {
            containerClass: 'theme-blue',
            dateInputFormat: 'DD-MMM-YYYY',
            minDate: new Date(),
            showWeekNumbers: false
        });

        this.rateUpdateConfigEnd = Object.assign({}, {
            containerClass: 'theme-blue',
            dateInputFormat: 'DD-MMM-YYYY',
            minDate: new Date(),
            showWeekNumbers: false
        });

        this.rateUpdateDatePickerStart = moment().format('DD-MMM-YYYY');
        this.rateUpdateDatePickerEnd = moment().add(6, 'days').format('DD-MMM-YYYY');
        this.calMaxDate = moment().add(6, 'days').toDate();
        this.onRateUpdateDateChangeCalculateChart();
    }

    public onRateUpdateDateChangeCalculateChart(value?: Date) {
        this.rateUpdateDateList = [];
        this.seletedCalDays = moment(this.rateUpdateDatePickerEnd, 'DD-MMM-YYYY').diff(moment(this.rateUpdateDatePickerStart, 'DD-MMM-YYYY'), 'days') + 1;
        this.calMaxDate = moment(this.rateUpdateDatePickerStart, 'DD-MMM-YYYY').add(6, 'days').toDate();
        this.rateUpdateConfigEnd.minDate = moment(this.rateUpdateDatePickerStart, 'DD-MMM-YYYY').toDate();
        if (this.seletedCalDays < 0) {
            this.rateUpdateDatePickerEnd = this.rateUpdateDatePickerStart;
            this.seletedCalDays = moment(this.rateUpdateDatePickerEnd, 'DD-MMM-YYYY').diff(moment(this.rateUpdateDatePickerStart, 'DD-MMM-YYYY'), 'days') + 1;
        }
        let startDate = moment(this.rateUpdateDatePickerStart, 'DD-MMM-YYYY').clone();
        while (moment(this.rateUpdateDatePickerEnd, 'DD-MMM-YYYY').diff(moment(startDate, 'DD-MMM-YYYY')) >= 0) {
            //console.log( moment(startDate, 'DD-MMM-YYYY').format('DD-MMM-YYYY'), moment(startDate, 'DD-MMM-YYYY').format('DD-MMM-YYYY') == moment(this.tcDatePickerEnd, 'DD-MMM-YYYY').format('DD-MMM-YYYY'));
            this.rateUpdateDateList.push({
                dateVal: startDate.toDate(),
                fillVal: null
            });
            startDate = startDate.add(1, 'days');
        }
        this.dayCellPercentage = 82 / this.seletedCalDays;
        // console.log("after while: ", this.rateUpdateDateList);
    }

    public getMappedRoom(ratePlanItem: IRatePlan) {
        let self = this;
        this.selectedRatePlan = ratePlanItem;
        this.mappedRoomList = [];
        this.roomTypeList.map(roomTypeItem => {
            let ratePlanRoomTypeMappingObj = _.findWhere(self.ratePlanRoomTypeMapping, { roomId: roomTypeItem.roomID, rateCode: ratePlanItem.ratePlanCode });
            if (typeof (ratePlanRoomTypeMappingObj) !== 'undefined') {
                roomTypeItem['checked'] = false;
                this.mappedRoomList.push(roomTypeItem)
            }
        });
        this.selectedRoomCount = 0;
        //console.log("after the mapped object: ", this.mappedRoomList);
    }

    roomSelectionForUpdate() {
        this.fullDataList = {};
        this.selectedRoomCount = 0;
        for (let indx = 0; indx < this.mappedRoomList.length; indx++) {
            if (this.mappedRoomList[indx].checked === true) {
                this.fullDataList[this.mappedRoomList[indx].roomID] = [];
                this.selectedRoomCount++;
            }
        }
        // console.log('mappedRoomItem: ', this.mappedRoomList, this.fullDataList, this.selectedRoomCount);
    }

    roomStatusOptionChange(roomStatus: string) {
        this.selectedOptions = roomStatus;
        this.showSelectedOption = roomStatus == 'avail' ? 'Avail' : (roomStatus == 'stopSell' ? 'Stop Sell' : roomStatus.toUpperCase());
        this.quickFillMasterInput = null;
        for (let indx = 0; indx < this.rateUpdateDateList.length; indx++) {
            this.rateUpdateDateList[indx].fillVal = null;
        }
    }

    showAvailRestrictionDetails() {
        // $("#button-room").trigger("click");
        let requestObj = {};
        const mappedRoomListLength = this.mappedRoomList.length;
        for (let roomIndex = 0; roomIndex < mappedRoomListLength; roomIndex++) {
            if (this.mappedRoomList[roomIndex].checked) {
                requestObj = {
                    checkinDate: moment(this.rateUpdateDatePickerStart, 'DD-MMM-YYYY').format('YYYY-MM-DD'),
                    checkoutDate: moment(this.rateUpdateDatePickerEnd, 'DD-MMM-YYYY').format('YYYY-MM-DD'),
                    rateplanID: this.selectedRatePlan.ratePlanID,
                    roomID: this.mappedRoomList[roomIndex].roomID
                };
                // console.log('before getting response: ', JSON.stringify(this.fullDataList));
                this._adminData.getData('PriceManager/getAvailRestrictions/', requestObj).subscribe(availRestrictionResponse => {
                    this.fullDataList[availRestrictionResponse.availRestriction[0].roomId] = availRestrictionResponse.availRestriction;
                    // console.log('after getting response loop: ', availRestrictionResponse.availRestriction[0].roomId, availRestrictionResponse.availRestriction);
                    // console.log('after getting response: ', JSON.stringify(this.fullDataList));
                });
            }
        }


        // console.log('after all response: ', this.fullDataList, this.rateUpdateDateList);
    }

    fillDateVal() {
        console.log('in smart fill: ', this.quickFillMasterInput);
        if (this.quickFillMasterInput > 0 || this.quickFillMasterInput !== null) {
            for (let dateIndx = 0; dateIndx < this.rateUpdateDateList.length; dateIndx++) {
                this.rateUpdateDateList[dateIndx].fillVal = +this.quickFillMasterInput;
            };
        }
    }

    fillDateColumn(dateValue: any) {
        let specificDateObj = null;
        for (let key in this.fullDataList) {
            specificDateObj = _.findWhere(this.fullDataList[key], { forDate: moment(dateValue.dateVal).format('YYYY-MM-DD') });
            // console.log("dateValue: ", dateValue, this.selectedOptions, specificDateObj);
            if (typeof specificDateObj !== 'undefined') {
                specificDateObj[this.selectedOptions] = +dateValue.fillVal;
            }
        }
    }

    updateAvailRestrictionData() {

        let updatedRoomRatePriceObject = {
            "availStatusMessages": {
                "hotelCode": "",
                "availStatusMessage": [],
            },
            "echotoken": new Date().getTime(),
            "timestamp": "",
            "messageContentCode": "8"
        };
        let updateRateObj = null;
        let updateIndexId = 0;
        for (let roomid in this.fullDataList) {
            for (let dateIndx = 0; dateIndx < this.seletedCalDays; dateIndx++) {
                // console.log('this.fullDataList[roomid]: ', this.fullDataList[roomid]);
                updateRateObj = new PriceAvailRestrictionObject(
                    this.fullDataList[roomid][dateIndx].avail,
                    this.fullDataList[roomid][dateIndx].mlos,
                    this.fullDataList[roomid][dateIndx].maxLOS,
                    this.fullDataList[roomid][dateIndx].cta,
                    this.fullDataList[roomid][dateIndx].ctd,
                    this.fullDataList[roomid][dateIndx].stopSell,
                    this.fullDataList[roomid][dateIndx].forDate,
                    this.fullDataList[roomid][dateIndx].roomId,
                    this.fullDataList[roomid][dateIndx].ratePlanId,
                    this.fullDataList[roomid][dateIndx].invTypeCode,
                    this.fullDataList[roomid][dateIndx].ratePlanCode,
                    ++updateIndexId
                )
                updatedRoomRatePriceObject.availStatusMessages.availStatusMessage.push(
                    updateRateObj.generatedAvailRestrictionUpdate()
                );
            }
        }

        this._adminData.updateAvailAndRestrictData('PriceManager/updateARIAvailRestriction/', updatedRoomRatePriceObject).subscribe(updateAvailAndRestrictRes => {
            // console.log('updatedRoomRatePriceObject: ', updatedRoomRatePriceObject, updateAvailAndRestrictRes);
            this.alertMessageDetails.response = true;
            if (updateAvailAndRestrictRes['successList'][0]['status'].toLowerCase() == 'success') {
                this.alertMessageDetails.type = 'success';
                this.alertMessageDetails.message = updateAvailAndRestrictRes['successList'][0]['message'];
            } else {
                this.alertMessageDetails.type = 'danger';
                this.alertMessageDetails.message = "Availability Restriction update failed! Please try again.";
            }

            setTimeout(() => {
                this.alertMessageDetails.response = false;
            }, 5000);
        });
    }
}
