import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { PerfectScrollbarConfigInterface, PerfectScrollbarComponent } from 'ngx-perfect-scrollbar';

import momentTimezone from 'moment-timezone';
import moment from 'moment';

import { AdminGeneralPropertyService } from './admin.general.property.service';
import { ConfirmPopupComponent } from '../../../shared/components/confirm.popup.component';
import { ICurrency, ILanguage } from './GeneralProperty';

@Component({
  templateUrl: './admin.general.property.component.html'
})
export class GeneralPropertyComponent implements OnInit {

  public alertMessageDetails = {
    response: false,
    type: null,
    message: null
  };

  public currencyMasterDataList: ICurrency[];
  public languageMasterDataList: ILanguage[];
  public selectedLanguage: string;
  public selectedCurrency: string;
  public generalComponentData: any;
  public checkinTime: Date;
  public checkoutTime: Date;
  public timezoneList: any[];
  public config: PerfectScrollbarConfigInterface = {};

  public slcTimezone: string;
  public timezonefilter: string;
  public now: number;
  public scrollBarContainerHeight: number;

  public dateFormat: any;
  public dateFormatList: any[];
  public yearList: any[];

  @ViewChild(PerfectScrollbarComponent) componentRef?: PerfectScrollbarComponent;

  constructor(
    private _adminData: AdminGeneralPropertyService
  ) {
    this.now = Date.now();
    setInterval(() => {
      this.now = Date.now();
    }, 1000);
  }

  ngOnInit() {
    //this.slcTimezone = 'Asia/Calcutta(+5:30)';
    this.timezoneList = [];
    this.timezonefilter = '';

    this.yearList = [];
    let yearValue = new Date().getFullYear();
    for (let yearIndex = -1; yearIndex < 5; yearIndex++) {
      this.yearList.push(yearValue + yearIndex);
    }

    momentTimezone.tz.names().forEach(element => {
      this.timezoneList.push(
        element + '(' + momentTimezone().tz(element).format('Z') + ')'
      );
    });

    //let headerBuffer = 420;
    //this.scrollBarContainerHeight = $(document).height() - ($("#main-navbar").outerHeight() + $("#sub-navbar").outerHeight() + headerBuffer);
    //console.log("element height: ",$(document).height(), $("#main-navbar").outerHeight(), $("#sub-navbar").outerHeight(),  headerBuffer);

    this.dateFormatList = [
      { key: 'DD/MM/YY', value: 'dd/MM/yy' },
      { key: 'MM/DD/YY', value: 'MM/dd/yy' },
      { key: 'YY/MM/DD', value: 'yy/MM/dd' },
      { key: 'DD MMM, YYYY', value: 'dd MMM, yyyy' },
      { key: 'YYYY-MM-DD', value: 'yyyy-MM-dd' }
    ];
    
    this.getGeneralPropertyDetails();
  }

  public getGeneralPropertyDetails() {
    let self = this;

    this._adminData.generalSettingsData().subscribe(generalSettingsResponse=> {
      self.currencyMasterDataList = generalSettingsResponse[0];
      self.languageMasterDataList = generalSettingsResponse[1];
      self.generalComponentData = generalSettingsResponse[2];

      self.dateFormat = self.dateFormatList.filter(dateItem => { return dateItem.key == self.generalComponentData.dateFormat })[0];
      console.log("dateformat: ", self.dateFormat);
      self.checkinTime = moment(self.generalComponentData.checkinTime, 'h:mm a').toDate();
      self.checkoutTime = moment(self.generalComponentData.checkOutTime, 'h:mm a').toDate();
      self.selectedLanguage = self.languageMasterDataList.filter((lngItem:ILanguage) => { return lngItem.languageCode == self.generalComponentData.defaultLanguage})[0]['languageText'];
      

      let headerBuffer = 200;
      self.scrollBarContainerHeight = $(document).height() - ($("#main-navbar").outerHeight() + $("#sub-navbar").outerHeight() + headerBuffer);
    });
  }

  public preventClose(event: MouseEvent) {
    event.stopImmediatePropagation();
  }

  public updateGeneralSettings() {
    console.log("in general settings: ", this.checkinTime, this.checkoutTime);
    this.generalComponentData.checkinTime = moment(this.checkinTime).format('h:mm a');
    this.generalComponentData.checkOutTime = moment(this.checkoutTime).format('h:mm a');
    this._adminData.updateData('Config/Property/propertyConfiguration/', this.generalComponentData).subscribe(updateSettingsRes => {
      console.log("on update: ", this.generalComponentData, updateSettingsRes);
      this.alertMessageDetails.response = true;
      if (updateSettingsRes['successList'][0]['status'].toLowerCase() == 'success') {
        this.alertMessageDetails.type = 'success';
        this.alertMessageDetails.message = updateSettingsRes['successList'][0]['message'];
      } else {
        this.alertMessageDetails.type = 'danger';
        this.alertMessageDetails.message = "HotelSettings update failed! Please try again.";
      }

      setTimeout(() => {
        this.alertMessageDetails.response = false;
      }, 5000);

    });
  }

}