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

import { CloseCounterService } from "../../services/restaurant/close-counter.service";
import { RouteParameterService } from "../../../shared/route.parameter.service";
import { ICloseCounter } from "./closecounter";
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
  selector: "app-restaurant-close-counter",
  templateUrl: "./restaurant-close-counter.component.html",
  styleUrls: ["./restaurant-close-counter.component.scss"],
})
export class RestaurantCloseCounterComponent implements OnInit {

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
  public closeConterObject: any;
  bsConfigStart: Partial<BsDatepickerConfig>;
  bsConfigEnd: Partial<BsDatepickerConfig>;

  //  scrollBarContainerHeight: number;
  quickReservationModalRef: BsModalRef;

  public closeCountertList: ICloseCounter[];
  private popoverIndex: number;

  popoverMessage = "Do you want to delete ?";
  popoverTitle = "Record delete confirmation";

  popoverMessage2 = "Do you want to proceed?";
  popoverTitle2 = "";
  confirmText1: string = "Yes";
  cancelText1: string = "No";

  restaurantTypeMaster: any;

  closeCounter = {
    adjustment: "",
    restaurant: "",
    comments: "",
    openingBal: 0,
    todayColl: 0,
    closingBal: 0,
    counterId: "",
    businessDate: "",
  };
  closeCountertDetails: any;
  closeCounterSaveData: any;
  public now: number;
  cancelClicked = true;
  deleteres: any;

  @ViewChild(PerfectScrollbarComponent)
  componentRef?: PerfectScrollbarComponent;
  
  scrollBarContainerHeight: number = 0;
  @ViewChildren(PopoverDirective) popupref: QueryList<PopoverDirective>;
  @ViewChild("table") table: ElementRef;

  constructor(
    private router: Router,
    private closeCounterService: CloseCounterService,
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
    this.closeCounterService.getClosecounterList().subscribe((res) => {
      console.log("res: ", res);
      this.rawBookingList = res["resObject"];
      this.closeCountertList = [...this.rawBookingList];
      this.paginateBookingList = this.closeCountertList.slice(0, this.pageItems);
      this.currentPage = 1;
      this.searchRequest = false;
      this.spinner.hide();
      console.log("closeCountertList", this.closeCountertList);
    });
    this.restaurantTypeMasterDropdown();

    this.now = Date.now();
    setInterval(() => {
      this.now = Date.now();
    }, 1000);

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

    let buffer = 75;
    this.scrollBarContainerHeight =
      $(document).height() -
      ($("#main-navbar").outerHeight() +
        $("#sub-navbar").outerHeight() +
        $(".head-section").outerHeight() +
        $(".body-section").outerHeight() +
        $("#uiFooter").outerHeight() +
        buffer);
  }
  restaurantChange(ev) {
    this.todayCloseCounter(ev.target.value);
  }
  todayCloseCounter(restaurantId) {
    this.closeCounterService.getrodayCounter(restaurantId).subscribe((res) => {
      console.log("res: ", res);
      this.closeCountertDetails = res["resObject"];

      this.closeCounter.openingBal = this.closeCountertDetails.openingBal;
      this.closeCounter.closingBal = this.closeCountertDetails.balance;
      this.closeCounter.todayColl = this.closeCountertDetails.todaysCollection;
      this.closeCounter.counterId = this.closeCountertDetails.counterId;
      this.closeCounter.businessDate = this.closeCountertDetails.businessDate;

      console.log("closeCountertDetails", this.closeCountertDetails);
    });
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
  this.closeCountertList = this.rawBookingList.filter((bookingItem: any) =>
  bookingItem.bdate && bookingItem.bdate.toLowerCase().includes(filterText.toLowerCase())
      || bookingItem.counterName && bookingItem.counterName.toLowerCase().includes(filterText.toLowerCase())
      || bookingItem.openingBalance && bookingItem.openingBalance.toString().toLowerCase().includes(filterText.toLowerCase())
      || bookingItem.daysCollection && bookingItem.daysCollection.toString().toLowerCase().includes(filterText.toLowerCase())
      || bookingItem.adjustment && bookingItem.adjustment.toString().toLowerCase().includes(filterText.toLowerCase())
      || bookingItem.closingBalance && bookingItem.closingBalance.toString().toLowerCase().includes(filterText.toLowerCase())
      || bookingItem.comments && bookingItem.comments.toLowerCase().includes(filterText.toLowerCase())
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
  this.paginateBookingList = this.closeCountertList == null ? [] : this.closeCountertList.slice(startItem, endItem);
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
    const tableHeading = 'Close-Counter Desk';
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

  restaurantTypeMasterDropdown() {
    this.closeCounterService.getRestaurantType().subscribe((res) => {
      console.log("res: ", res);
      this.restaurantTypeMaster = res["resObject"];
      console.log("restaurantTypeMaster", this.restaurantTypeMaster);
    });
  }

  deleteCloseCounter(counterid) {
    this.spinner.show();
    this.closeCounterService.deleteCloseCounter(counterid).subscribe((res) => {
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
  closeCounterSave() {
    if (this.closeCounter.restaurant == "") {
      this.alertSerive.create(
        "", //title
        "danger", //type
        35000, // time
        "Please Select a Restaurent!" //body
      );
    } else if (this.closeCounter.adjustment == "") {
      this.alertSerive.create(
        "", //title
        "danger", //type
        35000, // time
        "please enter adjustment !" //body
      );
    } else {
      console.log("closeCounter old", this.closeCounter);
      this.spinner.show();
      this.closeCounterService
        .addCloseCounterService(this.closeCounter)
        .subscribe((res) => {
          console.log("closeCounter", this.closeCounter);
          console.log("res", res);
          this.closeCounterSaveData = res;
          if (this.closeCounterSaveData.status == "Success") {
            console.log("add successfull");
            this.spinner.hide();
            this.alertSerive.create(
              "", //title
              "success", //type
              5000, // time
              this.closeCounterSaveData.responseMessage //body
            );
            this.closeCounter = {
              adjustment: "",
              restaurant: "",
              comments: "",
              openingBal: 0,
              todayColl: 0,
              closingBal: 0,
              counterId: "",
              businessDate: "",
            };
            this.ngOnInit();
            
          } else {
            this.spinner.hide();
            this.alertSerive.create(
              "", //title
              "danger", //type
              5000, // time
              this.closeCounterSaveData.responseMessage //body
            );
          }
        });
    }
  }
  clearSearch() {
    this.closeCounter = {
      adjustment: "",
      restaurant: "",
      comments: "",
      openingBal: 0,
      todayColl: 0,
      closingBal: 0,
      counterId: "",
      businessDate: "",
    };
  }
}
