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

import { TableBookingManagementService } from "../../services/restaurant/table-booking-management.service";
import { RouteParameterService } from "../../../shared/route.parameter.service";
import { IRestaurantBooking } from "./bookingList";
import moment from "moment";
import * as jsPDF from "jspdf";
import html2canvas from "html2canvas";
import * as $ from "jquery";
import * as XLSX from "xlsx";
import { AlertService } from "../../../shared/modules/alert/services/alert.service";
//import { IDropdownSettings } from "ng-multiselect-dropdown";
import { Ng4LoadingSpinnerService } from "ng4-loading-spinner";

/* pagination */
import { DayPilotMonthComponent } from "daypilot-pro-angular";
import { flatMap } from 'rxjs/operators';
import { NgForm } from '@angular/forms';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import _ from 'underscore';

@Component({
  selector: "app-restaurant-table-booking-management",
  templateUrl: "./restaurant-table-booking-management.component.html",
  styleUrls: ["./restaurant-table-booking-management.component.scss"],
})
export class RestaurantTableBookingManagementComponent implements OnInit {
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

  popoverMessage1 = "Do you want to proceed?";
  popoverTitle1 = "";
  confirmText = "Yes";
  cancelText = "No";

  //  scrollBarContainerHeight: number;
  quickReservationModalRef: BsModalRef;

  public bookingList: IRestaurantBooking[];
  bookingListLength: any;
  private popoverIndex: number;
  bookingData = {
    restaurantId: "",
    tableId: [],
    guestName: "",
    guestPhoneNo: "",
    hotelRoomNum: "",
    bookingStartDate: "",
    bookingEndDate: "",
    bookingStartTime: "",
    bookingEndTime: "",
    bookingStartTime1: "",
    bookingEndTime1: "",
    bookingAllocationId: 0,
    guestId: 0,
  };
  bookingRestaurantMaster: any;
  bookingTableMaster: any;
  bookingSaveData: any;
  public now: number;
  tableList: any;

  cancelClicked = true;

  dropdownList = [];
  selectedItems = [];
  dropdownSettings = {};
  requiredField: boolean = false;
  deleteres: any;

  @ViewChild(PerfectScrollbarComponent)
  componentRef?: PerfectScrollbarComponent;
  scrollBarContainerHeight: number = 0;
  @ViewChildren(PopoverDirective) popupref: QueryList<PopoverDirective>;
  @ViewChild("table") table: ElementRef;
  constructor(
    private router: Router,
    private tableBookingManagementService: TableBookingManagementService,
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
    this.tableBookingManagementService.getBookingList().subscribe((res) => {
      console.log("res: ", res);
      this.bookingList = res["resObject"];
      this.rawBookingList = res["resObject"];
      if(this.rawBookingList != undefined || this.rawBookingList != null){
      this.bookingList = [...this.rawBookingList];
      this.paginateBookingList = this.bookingList.slice(0, this.pageItems);
      }
      else{
        this.bookingList =res["resObject"];
      }
      this.currentPage = 1;
      this.searchRequest = false;
      if (this.paginateBookingList.length > 4) {
        this.bookingListLength = this.paginateBookingList.length - 2;
      } else {
        this.bookingListLength = 5;
      }
      this.spinner.hide();
      console.log("bookingList", this.bookingList);
    });
    this.restaurantMaster();
    this.tableMaster();

    // this.tableMaster();
    var dformat = localStorage.getItem("isCurrentDateformat");
    this.bookingData.bookingStartDate = moment().format(dformat);
    this.bookingData.bookingEndDate = moment().format(dformat);
    this.bsConfigEnd = Object.assign(
      {},
      {
        containerClass: "theme-blue",
        dateInputFormat: "DD-MMM-YYYY",
        minDate: new Date(),
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

    this.dropdownSettings = {
      singleSelection: false,
      idField: "tableId",
      textField: "tableNumber",
      selectAllText: "Select All",
      unSelectAllText: "UnSelect All",
      itemsShowLimit: 1,
      allowSearchFilter: true,
    };
    this.setStatus();
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
  setStatus() {
    this.selectedItems.length > 0
      ? (this.requiredField = true)
      : (this.requiredField = false);
  }

  onItemSelect(item: any) {
    //Do something if required
    this.setClass();
  }
  onSelectAll(items: any) {
    //Do something if required
    this.setClass();
  }

  setClass() {
    this.setStatus();
    if (this.selectedItems.length > 0) {
      return "form-control ";
    } else {
      return "form-control";
    }
  }
  tableMaster() {
    this.tableBookingManagementService.getTableList().subscribe((res) => {
      console.log("res: ", res);
      this.tableList = res["resObject"];
      this.dropdownList = res["resObject"];
      console.log("tableList", this.tableList);
    });
  }
  restaurantMaster() {
    this.tableBookingManagementService.getRestaurantType().subscribe((res) => {
      console.log("res: ", res);
      this.bookingRestaurantMaster = res["resObject"];
      console.log("bookingRestaurantMaster", this.bookingRestaurantMaster);
    });
  }
  menuTypeMaster() {
    this.tableBookingManagementService
      .getTableByRestaurant()
      .subscribe((res) => {
        console.log("res: ", res);
        this.bookingTableMaster = res["resObject"];
        console.log("bookingTableMaster", this.bookingTableMaster);
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
  this.bookingList = this.rawBookingList.filter((bookingItem: any) =>
  bookingItem.bookingStartDate && bookingItem.bookingStartDate.toLowerCase().includes(filterText.toLowerCase())
      || bookingItem.bookingEndDate && bookingItem.bookingEndDate.toLowerCase().includes(filterText.toLowerCase())
      || bookingItem.restaurantName && bookingItem.restaurantName.toLowerCase().includes(filterText.toLowerCase())
      || bookingItem.tableNumber && bookingItem.tableNumber.toLowerCase().includes(filterText.toLowerCase())
      || bookingItem.guestName && bookingItem.guestName.toLowerCase().includes(filterText.toLowerCase())
      || bookingItem.guestNumber && bookingItem.guestNumber.toString().toLowerCase().includes(filterText.toLowerCase())
      || bookingItem.bookingStartTiming && bookingItem.bookingStartTiming.toString().toLowerCase().includes(filterText.toLowerCase())
      || bookingItem.bookingStartTime1 && bookingItem.bookingStartTime1.toLowerCase().includes(filterText.toLowerCase())
      || bookingItem.bookingEndTiming && bookingItem.bookingEndTiming.toString().toLowerCase().includes(filterText.toLowerCase())
      ||  bookingItem.bookingEndTime1 && bookingItem.bookingEndTime1.toLowerCase().includes(filterText.toLowerCase())
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
  this.paginateBookingList = this.bookingList == null ? [] : this.bookingList.slice(startItem, endItem);
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
    const tableHeading = 'Booking Desk';
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

  bookingAdd() {
    this.bookingData.tableId = [];
    console.log("selected===", this.selectedItems);
    for (var k in this.selectedItems) {
      this.bookingData.tableId.push(this.selectedItems[k].tableId);
    }
    console.log("tableId===", this.bookingData);
    var intRegex = /^((\\+91-?)|0)?[0-9]{10}$/;
    if (this.bookingData.bookingStartDate == "") {
      this.alertSerive.create(
        "", //title
        "danger", //type
        20000, // time
        "Please Select Start Date!" //body
      );
    } else if (this.bookingData.bookingEndDate == "") {
      this.alertSerive.create(
        "", //title
        "danger", //type
        20000, // time
        "Please Select End Date!" //body
      );
    } else if (this.bookingData.restaurantId == "") {
      this.alertSerive.create(
        "", //title
        "danger", //type
        20000, // time
        "Please Select Restaurant!" //body
      );
    } else if (this.bookingData.tableId.length < 1) {
      this.alertSerive.create(
        "", //title
        "danger", //type
        20000, // time
        "please Select Table!" //body
      );
    } else if (this.bookingData.bookingStartTime == "") {
      this.alertSerive.create(
        "", //title
        "danger", //type
        20000, // time
        "please Select Start Time!" //body
      );
    } else if (this.bookingData.bookingEndTime == "") {
      this.alertSerive.create(
        "", //title
        "danger", //type
        20000, // time
        "please Select End Time!" //body
      );
    } else if (this.bookingData.guestName == "") {
      this.alertSerive.create(
        "", //title
        "danger", //type
        20000, // time
        "please Enter Guest Name!" //body
      );
    } else if (this.bookingData.guestPhoneNo == "") {
      this.alertSerive.create(
        "", //title
        "danger", //type
        20000, // time
        "please Enter Guest Number!" //body
      );
    } else if (
      this.bookingData.guestPhoneNo.length < 10 ||
      !intRegex.test(this.bookingData.guestPhoneNo)
    ) {
      this.alertSerive.create(
        "", //title
        "danger", //type
        20000, // time
        "Please Enter valid Phone No!" //body
      );
    } else {
      this.bookingData.bookingStartDate = moment(
        this.bookingData.bookingStartDate
      ).format("YYYY-MM-DD");
      this.bookingData.bookingEndDate = moment(
        this.bookingData.bookingEndDate
      ).format("YYYY-MM-DD");
      console.log("bookingData old", this.bookingData);
      if (this.bookingData.bookingAllocationId == 0) {
        this.spinner.show();
        this.tableBookingManagementService
          .addBookngDetals(this.bookingData)
          .subscribe((res) => {
            console.log("bookingData", this.bookingData);
            this.bookingSaveData = res;
            if (this.bookingSaveData.status == "Success") {
              console.log("add successfull");
              //  this.alerts.setMessage('Recipe Added successfully!','success');
              this.spinner.hide();
              this.alertSerive.create(
                "", //title
                "success", //type
                5000, // time
                "Information Saved Successfully!" //body
              );
              this.bookingData = {
                restaurantId: "",
                tableId: [],
                guestName: "",
                guestPhoneNo: "",
                hotelRoomNum: "",
                bookingStartDate: "",
                bookingEndDate: "",
                bookingStartTime: "",
                bookingEndTime: "",
                bookingStartTime1: "",
                bookingEndTime1: "",
                bookingAllocationId: 0,
                guestId: 0,
              };
              this.ngOnInit();
              this.selectedItems = [];
            } else {
              this.spinner.hide();
              this.alertSerive.create(
                "", //title
                "danger", //type
                5000, // time
                this.bookingSaveData.responseMessage //body
              );
            }
          });
      } else if (this.bookingData.bookingAllocationId > 0) {
        this.spinner.show();
        this.tableBookingManagementService
          .editBookngDetails(this.bookingData)
          .subscribe((res) => {
            console.log("bookingData", this.bookingData);
            this.bookingSaveData = res;
            if (this.bookingSaveData.status == "Success") {
              console.log("add successfull");
              //  this.alerts.setMessage('Recipe Added successfully!','success');
              this.spinner.hide();
              this.alertSerive.create(
                "", //title
                "success", //type
                5000, // time
                "Information Updated Successfully!" //body
              );
              this.bookingData = {
                restaurantId: "",
                tableId: [],
                guestName: "",
                guestPhoneNo: "",
                hotelRoomNum: "",
                bookingStartDate: "",
                bookingEndDate: "",
                bookingStartTime: "",
                bookingEndTime: "",
                bookingStartTime1: "",
                bookingEndTime1: "",
                bookingAllocationId: 0,
                guestId: 0,
              };
              this.ngOnInit();
              this.selectedItems = [];
            } else {
              this.spinner.hide();
              this.alertSerive.create(
                "", //title
                "danger", //type
                5000, // time
                this.bookingSaveData.responseMessage //body
              );
            }
          });
      }
    }
  }
  clearSearch() {
    this.bookingData = {
      restaurantId: "",
      tableId: [],
      guestName: "",
      guestPhoneNo: "",
      hotelRoomNum: "",
      bookingStartDate: "",
      bookingEndDate: "",
      bookingStartTime: "",
      bookingEndTime: "",
      bookingStartTime1: "",
      bookingEndTime1: "",
      bookingAllocationId: 0,
      guestId: 0,
    };
  }
  deleteBooking(bookingId) {
    this.spinner.show();
    this.tableBookingManagementService
      .deleteBooking(bookingId)
      .subscribe((res) => {
        console.log("res: ", res);
        if (this.deleteres.status == "Success") {
          this.spinner.hide();
          this.ngOnInit();
          this.alertSerive.create(
            "", //title
            "danger", //type
            5000, // time
            "Information deleted successfully!" //body
          );
        } else {
          this.spinner.hide();
          this.ngOnInit();
          this.alertSerive.create(
            "", //title
            "danger", //type
            5000, // time
            "something went wrong!" //body
          );
        }
      });
  }

  editBooking(data) {
    console.log("data", data);
    this.selectedItems = [];
    this.bookingData.restaurantId = data.restaurantId;
    // this.bookingData.tableId = data.tableId;
    this.bookingData.guestName = data.guestName;
    this.bookingData.guestPhoneNo = data.guestNumber;
    this.bookingData.hotelRoomNum = data.itemMastId;
    this.bookingData.bookingStartDate = data.bookingStartDate;
    this.bookingData.bookingEndDate = data.bookingEndDate;
    this.bookingData.bookingStartTime = data.bookingStartTiming;
    this.bookingData.bookingEndTime = data.bookingEndTiming;
    this.bookingData.bookingStartTime1 = data.bookingStartTime1;
    this.bookingData.bookingEndTime1 = data.bookingEndTime1;
    this.bookingData.bookingAllocationId = data.bookingAllocationId;
    this.bookingData.guestId = data.guestId;

    for (var k in this.dropdownList) {
      if (data.tableId == this.dropdownList[k].tableId) {
        this.selectedItems.push(this.dropdownList[k]);
      }
    }
    console.log("selectedItems", this.selectedItems);
    console.log("bookingData", this.bookingData);
  }
}
