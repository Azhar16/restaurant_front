import { BsDatepickerConfig } from "ngx-bootstrap/datepicker";
import {
  Component,
  OnInit,
  TemplateRef,
  QueryList,
  ViewChild,
  ViewChildren,
  ElementRef,
  ChangeDetectorRef
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

import { GuestManagementService } from "../../services/restaurant/guest-management.service";
import { RouteParameterService } from "../../../shared/route.parameter.service";
import { IGuest } from "./guestmanagement";
import moment from "moment";
import * as jsPDF from "jspdf";
import html2canvas from "html2canvas";
import * as $ from "jquery";
import * as XLSX from "xlsx";
import { Ng4LoadingSpinnerService } from "ng4-loading-spinner";

import { AlertService } from "../../../shared/modules/alert/services/alert.service";
/* pagination */
import { DayPilotMonthComponent } from "daypilot-pro-angular";
import { flatMap } from 'rxjs/operators';
import { NgForm } from '@angular/forms';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import _ from 'underscore';

@Component({
  selector: "app-restaurant-guest-management",
  templateUrl: "./restaurant-guest-management.component.html",
  styleUrls: ["./restaurant-guest-management.component.scss"],
})
export class RestaurantGuestManagementComponent implements OnInit {
   /* pagination */
   @ViewChild("calendar") calendar: DayPilotMonthComponent;
   public modelDate: Date;
   public config: any = {
       startDate: moment().startOf('month').format('YYYY-MM-DD'),
       heightSpec: "Parent100Pct",
       cellHeight: 30,
       headerHeight: 20,
       onBeforeHeaderRender: function (args) {
           // console.log('in before render: ', args);
           args.header.html = args.header.html.toString().slice(0, 3);
       }
   };
   public events: any[] = [];
 
 
 
   public searchRequest: boolean;
   public searchedBookingSrcItem: any;
   public searchedBookingStatus: string;
   public rawBookingList: any;
   public disableConfirmUnconfirm: boolean;
   public filterSearchData: string;
 
   // public alertMessageDetails = {
   //     response: false,
   //     type: null,
   //     message: null
   // };
   public paginateBookingList: any = null;
   public pageItems: number;
   public currentPage: number;
 
   
   @ViewChild("asignRoomPop") asignRoomPop: PopoverDirective;
   @ViewChild("availPop") availPop: PopoverDirective;
   @ViewChild("bookingConfirmModal") bookingConfirmModal: TemplateRef<any>;

  bsConfigStart: Partial<BsDatepickerConfig>;
  bsConfigEnd: Partial<BsDatepickerConfig>;

  popoverMessage = "Do you want to delete ?";
  popoverTitle = "Record delete confirmation";

  popoverMessage2 = "Do you want to proceed?";
  popoverTitle2 = "";
  confirmText1: string = "Yes";
  cancelText1: string = "No";

  scrollBarContainerHeight: number;
  quickReservationModalRef: BsModalRef;

  public guestList: IGuest[];
  guestListLength: any;
  private popoverIndex: number;
  public guestEventList: any;
  public guestDatePickerStart: any;
  public guestSaveData: any;

  guestInfoData = {
    title: "",
    guestName: "",
    guestNumber: "",
    guestEmailid: "",
    gdate: "",
    gEvent: "",
    gEventid: "",
    guestId: 0,
  };
  public now: number;
  cancelClicked = true;
  deleteres: any;

  @ViewChild(PerfectScrollbarComponent)
  componentRef?: PerfectScrollbarComponent;
  @ViewChildren(PopoverDirective) popupref: QueryList<PopoverDirective>;
  @ViewChild("table") table: ElementRef;

  constructor(
    private router: Router,
    private guestManagementService: GuestManagementService,
    private modalService: BsModalService,
    private routeParamService: RouteParameterService,
    private alertSerive: AlertService,
    private spinner: Ng4LoadingSpinnerService,
    private cd: ChangeDetectorRef,
  ) {
    this.now = Date.now();
      setInterval(() => {
          this.now = Date.now();
      }, 10000);
    }
  ngOnInit() {
    this.spinner.show();
    this.disableConfirmUnconfirm = true;
    this.searchRequest = true;
    this.guestManagementService.getGuestList().subscribe((res) => {
      console.log("res: ", res);
      this.rawBookingList = res["resObject"];
      this.guestList = [...this.rawBookingList];
      this.paginateBookingList = this.guestList.slice(0, this.pageItems);
      this.currentPage = 1;
      this.searchRequest = false;
      if (this.paginateBookingList.length > 4) {
        this.guestListLength = this.paginateBookingList.length - 2;
      } else {
        this.guestListLength = 5;
      }
      this.spinner.hide();
      console.log("guestList", this.guestList);
    });
    this.guestManagementService.getGuestEvent().subscribe((res) => {
      console.log("res: ", res);
      this.guestEventList = res["resObject"];
      console.log("guestEventList eventName", this.guestEventList);
    });
    var dformat = localStorage.getItem("isCurrentDateformat");
    this.guestInfoData.gdate = moment().format(dformat);

    this.bsConfigStart = Object.assign(
      {},
      {
        containerClass: "theme-blue",
        dateInputFormat: "DD-MMM-YYYY",
        //minDate: new Date(),
        showWeekNumbers: false,
      }
    );
    /* pagination */
    this.searchRequest = false;
    //this.openCounterList = null;
    
   
    this.searchedBookingSrcItem = {
      sourceId: "0",
      sourceName: "All",
      sourceType: null
  };
  this.searchedBookingStatus = "All";
  this.disableConfirmUnconfirm = true;

   
  }

  /* pagination */

  ngAfterViewInit() {
    this.pageItems = 5;
    this.currentPage = 1;
    this.pageChanged({
        page: 1,
        itemsPerPage: this.pageItems
    });
    this.cd.detectChanges();
}

onShownCal() {
    if (this.availPop.isOpen) {
        this.availPop.hide();
    }
}
changeSearchFilter(filterText: string) {
  this.guestList = this.rawBookingList.filter((bookingItem: any) =>
         bookingItem.title && bookingItem.title.toLowerCase().includes(filterText.toLowerCase())
      || bookingItem.guestName && bookingItem.guestName.toLowerCase().includes(filterText.toLowerCase())
      || bookingItem.phone && bookingItem.phone.toString().toLowerCase().includes(filterText.toLowerCase())
      || bookingItem.emailAddress && bookingItem.emailAddress.toLowerCase().includes(filterText.toLowerCase())
      || bookingItem.birthDate && bookingItem.birthDate.toLowerCase().includes(filterText.toLowerCase())
      || bookingItem.eventName && bookingItem.eventName.toLowerCase().includes(filterText.toLowerCase())
      || bookingItem.status && bookingItem.status.toLowerCase().includes(filterText.toLowerCase())
      /*|| bookingItem.bookingID == filterText
      || bookingItem.channelRefNum == filterText
      || bookingItem.assignedRoomNumber == filterText*/
  );
  // console.log('on filter change: ', filterText, this.bookingList);
  this.pageChanged({
      page: 1,
      itemsPerPage: this.pageItems
  });
  this.cd.detectChanges();
}

// http://michaelbromley.github.io/ngx-pagination/#/server-paging
pageChanged(event: PageChangedEvent): void {
  // console.log('in page change: ', event);
  this.pageItems = event.itemsPerPage;
  const startItem = (event.page - 1) * event.itemsPerPage;
  const endItem = event.page * event.itemsPerPage;
  this.paginateBookingList = this.guestList == null ? [] : this.guestList.slice(startItem, endItem);
}

numPages(event: any) {
  this.pageItems = event.itemsPerPage;
  setTimeout(() => {
      this.currentPage = event.page;
      this.pageChanged({
          page: event.page,
          itemsPerPage: event.itemsPerPage
      });
       console.log('in num pages: ', event);
  }, 10);
}

  public printData() {
    const tableHeading = 'Guest Desk';
    var tav = document.getElementById('printSection');
    var mywindow = window.open('', 'Print', "scrollbars=yes,resizable=yes,width=200,height=auto");

    mywindow.document.write('<html><head><title>' + tableHeading + '</title>');
    mywindow.document.write('</head><body >');
    mywindow.document.write(tav.innerHTML);
    mywindow.document.write('</body></html>');

    mywindow.document.close();
    mywindow.focus();
    mywindow.print();
    mywindow.close();
}

  guestAdd() {
    if (this.guestInfoData.title == "") {
      this.alertSerive.create(
        "", //title
        "danger", //type
        20000, // time
        "Please Select a Title!" //body
      );
    } else if (this.guestInfoData.guestName == "") {
      this.alertSerive.create(
        "", //title
        "danger", //type
        20000, // time
        "Please Enter Guest Name!" //body
      );
    } else if (this.guestInfoData.guestNumber == "") {
      this.alertSerive.create(
        "", //title
        "danger", //type
        20000, // time
        "Please Enter Guest Number !" //body
      );
    } else if (this.guestInfoData.guestEmailid == "") {
      this.alertSerive.create(
        "", //title
        "danger", //type
        20000, // time
        "Please Enter Guest Mailing Address !" //body
      );
    } else if (this.guestInfoData.gdate == "") {
      this.alertSerive.create(
        "", //title
        "danger", //type
        20000, // time
        "Please Enter Date !" //body
      );
    } else if (this.guestInfoData.gEvent == "") {
      this.alertSerive.create(
        "", //title
        "danger", //type
        20000, // time
        "Please Select a Event !" //body
      );
    } else {
      this.guestInfoData.gdate = moment(this.guestInfoData.gdate).format(
        "YYYY-MM-DD"
      );
      console.log("guestInfoData old", this.guestInfoData);
      if (this.guestInfoData.guestId == 0) {
        this.spinner.show();
        this.guestManagementService
          .addGuest(this.guestInfoData)
          .subscribe((res) => {
            console.log("guestInfoData", this.guestInfoData);
            console.log("res", res);
            this.guestSaveData = res;
            if (this.guestSaveData.status == "Success") {
              console.log("add successfull");
              this.spinner.hide();
              this.alertSerive.create(
                "", //title
                "success", //type
                5000, // time
                "Information Saved Successfully!" //body
              );
              this.guestInfoData = {
                title: "",
                guestName: "",
                guestNumber: "",
                guestEmailid: "",
                gdate: "",
                gEvent: "",
                gEventid: "",
                guestId: 0,
              };
              this.ngOnInit();
            } else {
              this.spinner.hide();
              this.alertSerive.create(
                "", //title
                "danger", //type
                5000, // time
                "something went wrong!" //body
              );
            }
          });
      } else if (this.guestInfoData.guestId > 0) {
        this.spinner.show();
        this.guestManagementService
          .editGuest(this.guestInfoData)
          .subscribe((res) => {
            console.log("guestInfoData", this.guestInfoData);
            console.log("res", res);
            this.guestSaveData = res;
            if (this.guestSaveData.status == "Success") {
              console.log("add successfull");
              this.spinner.hide();
              this.alertSerive.create(
                "", //title
                "success", //type
                5000, // time
                "Information Updated Successfully!" //body
              );
              this.guestInfoData = {
                title: "",
                guestName: "",
                guestNumber: "",
                guestEmailid: "",
                gdate: "",
                gEvent: "",
                gEventid: "",
                guestId: 0,
              };
              this.ngOnInit();
            } else {
              this.spinner.hide();
              this.alertSerive.create(
                "", //title
                "danger", //type
                5000, // time
                "something went wrong!" //body
              );
            }
          });
      }
    }
  }
  clearSearch() {
    this.guestInfoData = {
      title: "",
      guestName: "",
      guestNumber: "",
      guestEmailid: "",
      gdate: "",
      gEvent: "",
      gEventid: "",
      guestId: 0,
    };
  }
  deleteGuest(guestid) {
    this.spinner.show();
    this.guestManagementService.deleteGuest(guestid).subscribe((res) => {
      console.log("res: ", res);
      this.deleteres = res;
      if (this.deleteres.status == "Success") {
        this.spinner.hide();
        this.ngOnInit();
        this.alertSerive.create(
          "", //title
          "success", //type
          5000, // time
          "Information Deleted Successfully!" //body
        );
      } else {
        this.spinner.hide();
        this.alertSerive.create(
          "", //title
          "danger", //type
          5000, // time
          "something went wrong!" //body
        );
      }
    });
  }

  editGuest(data) {
    console.log("data", data);

    this.guestInfoData.title = data.title;
    this.guestInfoData.guestName = data.guestName;
    this.guestInfoData.guestNumber = data.phone;
    this.guestInfoData.guestEmailid = data.emailAddress;
    this.guestInfoData.gdate = data.birthDate;
    this.guestInfoData.gEvent = data.eventId;
    this.guestInfoData.gEventid = data.eventId;
    this.guestInfoData.guestId = data.guestId;

    console.log("guestInfoData", this.guestInfoData);
  }
}
