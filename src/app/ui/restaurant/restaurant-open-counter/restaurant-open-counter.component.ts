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

import { OpenCounterService } from "../../services/restaurant/open-counter.service";
import { RouteParameterService } from "../../../shared/route.parameter.service";
import { IOpenCounter } from "./opencounterlist";
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
  selector: "app-restaurant-open-counter",
  templateUrl: "./restaurant-open-counter.component.html",
  styleUrls: ["./restaurant-open-counter.component.scss"],
})
export class RestaurantOpenCounterComponent implements OnInit {
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

  public alertMessageDetails = {
    response: false,
    type: null,
    message: null,
  };

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

  public openCounterList: IOpenCounter[];
  private popoverIndex: number;
  openCounterData = {
    date: "",
    restaurant: "",
    openingBal: "",
    counterId: 0,
  };
  restaurantTypeMaster: any;
  openCounterSaveData: any;
  public now: number;
  public guestDatePickerStart: any;
  cancelClicked = true;
  deleteres: any;
  isVisibleSave = false;
  isVisibleList = true;

  @ViewChild(PerfectScrollbarComponent)
  componentRef?: PerfectScrollbarComponent;
  @ViewChildren(PopoverDirective) popupref: QueryList<PopoverDirective>;
  @ViewChild("table") table: ElementRef;

  constructor(
    private router: Router,
    private openCounterService: OpenCounterService,
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
    this.openCounterService.getOpenCounterList().subscribe((res) => {
      console.log("res: ", res);
      this.rawBookingList = res["resObject"];
      this.openCounterList = [...this.rawBookingList];
      this.paginateBookingList = this.openCounterList.slice(0, this.pageItems);
      this.currentPage = 1;
      this.searchRequest = false;
      
      if (this.openCounterList.length > 0) {
        this.isVisibleSave = false;
        this.isVisibleList = true;
      } else {
        this.isVisibleSave = true;
        this.isVisibleList = false;
      }
      this.spinner.hide();
      console.log("openCounterList", this.openCounterList);
    });
    this.restaurantTypeMasterDropdown();
    var dformat = localStorage.getItem("isCurrentDateformat");
    this.openCounterData.date = moment().format(dformat);
    this.bsConfigEnd = Object.assign(
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
  this.openCounterList = this.rawBookingList.filter((bookingItem: any) =>
  bookingItem.restaurantName && bookingItem.restaurantName.toLowerCase().includes(filterText.toLowerCase())
      || bookingItem.status && bookingItem.status.toLowerCase().includes(filterText.toLowerCase())
      || bookingItem.openingBal && bookingItem.openingBal.toString().toLowerCase().includes(filterText.toLowerCase())
      || bookingItem.businessDate && bookingItem.businessDate.toLowerCase().includes(filterText.toLowerCase())
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
  this.paginateBookingList = this.openCounterList == null ? [] : this.openCounterList.slice(startItem, endItem);
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
    const tableHeading = 'Open-Counter Desk';
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
    this.openCounterService.getRestaurantType().subscribe((res) => {
      console.log("res: ", res);
      this.restaurantTypeMaster = res["resObject"];
      console.log("restaurantTypeMaster", this.restaurantTypeMaster);
    });
  }
  openCounterAdd() {
    if (this.openCounterData.date == "") {
      this.alertSerive.create(
        "", //title
        "danger", //type
        35000, // time
        "Please Enter a Date!" //body
      );
    } else if (this.openCounterData.restaurant == "") {
      this.alertSerive.create(
        "", //title
        "danger", //type
        35000, // time
        "Please Select a Restaurent!" //body
      );
    } else if (this.openCounterData.openingBal == "") {
      this.alertSerive.create(
        "", //title
        "danger", //type
        35000, // time
        "Please Enter a Opening Balance !" //body
      );
    } else {
      this.openCounterData.date = moment(this.openCounterData.date).format(
        "YYYY-MM-DD"
      );
      console.log("openCounterData old", this.openCounterData);
      // if (this.openCounterData.counterId == 0) {
      //   this.openCounterService
      //     .addOpenCounterDetails(this.openCounterData)
      //     .subscribe((res) => {
      //       console.log("openCounterData", this.openCounterData);
      //       console.log("res", res);
      //       this.openCounterSaveData = res;
      //       if (this.openCounterSaveData.status == "Success") {
      //         console.log("add successfull");
      //         this.alertSerive.create(
      //           "", //title
      //           "success", //type
      //           5000, // time
      //           "Information Saved Successfully!" //body
      //         );
      //         //  this.alerts.setMessage('open Counter Data Added successfully!','success');
      //         // this.alertMessageDetails.type = 'success';
      //         //  this.alertMessageDetails.message = "open Counter Data Added successfully!.";
      //         this.openCounterData = {
      //           date: "",
      //           restaurant: "",
      //           openingBal: "",
      //           counterId: 0,
      //         };
      //         this.ngOnInit();
      //       }
      //     });
      // } else
      if (this.openCounterData.counterId > 0) {
        this.spinner.show();
        this.openCounterService
          .editOpenCounterDetails(this.openCounterData)
          .subscribe((res) => {
            console.log("openCounterData", this.openCounterData);
            console.log("res", res);
            this.openCounterSaveData = res;
            if (this.openCounterSaveData.status == "Success") {
              console.log("add successfull");
              this.spinner.hide();
              this.alertSerive.create(
                "", //title
                "success", //type
                5000, // time
                "Information Updated Successfully!" //body
              );
              //  this.alerts.setMessage('open Counter Data Added successfully!','success');
              // this.alertMessageDetails.type = 'success';
              //  this.alertMessageDetails.message = "open Counter Data Added successfully!.";
              this.openCounterData = {
                date: "",
                restaurant: "",
                openingBal: "",
                counterId: 0,
              };
              this.ngOnInit();
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
    this.openCounterData = {
      date: "",
      restaurant: "",
      openingBal: "",
      counterId: 0,
    };
  }

  deleteOpenCounter(counterid) {
    this.spinner.show();
    this.openCounterService.deleteOpenCounter(counterid).subscribe((res) => {
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
  editOpenCounter(data) {
    console.log("data", data);

    this.openCounterData.date = data.businessDate;
    this.openCounterData.restaurant = data.restaurantId;
    this.openCounterData.openingBal = data.openingBal;
    this.openCounterData.counterId = data.counterId;

    console.log("openCounterData", this.openCounterData);
  }
}
