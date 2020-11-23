import { Component, OnInit, ViewChild } from '@angular/core';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { PerfectScrollbarConfigInterface, PerfectScrollbarComponent } from 'ngx-perfect-scrollbar';

import { AdminRateUpdateService } from './admin.rate.update.service';
import { IRatePlan } from '../rate-plans/RatePlan';
import { IRoomType } from '../../room-manager/room-types/RoomTypes';

import moment from 'moment';
import _ from 'underscore';

export class PriceUpdateObject {
    constructor(public rateCode: string, public fordate: string, public rateamount: number, public invTypeCode: string) { }
    private repetativeUpdateObjectStructure = {
        "ratePlanNotifType": "Delta",
        "ratePlanCode": this.rateCode,
        "start": this.fordate,
        "end": this.fordate,
        "rates": {
            "rates": [
                {
                    "baseByGuestAmts": {
                        "baseByGuestAmt": [
                            {
                                "ageQualifyingCode": 10,
                                "numberOfGuests": 1,
                                "amountAfterTax": 0.0,
                                "amountBeforeTax": this.rateamount
                            }
                        ]
                    },
                    "invTypeCode": this.invTypeCode,
                    "currencyCode": "INR"
                }
            ]
        }
    };

    generatedRateUpdate() {
        return this.repetativeUpdateObjectStructure;
    }
}

@Component({
    selector: 'app-admin-layout-rate-update',
    templateUrl: './admin.rate.update.component.html',
    styles: [
        '::ng-deep.bs-datepicker { left: 100px; top: 5px; }'
    ]
})
export class AdminRateUpdateComponent implements OnInit {

    public alertMessageDetails = {
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
    public ratePlanList: IRatePlan[];
    public roomTypeList: IRoomType[];
    public rateUpdateDatePickerStart: any;
    public rateUpdateDatePickerEnd: any;
    public seletedCalDays: number;
    public masterQuickfill: number;
    public rateUpdateDateList: any = [];
    public ratePriceDateList: any = {};
    public dayCellPercentage: number;
    public selectedRatePlan: {
        id: number,
        name: string
    };

    objectKeys = Object.keys;

    constructor(private _adminData: AdminRateUpdateService) { }

    ngOnInit() {

        let headerBuffer = 60;
        this.scrollBarContainerHeight = $(document).height() - ($("#main-navbar").outerHeight() + $("#sub-navbar").outerHeight() + $("#footerButtonContainer").outerHeight() + $("#pageHeading").outerHeight() + headerBuffer + 155);

        this.rateUpdateDatePickerStart = moment().format('DD-MMM-YYYY');
        this.rateUpdateDatePickerEnd = moment().add(6, 'days').format('DD-MMM-YYYY');
        this.calMaxDate = moment().add(6, 'days').toDate();

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

        this.selectedRatePlan = { id: 0, name: "Select" };

        this._adminData.getDataList('Rateplans/getRateplans/', 'ratePlans', false).subscribe(ratePlanListRes => {
            this.ratePlanList = ratePlanListRes;
        });
        this._adminData.getDataList('Rooms/getRoomTypes/', 'roomTypes', false).subscribe(roomTypeListRes => {
            this.roomTypeList = roomTypeListRes;
        });

        this.onRateUpdateDateChangeCalculateChart();
    }

    public selectPriceManagerRates(rateItem: IRatePlan) {
        //console.log("rate Item: ", this.roomTypeList, _.findWhere(this.roomTypeList, {roomID: 1}));
        this.ratePriceDateList = {};

        this.selectedRatePlan = { id: rateItem.ratePlanID, name: rateItem.ratePlanName };
    }

    public getPriceManagerRates() {
        let requestObj = {
            rateplanID: this.selectedRatePlan.id,
            checkinDate: moment(this.rateUpdateDatePickerStart, 'DD-MMM-YYYY').format('YYYY-MM-DD'),
            checkoutDate: moment(this.rateUpdateDatePickerEnd, 'DD-MMM-YYYY').format('YYYY-MM-DD')
        }
        this._adminData.getData('PriceManager/getPriceManagerRates/', requestObj).subscribe(updatePriceRes => {
            this.ratePriceDateList = _.groupBy(updatePriceRes.priceManagerRates, 'roomID');
            for (let key in this.ratePriceDateList) {
                let room_id: any = key;
                this.ratePriceDateList[key]['roomName'] = _.findWhere(this.roomTypeList, { roomID: room_id * 1 }).roomName;
            }
            console.log("response: ", updatePriceRes, this.ratePriceDateList);
        });
    }

    public onRateUpdateDateChangeCalculateChart(value?: Date) {
        let self = this;
        this.rateUpdateDateList = [];
        this.calMaxDate = moment(this.rateUpdateDatePickerStart, 'DD-MMM-YYYY').add(6, 'days').toDate();
        this.rateUpdateConfigEnd.minDate = moment(this.rateUpdateDatePickerStart, 'DD-MMM-YYYY').toDate();
        this.seletedCalDays = moment(this.rateUpdateDatePickerEnd, 'DD-MMM-YYYY').diff(moment(this.rateUpdateDatePickerStart, 'DD-MMM-YYYY'), 'days') + 1;
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

        if (this.selectedRatePlan.name != 'Select') {
            this.selectPriceManagerRates(_.findWhere(self.ratePlanList, { ratePlanID: self.selectedRatePlan.id }))
        }
    }

    public fillDateVal() {
        if (this.masterQuickfill > 0) {
            for (let dateIndx = 0; dateIndx < this.rateUpdateDateList.length; dateIndx++) {
                this.rateUpdateDateList[dateIndx].fillVal = +this.masterQuickfill;
            };
        }
    }

    public fillDateColumn(dateObj: any) {
        let specificDateObj = null;
        for (let key in this.ratePriceDateList) {
            specificDateObj = _.findWhere(this.ratePriceDateList[key], { forDate: moment(dateObj.dateVal).format('YYYY-MM-DD') });
            if (typeof specificDateObj !== 'undefined') {
                specificDateObj.rateAmount = +dateObj.fillVal;
            }
        }
    }

    public updateRatePrice() {

        let updatedRoomRatePriceObject = {
            "rateplans": {
                "rateplans": [],
                "hotelCode": ""
            },
            "echotoken": new Date().getTime(),
            "timestamp": "",
            "messageContentCode": "8"
        };
        let updateRateObj = null;
        for (let roomid in this.ratePriceDateList) {
            for (let dateIndx = 0; dateIndx < this.seletedCalDays; dateIndx++) {
                updateRateObj = new PriceUpdateObject(
                    this.ratePriceDateList[roomid][dateIndx].ratePlanCode,
                    this.ratePriceDateList[roomid][dateIndx].forDate,
                    this.ratePriceDateList[roomid][dateIndx].rateAmount,
                    this.ratePriceDateList[roomid][dateIndx].invTypeCode
                )
                updatedRoomRatePriceObject.rateplans.rateplans.push(
                    updateRateObj.generatedRateUpdate()
                );
            }
        }

        this._adminData.updatePriceManagerRates('PriceManager/updateARIRates/', updatedRoomRatePriceObject).subscribe(updatePriceRes => {
            //console.log("after update here: ", updatePriceRes);
            this.alertMessageDetails.response = true;
            if (updatePriceRes['successList'][0]['status'].toLowerCase() == 'success') {
                this.alertMessageDetails.type = 'success';
                this.alertMessageDetails.message = updatePriceRes['successList'][0]['message'];
            } else {
                this.alertMessageDetails.type = 'danger';
                this.alertMessageDetails.message = "Rate update failed! Please try again.";
            }

            setTimeout(() => {
                this.alertMessageDetails.response = false;
            }, 5000);
        });
    }

    public resetRatePrice() {
        this.masterQuickfill = null;
        this.fillDateVal();
        for (let key in this.ratePriceDateList) {
            for (let indx = 0; indx < this.ratePriceDateList[key].length; indx++) {
                this.ratePriceDateList[key][indx].rateAmount = null;
            }

        }
    }
}
