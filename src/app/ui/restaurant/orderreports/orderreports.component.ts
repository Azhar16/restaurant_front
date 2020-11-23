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

import { OrderreportsService } from '../../services/restaurant/orderreports.service';
import { RouteParameterService } from "../../../shared/route.parameter.service";
import moment from "moment";
import * as jsPDF from "jspdf";
import html2canvas from "html2canvas";
import * as $ from "jquery";
import * as XLSX from "xlsx";
import { AlertService } from "../../../shared/modules/alert/services/alert.service";
import { NgxSpinnerService } from "ngx-spinner";
import { Ng4LoadingSpinnerService } from "ng4-loading-spinner";

/* pagination */
import { DayPilotMonthComponent } from "daypilot-pro-angular";
import { flatMap } from 'rxjs/operators';
import { NgForm } from '@angular/forms';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import _ from 'underscore';
import { DataEventService } from "../../../shared/data.event.service";

@Component({
  selector: 'app-orderreports',
  templateUrl: './orderreports.component.html',
  styleUrls: ['./orderreports.component.scss']
})
export class OrderreportsComponent implements OnInit {

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

  /* order details pagination  */

  public searchDetailsRequest: boolean;
  public searchedDetailsBookingSrcItem: any;
  public searchedDetailsBookingStatus: string;
  public rawDetailsBookingList: any;
  public disableDetailsConfirmUnconfirm: boolean;
  public filterDetailsSearchData: string;
  public revenueDetailsDataList:any;
  
  public paginateDetailsBookingList: any = null;
  public pageDetailsItems: number;
  public currentDetailsPage: number;

  
  @ViewChild("asignRoomPop") asignRoomPop: PopoverDirective;
  @ViewChild("availPop") availPop: PopoverDirective;
  @ViewChild("bookingConfirmModal") bookingConfirmModal: TemplateRef<any>;

bsConfigStart: Partial<BsDatepickerConfig>;
bsConfigEnd: Partial<BsDatepickerConfig>;

popoverMessage = "Do you want to see details ?";
popoverTitle = "Record delete confirmation";

popoverMessage2 = "Do you want to proceed?";
popoverTitle2 = "";
confirmText1: string = "Yes";
cancelText1: string = "No";

//scrollBarContainerHeight: number;
quickReservationModalRef: BsModalRef;


private revenueReportsListLength: any;
private revenueDetailsReportsListLength:any;
public orderList:any;
public orderDetailsList:any;
private popoverIndex: number;
revenueData = {
 restaurantId: "",
 startDate: "",
 endDate: "",
 
};
recipeCategoryMaster: any;
foodMenuTypeMaster: any;
revenueSaveData: any;
public now: number;
cancelClicked = true;
deleteres: any;
revenueRestaurantMaster: any;
categoryMstList: any;

@ViewChild(PerfectScrollbarComponent)
componentRef?: PerfectScrollbarComponent;
scrollBarContainerHeight: number = 0;
@ViewChildren(PopoverDirective) popupref: QueryList<PopoverDirective>;
@ViewChild("table") table: ElementRef;

//template: string = `<img src="http://pa1.narvii.com/5722/2c617cd9674417d272084884b61e4bb7dd5f0b15_hq.gif" />`;

constructor(
 private router: Router,
 private orderreportsService: OrderreportsService,
 private modalService: BsModalService,
 private routeParamService: RouteParameterService,
 private _des: DataEventService,
 private alertSerive: AlertService,
 //  private spinner: NgxSpinnerService
 private spinner: Ng4LoadingSpinnerService,
 private cd: ChangeDetectorRef,
) {
 this.now = Date.now();
   setInterval(() => {
       this.now = Date.now();
   }, 10000);
 }

ngOnInit() {
 
 this.disableConfirmUnconfirm = true;
 this.searchRequest = true;
 //  this.categoryMaster();
 this.restaurantMaster();
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

 $('input[name="switchcheck"]').prop("checked", true);
 let buffer = 75;
 this.scrollBarContainerHeight =
   $(document).height() -
   ($("#main-navbar").outerHeight() +
     $("#sub-navbar").outerHeight() +
     $(".head-section").outerHeight() +
     $(".body-section").outerHeight() +
     $("#uiFooter").outerHeight() +
     buffer);
     var dformat = localStorage.getItem("isCurrentDateformat");
     this.revenueData.startDate = moment().format(dformat);
     this.revenueData.endDate = moment().format(dformat);
     console.log("1",this.revenueData.startDate);
     this.bsConfigStart = Object.assign(
       {},
       {
         containerClass: "theme-blue",
         dateInputFormat: "DD-MMM-YYYY",
         showWeekNumbers: false,
       }
     );
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
this.orderList = this.rawBookingList.filter((bookingItem: any) =>
bookingItem.restaurantName && bookingItem.restaurantName.toLowerCase().includes(filterText.toLowerCase())
   || bookingItem.transDate && bookingItem.transDate.toLowerCase().includes(filterText.toLowerCase())
   || bookingItem.totalOrder && bookingItem.totalOrder.toString().toLowerCase().includes(filterText.toLowerCase())
   || bookingItem.completedCount && bookingItem.completedCount.toString().toLowerCase().includes(filterText.toLowerCase())
   || bookingItem.pendingCount && bookingItem.pendingCount.toString().toLowerCase().includes(filterText.toLowerCase())
   || bookingItem.totalRevenue && bookingItem.totalRevenue.toString().toLowerCase().includes(filterText.toLowerCase())
   || bookingItem.totalTax && bookingItem.totalTax.toString().toLowerCase().includes(filterText.toLowerCase())
   || bookingItem.revenue && bookingItem.revenue.toString().toLowerCase().includes(filterText.toLowerCase())
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
this.paginateBookingList = this.orderList == null ? [] : this.orderList.slice(startItem, endItem);
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
 const tableHeading = 'Tax Desk';
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

restaurantMaster() {
 this.orderreportsService.getRestaurantType().subscribe((res) => {
   console.log("res: ", res);
   this.revenueRestaurantMaster = res["resObject"];
   console.log("bookingRestaurantMaster", this.revenueRestaurantMaster);
 });
}

revenueShow() {

 if (this.revenueData.restaurantId == "") {
   this.alertSerive.create(
     "", //title
     "danger", //type
     20000, // time
     "Please Select a Restaurant!" //body
   );
 } else if (this.revenueData.startDate == "") {
   this.alertSerive.create(
     "", //title
     "danger", //type
     20000, // time
     "Please Enter a Start Date!" //body
   );
 } else if (this.revenueData.endDate == "") {
  this.alertSerive.create(
    "", //title
    "danger", //type
    20000, // time
    "Please Enter a End Date!" //body
  );
} else {
  this.revenueData.startDate = moment(
    this.revenueData.startDate
  ).format("YYYY-MM-DD");
  this.revenueData.endDate = moment(
    this.revenueData.endDate
  ).format("YYYY-MM-DD");
  console.log("revenueData", this.revenueData);
     this.spinner.show();
     this.orderreportsService
       .getOrderReportList(this.revenueData)
       .subscribe((res) => {
         console.log("revenueData", this.revenueData);
         this.revenueSaveData = res;
         if (this.revenueSaveData.status == "Success") {
           console.log("add successfull");
           //  this.alerts.setMessage('Recipe Added successfully!','success');
           this.spinner.hide();
           console.log("res: ", res);
            this.rawBookingList = res["resObject"];
            if(this.rawBookingList != undefined || this.rawBookingList != null){
            this.orderList = [...this.rawBookingList];
            this.paginateBookingList = this.orderList.slice(0, this.pageItems);
            }
            else{
              this.orderList =res["resObject"];
            }
            this.currentPage = 1;
            this.searchRequest = false;
            if (this.paginateBookingList.length > 4) {
              this.revenueReportsListLength = this.paginateBookingList.length - 2;
            } else {
              this.revenueReportsListLength = 5;
            }
           this.revenueData = {
             restaurantId: "",
             startDate: "",
             endDate: ""
           };
           this.ngOnInit();
         } else {
           this.spinner.hide();
           this.orderList =[];
           this.alertSerive.create(
             "", //title
             "danger", //type
             5000, // time
             this.revenueSaveData.responseMessage //body
           );
         }
       });
  
 }
}
clearSearch() {
 this.revenueData = {
   restaurantId: "",
   startDate: "",
   endDate: ""
 };
}
reportDetails(item){
  $('.order-report-details').show();
  $('.order-report').hide();
 console.log("date=",item)
//   item.transDate
// ).format("YYYY-MM-DD"));
// localStorage.setItem("orderdetailsdata", JSON.stringify(item));
// this._des.newEvent("orderreports_details");
this.disableConfirmUnconfirm = true;
this.searchDetailsRequest = true;
var selectedDate = moment(
  item.transDate
).format("YYYY-MM-DD")
this.orderreportsService.getOrderReportDetailsList(selectedDate,"2").subscribe((res) => {
  console.log("res: ", res);
  this.rawDetailsBookingList = res["resObject"];
  if(this.rawDetailsBookingList != undefined || this.rawDetailsBookingList != null){
  this.orderDetailsList = [...this.rawDetailsBookingList];
  this.paginateDetailsBookingList = this.orderDetailsList.slice(0, this.pageDetailsItems);
  }
  else{
    this.orderDetailsList =res["resObject"];
  }
  this.currentDetailsPage = 1;
  this.searchDetailsRequest = false;
  if (this.paginateDetailsBookingList.length > 4) {
    this.revenueDetailsReportsListLength = this.paginateDetailsBookingList.length - 2;
  } else {
    this.revenueDetailsReportsListLength = 5;
  }
  this.spinner.hide();
 
});

 /* pagination */
 this.searchDetailsRequest = false;
 //this.openCounterList = null;
 

 this.searchedDetailsBookingSrcItem = {
   sourceId: "0",
   sourceName: "All",
   sourceType: null
};
this.searchedDetailsBookingStatus = "All";
this.disableDetailsConfirmUnconfirm = true;

$('input[name="switchcheck"]').prop("checked", true);
let buffer = 75;
this.scrollBarContainerHeight =
  $(document).height() -
  ($("#main-navbar").outerHeight() +
    $("#sub-navbar").outerHeight() +
    $(".head-section").outerHeight() +
    $(".body-section").outerHeight() +
    $("#uiFooter").outerHeight() +
    buffer);
    var dformat = localStorage.getItem("isCurrentDateformat");
    item.startDate = moment().format(dformat);
    item.endDate = moment().format(dformat);
    console.log("1",item.startDate);
    this.bsConfigStart = Object.assign(
      {},
      {
        containerClass: "theme-blue",
        dateInputFormat: "DD-MMM-YYYY",
        showWeekNumbers: false,
      }
    );
    this.pageDetailsItems = 5;
    this.currentDetailsPage = 1;
    this.pageDetailsChanged({
        page: 1,
        itemsPerPage: this.pageDetailsItems
    });
    this.cd.detectChanges();

}


changeDetailsSearchFilter(filterText: string) {
this.orderDetailsList = this.rawDetailsBookingList.filter((bookingItem: any) =>
bookingItem.restaurantName && bookingItem.restaurantName.toLowerCase().includes(filterText.toLowerCase())
    || bookingItem.transDate && bookingItem.transDate.toLowerCase().includes(filterText.toLowerCase())
    || bookingItem.invoiceNo && bookingItem.invoiceNo.toLowerCase().includes(filterText.toLowerCase())
    || bookingItem.orderTypeName && bookingItem.orderTypeName.toLowerCase().includes(filterText.toLowerCase())
    || bookingItem.invCmpltStatus && bookingItem.invCmpltStatus.toLowerCase().includes(filterText.toLowerCase())
    || bookingItem.waiterName && bookingItem.waiterName.toLowerCase().includes(filterText.toLowerCase())
    || bookingItem.totalRevenue && bookingItem.totalRevenue.toString().toLowerCase().includes(filterText.toLowerCase())
   
    /*|| bookingItem.bookingID == filterText
    || bookingItem.channelRefNum == filterText
    || bookingItem.assignedRoomNumber == filterText*/
);
// console.log('on filter change: ', filterText, this.bookingList);
this.pageDetailsChanged({
    page: 1,
    itemsPerPage: this.pageDetailsItems
});
this.cd.detectChanges();
}

// http://michaelbromley.github.io/ngx-pagination/#/server-paging
pageDetailsChanged(event: PageChangedEvent): void {
// console.log('in page change: ', event);
this.pageDetailsItems = event.itemsPerPage;
const startItem = (event.page - 1) * event.itemsPerPage;
const endItem = event.page * event.itemsPerPage;
this.paginateDetailsBookingList = this.orderDetailsList == null ? [] : this.orderDetailsList.slice(startItem, endItem);
}

numDetailsPages(event: any) {
this.pageDetailsItems = event.itemsPerPage;
setTimeout(() => {
    this.currentPage = event.page;
    this.pageDetailsChanged({
        page: event.page,
        itemsPerPage: event.itemsPerPage
    });
     console.log('in num pages: ', event);
}, 10);
}

public printDetailsData() {
  const tableHeading = 'Tax Desk';
  var tav = document.getElementById('printDetailsSection');
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
backPage(){
  this.revenueDetailsDataList = '';
  $('.order-report-details').hide();
  $('.order-report').show();
}


}
