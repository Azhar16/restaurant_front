import {
  Component,
  OnInit,
  TemplateRef,
  QueryList,
  ViewChild,
  ViewChildren,
  ElementRef,
} from "@angular/core";
import { DayPilot, DayPilotModalComponent } from "daypilot-pro-angular";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { BsModalRef } from "ngx-bootstrap/modal/bs-modal-ref.service";
import { BsModalService } from "ngx-bootstrap/modal";

import {
  PerfectScrollbarConfigInterface,
  PerfectScrollbarComponent,
} from "ngx-perfect-scrollbar";
import { PopoverDirective } from "ngx-bootstrap/popover";
import { Router } from "@angular/router";

import { RouteParameterService } from "../../../shared/route.parameter.service";
import { BsDatepickerConfig } from "ngx-bootstrap/datepicker";

import moment from "moment";
import momentTimezone from "moment-timezone";

import { ConfirmPopupComponent } from "../../../shared/components/confirm.popup.component";
import {
  ICurrency,
  ILanguage,
} from "../../../admin/admin-layout/general-property/GeneralProperty";
import { AdminGeneralPropertyService } from "../../../admin/admin-layout/general-property/admin.general.property.service";
import { IGeneral, IBasic, IAdvance } from "./general";

import { GeneralService } from "../../services/restaurant/general.service";

import { AlertService } from "../../../shared/modules/alert/services/alert.service";

import { Ng4LoadingSpinnerService } from "ng4-loading-spinner";

declare const jQuery: any;
@Component({
  selector: "app-restaurent-general",
  templateUrl: "./restaurent-general.component.html",
  styleUrls: ["./restaurent-general.component.scss"],
})
export class RestaurentGeneralComponent implements OnInit {
  public currencyMasterDataList: ICurrency[];
  public languageMasterDataList: ILanguage[];
  public selectedLanguage: string;
  public selectedCurrency: string;
  public generalComponentData: any;
  public checkinTime: Date;
  public checkoutTime: Date;
  public timezoneList = [];

  popoverMessage2 = "Do you want to proceed?";
  popoverTitle2 = "";
  confirmText1: string = "Yes";
  cancelText1: string = "No";

  public slcTimezone: string;
  public timezonefilter: string;
  public now: number;

  public dateFormat = [];
  public dateFormatList = [];
  public yearList: any[];

  private showAddAminity: boolean = false;

  bsConfigFinYearStart: Partial<BsDatepickerConfig>;
  bsConfigFinYearEnd: Partial<BsDatepickerConfig>;
  modalRef: BsModalRef;
  alertMessageDetails = {
    response: false,
    type: null,
    message: null,
  };
  userData: any;
  // public config: PerfectScrollbarConfigInterface = {};
  public scrollBarContainerHeight: number;

  public shiftStartTime: any;
  public shiftEndTime: any;

  public generalList: IGeneral[];
  public basicList: IBasic[];
  public advanceList: IAdvance[];
  cancelClicked = true;

  miniuteData = [
    "00",
    "01",
    "02",
    "03",
    "04",
    "05",
    "06",
    "07",
    "08",
    "09",
    "10",
    "11",
    "12",
    "13",
    "14",
    "15",
    "16",
    "17",
    "18",
    "19",
    "20",
    "21",
    "22",
    "23",
    "24",
    "25",
    "26",
    "27",
    "28",
    "29",
    "30",
    "31",
    "32",
    "33",
    "34",
    "35",
    "36",
    "37",
    "38",
    "39",
    "40",
    "41",
    "42",
    "43",
    "44",
    "45",
    "46",
    "47",
    "48",
    "49",
    "50",
    "51",
    "52",
    "53",
    "54",
    "55",
    "56",
    "57",
    "58",
    "59",
  ];

  generalData = {
    name: "",
    phoneNO: "",
    city: "",
    state: "",
    mobleno: "",
    address: "",
    zipCode: "",
    country: "",
    website: "",
    email: "",
    gstNo: "",
    restaurantId: 0,
  };
  basicData = {
    restaurantName: "",
    finYearFrom: "",
    finYearTo: "",
    counterTimingFrom1: "",
    counterTimingFrom2: "",
    counterTimingFrom3: "",
    counterTimingTo1: "",
    counterTimingTo2: "",
    counterTimingTo3: "",
    currency: "",
    noOfRestaurant: "",
    noOfBanquet: "",
    defaultLanguage: "",
    dateFormat: "",
    timeZone: "",
    timeFormat: "",
    decimalPlace: "",
    restaurantMastId: 0,
    basicSettingsId: 0,
  };
  advanceRestaurantData = {
    restName: "",
    restaurantName: "",
    managerName: "",
    noOfTable: "",
    noOfStaff: "",
    phoneNo: "",
    restBanType: "",
    id: 0,
    restaurantId: 0,
  };
  advanceBanqueteData = {
    restName: "",
    restaurantName: "",
    managerName: "",
    noOfTable: "",
    noOfStaff: "",
    phoneNo: "",
    restBanType: "",
    id: 0,
    restaurantId: 0,
  };
  generalSavedata: any;
  CurrencyTypeMaster: any;
  CurrencyConverterTypeMaster: any;
  restaurantTypeMaster: any;
  basicSavedata: any;
  advanceRestaurantSavedata: any;
  advanceBanaquteSavedata: any;

  constructor(
    private modalService: BsModalService,
    private _adminData: AdminGeneralPropertyService,
    private router: Router,
    private generalService: GeneralService,
    private routeParamService: RouteParameterService,
    private alertSerive: AlertService,
    private spinner: Ng4LoadingSpinnerService
  ) {
    this.bsConfigFinYearStart = Object.assign(
      {},
      {
        containerClass: "theme-blue",
        dateInputFormat: "DD-MMM-YYYY",
        //minDate: new Date(),
        showWeekNumbers: false,
      }
    );
    this.bsConfigFinYearEnd = Object.assign(
      {},
      {
        containerClass: "theme-blue",
        dateInputFormat: "DD-MMM-YYYY",
        //minDate: new Date(),
        showWeekNumbers: false,
      }
    );
    this.now = Date.now();
    setInterval(() => {
      this.now = Date.now();
    }, 1000);
  }

  ngOnInit() {
    /* var gentab = document.querySelector(".cont");
    gentab.addEventListener("click", function(){
      gentab.parentNode.classList.add("active");
    }); */

    /*	jQuery('.cont').click(function(){

 // var nextId = jQuery(this).parents('.tab-pane').next().attr("id");
 // jQuery('ul li a[href="' + nextId + '"]').tab('show');

})*/
    //this.slcTimezone = 'Asia/Calcutta(+5:30)';
    this.basicData.finYearFrom = moment().format("DD-MMM-YYYY");
    this.basicData.finYearTo = moment().format("DD-MMM-YYYY");
    this.timezoneList = [];
    this.timezonefilter = "";

    this.yearList = [];
    let yearValue = new Date().getFullYear();
    for (let yearIndex = -1; yearIndex < 5; yearIndex++) {
      this.yearList.push(yearValue + yearIndex);
    }

    momentTimezone.tz.names().forEach((element) => {
      this.timezoneList.push(
        element + "(" + momentTimezone().tz(element).format("Z") + ")"
      );
    });

    //let headerBuffer = 420;
    //this.scrollBarContainerHeight = $(document).height() - ($("#main-navbar").outerHeight() + $("#sub-navbar").outerHeight() + headerBuffer);
    //console.log("element height: ",$(document).height(), $("#main-navbar").outerHeight(), $("#sub-navbar").outerHeight(),  headerBuffer);

    this.dateFormatList = [
      { key: "DD/MM/YY", value: "dd/MM/yy" },
      { key: "MM/DD/YY", value: "MM/dd/yy" },
      { key: "YY/MM/DD", value: "yy/MM/dd" },
      { key: "DD MMM, YYYY", value: "dd MMM, yyyy" },
      { key: "YYYY-MM-DD", value: "yyyy-MM-dd" },
    ];

    //this.getGeneralPropertyDetails();
    console.log("generalComponentData", this.generalComponentData);
    this.CurrencyTypeMasterDropdown();
    this.CurrencyConverterTypeMasterDropdown();
    this.restaurantTypeMasterDropdown();

    this.generalDetails();
    this.basicDetils();
    this.advanceRestaurantDetails();
    this.advanceBanaquteDetails();
  }
  generalDetails() {
    this.generalService.getRestaurantMastDetails().subscribe((res) => {
      console.log("res: ", res);
      var gdata = res["resObject"][0];

      this.generalData.name = gdata.restaurantName;
      this.generalData.phoneNO = gdata.contactNo;
      this.generalData.city = gdata.city;
      this.generalData.state = gdata.state;
      this.generalData.mobleno = gdata.mobileNo;
      this.generalData.address = gdata.address;
      this.generalData.zipCode = gdata.pincode;
      this.generalData.country = gdata.country;
      this.generalData.website = gdata.website;
      this.generalData.email = gdata.contactMail;
      this.generalData.gstNo = gdata.gstNo;
      this.generalData.restaurantId = gdata.restaurantId;

      console.log("generalData: ", this.generalData);
    });
  }

  basicDetils() {
    this.generalService.getRestaurantBasicSettingDetails().subscribe((res) => {
      console.log("res: ", res);
      var gdata = res["resObject"][0];
      console.log("gdata basicData==", gdata);
      this.basicData.finYearFrom = gdata.financialYearFrom;
      this.basicData.finYearTo = gdata.financialYearTo;
      // this.generalData.state = gdata.restaurantName;
      this.basicData.counterTimingFrom1 = gdata.counterStartTime1;
      this.basicData.counterTimingFrom2 = gdata.counterStartTime2;
      this.basicData.counterTimingFrom3 = gdata.counterStartTime3;

      this.basicData.counterTimingTo1 = gdata.counterEndTime1;
      this.basicData.counterTimingTo2 = gdata.counterEndTime2;
      this.basicData.counterTimingTo3 = gdata.counterEndTime3;

      this.basicData.currency = gdata.currencyId;
      this.basicData.noOfRestaurant = gdata.noOfRestaurant;
      this.basicData.noOfBanquet = gdata.noOfBanquet;
      this.basicData.defaultLanguage = gdata.languageType;
      this.basicData.dateFormat = gdata.dateFormat;
      this.basicData.timeZone = gdata.timeZone;
      this.basicData.timeFormat = gdata.timeFormat;
      this.basicData.decimalPlace = gdata.gstNo;
      this.basicData.restaurantMastId = gdata.restaurantId;
      this.basicData.basicSettingsId = gdata.basicSettingsId;

      console.log("basicData: ", this.basicData);
    });
  }

  advanceRestaurantDetails() {
    this.generalService.getRestaurantAdvanceDetails("R").subscribe((res) => {
      console.log("res: ", res);
      var gdata = res["resObject"][0];
      console.log("gdata==", gdata);
      this.advanceRestaurantData.restaurantName = gdata.resBanName;
      this.advanceRestaurantData.managerName = gdata.managerName;
      this.advanceRestaurantData.noOfTable = gdata.noOfTable;

      this.advanceRestaurantData.noOfStaff = gdata.noOfStaff;
      this.advanceRestaurantData.phoneNo = gdata.phoneNo;
      this.advanceRestaurantData.id = gdata.id;
      this.advanceRestaurantData.restaurantId = gdata.retaurantId;
      //console.log("generalData: ", this.generalData);
    });
  }
  advanceBanaquteDetails() {
    this.generalService.getRestaurantAdvanceDetails("B").subscribe((res) => {
      console.log("res: ", res);
      var gdata = res["resObject"][0];
      console.log("gdata==", gdata);
      this.advanceBanqueteData.restaurantName = gdata.resBanName;
      this.advanceBanqueteData.managerName = gdata.managerName;
      this.advanceBanqueteData.noOfTable = gdata.noOfTable;
      this.advanceBanqueteData.noOfStaff = gdata.noOfStaff;

      this.advanceBanqueteData.phoneNo = gdata.phoneNo;
      this.advanceBanqueteData.id = gdata.id;
      this.advanceBanqueteData.restaurantId = gdata.retaurantId;
      //console.log("generalData: ", this.generalData);
    });
  }

  public getGeneralPropertyDetails() {
    let self = this;

    this._adminData
      .generalSettingsData()
      .subscribe((generalSettingsResponse) => {
        self.currencyMasterDataList = generalSettingsResponse[0];
        self.languageMasterDataList = generalSettingsResponse[1];
        self.generalComponentData = generalSettingsResponse[2];

        self.dateFormat = self.dateFormatList.filter((dateItem) => {
          return dateItem.key == self.generalComponentData.dateFormat;
        })[0];
        console.log("dateformat: ", self.dateFormat);
        self.checkinTime = moment(
          self.generalComponentData.checkinTime,
          "h:mm a"
        ).toDate();
        self.checkoutTime = moment(
          self.generalComponentData.checkOutTime,
          "h:mm a"
        ).toDate();
        // self.selectedLanguage = self.languageMasterDataList.filter(
        //   (lngItem: ILanguage) => {
        //     return (
        //       lngItem.languageCode == self.generalComponentData.defaultLanguage
        //     );
        //   }
        // )[0]["languageText"];
        // console.log(this.generalComponentData.defaultCurrency);
        console.log("generalComponentData1", this.generalComponentData);
        let headerBuffer = 200;
        self.scrollBarContainerHeight =
          $(document).height() -
          ($("#main-navbar").outerHeight() +
            $("#sub-navbar").outerHeight() +
            headerBuffer);
      });
  }

  public preventClose(event: MouseEvent) {
    event.stopImmediatePropagation();
  }
  public setSift(shiftType, key, value) {
    console.log("in set shift: ", shiftType, key, value);
    if (shiftType == "start") {
      this.shiftStartTime[key] = value;
    } else {
      this.shiftEndTime[key] = value;
    }
  }
  public addAminity() {
    this.showAddAminity = !this.showAddAminity;
    // this.componentRef.directiveRef.scrollToBottom(-40, 300);
  }

  generalInfoAdd() {
    var intRegex = /^((\\+91-?)|0)?[0-9]{10}$/;
    var intRegexEmail = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (this.generalData.name == "") {
      this.alertSerive.create(
        "", //title
        "danger", //type
        20000, // time
        "Please Enter Name!" //body
      );
    } else if (this.generalData.mobleno == "") {
      this.alertSerive.create(
        "", //title
        "danger", //type
        20000, // time
        "Please Enter Mobile No!" //body
      );
    } else if (this.generalData.phoneNO == "") {
      this.alertSerive.create(
        "", //title
        "danger", //type
        20000, // time
        "Please Enter Phone No!" //body
      );
    } else if (
      this.generalData.phoneNO.length < 10 ||
      !intRegex.test(this.generalData.phoneNO)
    ) {
      this.alertSerive.create(
        "", //title
        "danger", //type
        20000, // time
        "Please Enter valid Phone No!" //body
      );
    } else if (
      this.generalData.mobleno.length < 10 ||
      !intRegex.test(this.generalData.mobleno)
    ) {
      this.alertSerive.create(
        "", //title
        "danger", //type
        20000, // time
        "Please Enter valid Mobile No!" //body
      );
    } else if (!intRegexEmail.test(this.generalData.email)) {
      this.alertSerive.create(
        "", //title
        "danger", //type
        20000, // time
        "Please Enter valid Email!" //body
      );
    } else if (this.generalData.address == "") {
      this.alertSerive.create(
        "", //title
        "danger", //type
        20000, // time
        "please Enter Address!" //body
      );
    } else if (this.generalData.city == "") {
      this.alertSerive.create(
        "", //title
        "danger", //type
        20000, // time
        "please Enter City!" //body
      );
    } else if (this.generalData.email == "") {
      this.alertSerive.create(
        "", //title
        "danger", //type
        20000, // time
        "please Enter Email!" //body
      );
    } else if (this.generalData.state == "") {
      this.alertSerive.create(
        "", //title
        "danger", //type
        20000, // time
        "please Enter State!" //body
      );
    } else if (this.generalData.gstNo == "") {
      this.alertSerive.create(
        "", //title
        "danger", //type
        20000, // time
        "please Enter Gst No!" //body
      );
    } else if (this.generalData.country == "") {
      this.alertSerive.create(
        "", //title
        "danger", //type
        20000, // time
        "please Enter Country!" //body
      );
    } else if (this.generalData.website == "") {
      this.alertSerive.create(
        "", //title
        "danger", //type
        20000, // time
        "please Enter Website!" //body
      );
    } else if (this.generalData.zipCode == "") {
      this.alertSerive.create(
        "", //title
        "danger", //type
        20000, // time
        "please Enter zip Code!" //body
      );
    } else {
      console.log("RestaurantGeneralData old", this.generalData);
      if (this.generalData.restaurantId == 0) {
        this.spinner.show();
        this.generalService
          .addRestaurantGeneralinfo(this.generalData)
          .subscribe((res) => {
            console.log("generalData", this.generalData);
            console.log("res", res);
            if (this.generalData.name != "") {
              localStorage.setItem("reststoragename", this.generalData.name);
            }
            this.generalSavedata = res;
            if (this.generalSavedata.status == "Success") {
              console.log("add successfull");
              //  this.alerts.setMessage('Restaurant General Data Added successfully!','success');
              this.alertSerive.create(
                "", //title
                "success", //type
                5000, // time
                "Information Saved Successfully!" //body
              );
              this.generalData = {
                name: "",
                phoneNO: "",
                city: "",
                state: "",
                mobleno: "",
                address: "",
                zipCode: "",
                country: "",
                website: "",
                email: "",
                gstNo: "",
                restaurantId: 0,
              };
              this.ngOnInit();
              this.spinner.hide();
            } else {
              this.alertSerive.create(
                "", //title
                "danger", //type
                5000, // time
                "Open a Counter First!" //body
              );
            }
          });
      } else if (this.generalData.restaurantId > 0) {
        this.spinner.show();
        this.generalService
          .editRestaurantGeneralinfo(this.generalData)
          .subscribe((res) => {
            console.log("generalData", this.generalData);
            console.log("res", res);
            if (this.generalData.name != "") {
              localStorage.setItem("reststoragename", this.generalData.name);
            }
            this.generalSavedata = res;
            if (this.generalSavedata.status == "Success") {
              console.log("add successfull");
              //  this.alerts.setMessage('Restaurant General Data Added successfully!','success');
              this.alertSerive.create(
                "", //title
                "success", //type
                5000, // time
                "Information Saved Successfully!" //body
              );
              this.ngOnInit();
              this.spinner.hide();
            } else {
              this.alertSerive.create(
                "", //title
                "danger", //type
                5000, // time
                "Open a Counter First!" //body
              );
            }
          });
      }
    }
  }
  clearSearch() {
    this.generalData = {
      name: "",
      phoneNO: "",
      city: "",
      state: "",
      mobleno: "",
      address: "",
      zipCode: "",
      country: "",
      website: "",
      email: "",
      gstNo: "",
      restaurantId: 0,
    };
  }
  CurrencyTypeMasterDropdown() {
    this.generalService.getCurrencyList().subscribe((res) => {
      console.log("res: ", res);
      this.CurrencyTypeMaster = res["resObject"];
      console.log("CurrencyTypeMaster", this.CurrencyTypeMaster);
    });
  }
  CurrencyConverterTypeMasterDropdown() {
    this.generalService.getCurrencyConverterList().subscribe((res) => {
      console.log("res: ", res);
      this.CurrencyConverterTypeMaster = res["resObject"];
      console.log(
        "CurrencyConverterTypeMaster",
        this.CurrencyConverterTypeMaster
      );
    });
  }
  restaurantTypeMasterDropdown() {
    this.generalService.getRestaurantType().subscribe((res) => {
      console.log("res: ", res);
      this.restaurantTypeMaster = res["resObject"];
      console.log("restaurantTypeMaster", this.restaurantTypeMaster);
    });
  }
  BasicInfoAdd() {
    if (this.basicData.finYearFrom == "") {
      this.alertSerive.create(
        "", //title
        "danger", //type
        20000, // time
        "Please Enter Start Fin Year!" //body
      );
    } else if (this.basicData.finYearTo == "") {
      this.alertSerive.create(
        "", //title
        "danger", //type
        20000, // time
        "Please Enter End Fin Year!" //body
      );
    } else if (this.basicData.counterTimingFrom1 == "") {
      this.alertSerive.create(
        "", //title
        "danger", //type
        20000, // time
        "Please Select Shift Timing From (Hour)!" //body
      );
    } else if (this.basicData.counterTimingFrom2 == "") {
      this.alertSerive.create(
        "", //title
        "danger", //type
        20000, // time
        "Please Select Shift Timing From (Miniute)!" //body
      );
    } else if (this.basicData.counterTimingFrom3 == "") {
      this.alertSerive.create(
        "", //title
        "danger", //type
        20000, // time
        "Please Select Shift Timing From (Format)!" //body
      );
    } else if (this.basicData.counterTimingTo1 == "") {
      this.alertSerive.create(
        "", //title
        "danger", //type
        20000, // time
        "Please Select Shift Timing To (Hour)!" //body
      );
    } else if (this.basicData.counterTimingTo2 == "") {
      this.alertSerive.create(
        "", //title
        "danger", //type
        20000, // time
        "Please Select Shift Timing To (Miniute)!" //body
      );
    } else if (this.basicData.counterTimingTo3 == "") {
      this.alertSerive.create(
        "", //title
        "danger", //type
        20000, // time
        "Please Select Shift Timing To (Format)!" //body
      );
    } else if (this.basicData.currency == "") {
      this.alertSerive.create(
        "", //title
        "danger", //type
        20000, // time
        "please Select Currency!" //body
      );
    } else if (this.basicData.noOfRestaurant == "") {
      this.alertSerive.create(
        "", //title
        "danger", //type
        20000, // time
        "please Select No Of Restaurant!" //body
      );
    } else if (this.basicData.noOfBanquet == "") {
      this.alertSerive.create(
        "", //title
        "danger", //type
        20000, // time
        "please Select No Of Banqets!" //body
      );
    } else if (this.basicData.dateFormat == "") {
      this.alertSerive.create(
        "", //title
        "danger", //type
        20000, // time
        "please Select DateFormat!" //body
      );
    } else if (this.basicData.timeZone == "") {
      this.alertSerive.create(
        "", //title
        "danger", //type
        20000, // time
        "please Select TimeZone!" //body
      );
    } else if (this.basicData.timeFormat == "") {
      this.alertSerive.create(
        "", //title
        "danger", //type
        20000, // time
        "please Select TimeFormat!" //body
      );
    } else {
      this.basicData.finYearFrom = moment(this.basicData.finYearFrom).format(
        "YYYY-MM-DD"
      );
      this.basicData.finYearTo = moment(this.basicData.finYearTo).format(
        "YYYY-MM-DD"
      );
      console.log("RestaurantbasicData old", this.basicData);
      this.basicData.restaurantName = localStorage.getItem("reststoragename");
      if (
        this.basicData.restaurantMastId == 0 &&
        this.basicData.basicSettingsId == 0
      ) {
        this.spinner.show();
        this.generalService
          .addRestaurantBasicinfo(this.basicData)
          .subscribe((res) => {
            console.log("basicData", this.basicData);
            console.log("res", res);
            this.basicSavedata = res;
            if (this.basicSavedata.status == "Success") {
              console.log("add successfull");
              //  this.alerts.setMessage('Restaurant Advance Data Added successfully!','success');
              this.alertSerive.create(
                "", //title
                "success", //type
                5000, // time
                "Information Saved successfully!" //body
              );
              this.basicData = {
                restaurantName: "",
                finYearFrom: "",
                finYearTo: "",
                counterTimingFrom1: "",
                counterTimingFrom2: "",
                counterTimingFrom3: "",
                counterTimingTo1: "",
                counterTimingTo2: "",
                counterTimingTo3: "",
                currency: "",
                noOfRestaurant: "",
                noOfBanquet: "",
                defaultLanguage: "",
                dateFormat: "",
                timeZone: "",
                timeFormat: "",
                decimalPlace: "",
                restaurantMastId: 0,
                basicSettingsId: 0,
              };
              this.ngOnInit();
              this.spinner.hide();
            } else {
              this.alertSerive.create(
                "", //title
                "danger", //type
                5000, // time
                "Open a Counter First!" //body
              );
            }
          });
      } else if (
        this.basicData.restaurantMastId > 0 &&
        this.basicData.basicSettingsId > 0
      ) {
        this.spinner.show();
        this.generalService
          .editRestaurantBasicinfo(this.basicData)
          .subscribe((res) => {
            console.log("basicData", this.basicData);
            console.log("res", res);
            this.basicSavedata = res;
            if (this.basicSavedata.status == "Success") {
              console.log("add successfull");
              //  this.alerts.setMessage('Restaurant Advance Data Added successfully!','success');
              this.alertSerive.create(
                "", //title
                "success", //type
                5000, // time
                "Information Saved Successfully!" //body
              );

              this.ngOnInit();
              this.spinner.hide();
            } else {
              this.alertSerive.create(
                "", //title
                "danger", //type
                5000, // time
                "Open a Counter First!" //body
              );
            }
          });
      }
    }
  }

  addrestaurantTable() {
    if (this.advanceRestaurantData.restaurantName == "") {
      this.alertSerive.create(
        "", //title
        "danger", //type
        20000, // time
        "Please Enter Restaurant Name!" //body
      );
    } else if (this.advanceRestaurantData.managerName == "") {
      this.alertSerive.create(
        "", //title
        "danger", //type
        20000, // time
        "Please Enter Manager Name!" //body
      );
    } else if (this.advanceRestaurantData.noOfTable == "") {
      this.alertSerive.create(
        "", //title
        "danger", //type
        20000, // time
        "Please Select No Of Table!" //body
      );
    } else if (this.advanceRestaurantData.noOfStaff == "") {
      this.alertSerive.create(
        "", //title
        "danger", //type
        20000, // time
        "Please Select No Of Staff!" //body
      );
    } else if (this.advanceRestaurantData.phoneNo == "") {
      this.alertSerive.create(
        "", //title
        "danger", //type
        20000, // time
        "Please Enter Phone Number!" //body
      );
    } else {
      this.advanceRestaurantData.restName = localStorage.getItem(
        "reststoragename"
      );
      console.log("advanceRestaurantData old", this.advanceRestaurantData);
      if (
        this.advanceRestaurantData.id == 0 &&
        this.advanceRestaurantData.restaurantId == 0
      ) {
        this.spinner.show();
        this.generalService
          .addRestaurantAdvanceinfo(this.advanceRestaurantData)
          .subscribe((res) => {
            console.log("advanceRestaurantData", this.advanceRestaurantData);
            console.log("res", res);
            this.advanceRestaurantSavedata = res;
            if (this.advanceRestaurantSavedata.status == "Success") {
              console.log("add successfull");
              //  this.alerts.setMessage('Restaurant Advance Data Added successfully!','success');
              this.alertSerive.create(
                "", //title
                "success", //type
                5000, // time
                "Information Saved Successfully!" //body
              );
              this.advanceRestaurantData = {
                restName: "",
                restaurantName: "",
                managerName: "",
                noOfTable: "",
                noOfStaff: "",
                phoneNo: "",
                restBanType: "",
                id: 0,
                restaurantId: 0,
              };
              this.ngOnInit();
              this.spinner.hide();
            } else {
              this.alertSerive.create(
                "", //title
                "danger", //type
                5000, // time
                "Open a Counter First!" //body
              );
            }
          });
      } else if (
        this.advanceRestaurantData.id > 0 &&
        this.advanceRestaurantData.restaurantId > 0
      ) {
        this.spinner.show();
        this.generalService
          .editRestaurantAdvanceinfo(this.advanceRestaurantData)
          .subscribe((res) => {
            console.log("advanceRestaurantData", this.advanceRestaurantData);
            console.log("res", res);
            this.advanceRestaurantSavedata = res;
            if (this.advanceRestaurantSavedata.status == "Success") {
              console.log("add successfull");
              //  this.alerts.setMessage('Restaurant Advance Data Added successfully!','success');
              this.alertSerive.create(
                "", //title
                "success", //type
                5000, // time
                "Information Saved Successfully!" //body
              );
              this.advanceRestaurantData = {
                restName: "",
                restaurantName: "",
                managerName: "",
                noOfTable: "",
                noOfStaff: "",
                phoneNo: "",
                restBanType: "",
                id: 0,
                restaurantId: 0,
              };
              this.ngOnInit();
              this.spinner.hide();
            } else {
              this.alertSerive.create(
                "", //title
                "danger", //type
                5000, // time
                "Open a Counter First!" //body
              );
            }
          });
      }
    }
  }

  addBanaquteTable() {
    if (this.advanceBanqueteData.restaurantName == "") {
      this.alertSerive.create(
        "", //title
        "danger", //type
        20000, // time
        "Please Enter Restaurant Name!" //body
      );
    } else if (this.advanceBanqueteData.managerName == "") {
      this.alertSerive.create(
        "", //title
        "danger", //type
        20000, // time
        "Please Enter Manager Name!" //body
      );
    } else if (this.advanceBanqueteData.noOfTable == "") {
      this.alertSerive.create(
        "", //title
        "danger", //type
        20000, // time
        "Please Select No Of Table!" //body
      );
    } else if (this.advanceBanqueteData.noOfStaff == "") {
      this.alertSerive.create(
        "", //title
        "danger", //type
        20000, // time
        "Please Select No Of Staff!" //body
      );
    } else if (this.advanceBanqueteData.phoneNo == "") {
      this.alertSerive.create(
        "", //title
        "danger", //type
        20000, // time
        "Please Enter Phone Number!" //body
      );
    } else {
      this.advanceBanqueteData.restName = localStorage.getItem(
        "reststoragename"
      );
      console.log("advanceBanqueteData old", this.advanceBanqueteData);
      if (
        this.advanceRestaurantData.id == 0 &&
        this.advanceRestaurantData.restaurantId == 0
      ) {
        this.spinner.show();
        this.generalService
          .addBanaquetAdvanceinfo(this.advanceBanqueteData)
          .subscribe((res) => {
            console.log("advanceBanqueteData", this.advanceBanqueteData);
            console.log("res", res);
            this.advanceBanaquteSavedata = res;
            if (this.advanceBanaquteSavedata.status == "Success") {
              console.log("add successfull");
              //  this.alerts.setMessage('Restaurant Advance Data Added successfully!','success');
              this.alertSerive.create(
                "", //title
                "success", //type
                5000, // time
                "Information Added successfully!" //body
              );
              this.advanceBanqueteData = {
                restName: "",
                restaurantName: "",
                managerName: "",
                noOfTable: "",
                noOfStaff: "",
                phoneNo: "",
                restBanType: "",
                id: 0,
                restaurantId: 0,
              };
              this.ngOnInit();
              this.spinner.hide();
            } else {
              this.alertSerive.create(
                "", //title
                "danger", //type
                5000, // time
                "Open a Counter First!" //body
              );
            }
          });
      } else if (
        this.advanceBanqueteData.id > 0 &&
        this.advanceBanqueteData.restaurantId > 0
      ) {
        this.spinner.show();
        this.generalService
          .editBanaquetAdvanceinfo(this.advanceBanqueteData)
          .subscribe((res) => {
            console.log("advanceBanqueteData", this.advanceBanqueteData);
            console.log("res", res);
            this.advanceBanaquteSavedata = res;
            if (this.advanceBanaquteSavedata.status == "Success") {
              console.log("add successfull");
              //  this.alerts.setMessage('Restaurant Advance Data Added successfully!','success');
              this.alertSerive.create(
                "", //title
                "success", //type
                5000, // time
                "Information Saved successfully!" //body
              );
              this.advanceBanqueteData = {
                restName: "",
                restaurantName: "",
                managerName: "",
                noOfTable: "",
                noOfStaff: "",
                phoneNo: "",
                restBanType: "",
                id: 0,
                restaurantId: 0,
              };
              this.ngOnInit();
              this.spinner.hide();
            } else {
              this.alertSerive.create(
                "", //title
                "danger", //type
                5000, // time
                "Open a Counter First!" //body
              );
            }
          });
      }
    }
  }
}
