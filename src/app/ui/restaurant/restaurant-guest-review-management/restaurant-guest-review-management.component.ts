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

import { GuestReviewManagementService } from "../../services/restaurant/guest-review-management.service";
import { RouteParameterService } from "../../../shared/route.parameter.service";
import { IGuestReview } from "./guestReview";
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
  selector: "app-restaurant-guest-review-management",
  templateUrl: "./restaurant-guest-review-management.component.html",
  styleUrls: ["./restaurant-guest-review-management.component.scss"],
})
export class RestaurantGuestReviewManagementComponent implements OnInit {
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

  scrollBarContainerHeight: number;
  quickReservationModalRef: BsModalRef;

  public guestDatePickerStart: any;

  popoverMessage = "Do you want to delete ?";
  popoverTitle = "Record delete confirmation";

  popoverMessage2 = "Do you want to proceed?";
  popoverTitle2 = "";
  confirmText1: string = "Yes";
  cancelText1: string = "No";

  public guestReviewList: IGuestReview[];
  guestListLength: any;
  private popoverIndex: number;
  guestReviewData = {
    table: "",
    guestName: "",
    guestNumber: "",
    staff: "",
    gdate: "",
    guestEmail: "",
    foodQuality: "",
    service: "",
    ambience: "",
    rating: "",
    staffRating: "",
    comments: "",
    guestId: 0,
    guestReviewMapId: 0,
  };
  guestReviewTypeMaster: any;
  guestAllTable: any;
  guestAllStaff: any;
  public now: number;
  cancelClicked = true;
  guestReviewSaveData: any;

  @ViewChild(PerfectScrollbarComponent)
  componentRef?: PerfectScrollbarComponent;
  @ViewChildren(PopoverDirective) popupref: QueryList<PopoverDirective>;
  @ViewChild("table") table: ElementRef;

  constructor(
    private router: Router,
    private guestReviewService: GuestReviewManagementService,
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
    this.guestReviewService.getGuestReviewList().subscribe((res) => {
      console.log("res: ", res);
      this.rawBookingList = res["resObject"];
      this.guestReviewList = [...this.rawBookingList];
      this.paginateBookingList = this.guestReviewList.slice(0, this.pageItems);
      this.currentPage = 1;
      this.searchRequest = false;
      if (this.paginateBookingList.length > 4) {
        this.guestListLength = this.paginateBookingList.length - 2;
      } else {
        this.guestListLength = 5;
      }
      this.spinner.hide();
      console.log("guestReviewList", this.guestReviewList);
    });
    var dformat = localStorage.getItem("isCurrentDateformat");
    this.guestReviewData.gdate = moment().format(dformat);
    this.allMasterDropdown();
    this.masterTable();
    this.masterStaff();

    this.bsConfigStart = Object.assign(
      {},
      {
        containerClass: "theme-blue",
        dateInputFormat: "DD-MMM-YYYY",
        // minDate: new Date(),
        showWeekNumbers: false,
      }
    );

     /* pagination */
     this.searchRequest = false;
    
     this.searchedBookingSrcItem = {
       sourceId: "0",
       sourceName: "All",
       sourceType: null
   };
   this.searchedBookingStatus = "All";
   this.disableConfirmUnconfirm = true;

  }
  allMasterDropdown() {
    this.guestReviewService.getAllReviewType().subscribe((res) => {
      console.log("res: ", res);
      this.guestReviewTypeMaster = res["resObject"];
      console.log("guestReviewTypeMaster", this.guestReviewTypeMaster);
    });
  }
  masterTable() {
    this.guestReviewService.getMasterTable().subscribe((res) => {
      console.log("res: ", res);
      this.guestAllTable = res["resObject"];
      console.log("guestAllTable", this.guestAllTable);
    });
  }
  masterStaff() {
    this.guestReviewService.getMasterStaff().subscribe((res) => {
      console.log("res: ", res);
      this.guestAllStaff = res["resObject"];
      console.log("guestAllStaff", this.guestAllStaff);
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
  this.guestReviewList = this.rawBookingList.filter((bookingItem: any) =>
  bookingItem.reviewDate && bookingItem.reviewDate.toLowerCase().includes(filterText.toLowerCase())
      || bookingItem.guestName && bookingItem.guestName.toLowerCase().includes(filterText.toLowerCase())
      || bookingItem.staffName && bookingItem.staffName.toLowerCase().includes(filterText.toLowerCase())
      || bookingItem.qualityDesc && bookingItem.qualityDesc.toLowerCase().includes(filterText.toLowerCase())
      || bookingItem.serviceDesc && bookingItem.serviceDesc.toLowerCase().includes(filterText.toLowerCase())
      || bookingItem.ambienceDesc && bookingItem.ambienceDesc.toLowerCase().includes(filterText.toLowerCase())
      || bookingItem.staffRatingDesc && bookingItem.staffRatingDesc.toLowerCase().includes(filterText.toLowerCase())
      || bookingItem.overallScore && bookingItem.overallScore.toLowerCase().includes(filterText.toLowerCase())
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
  this.paginateBookingList = this.guestReviewList == null ? [] : this.guestReviewList.slice(startItem, endItem);
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
    const tableHeading = 'Guest-Review Desk';
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

  guestRiviewAdd() {
    if (this.guestReviewData.table == "") {
      this.alertSerive.create(
        "", //title
        "danger", //type
        20000, // time
        "Please Select a Table!" //body
      );
    } else if (this.guestReviewData.guestName == "") {
      this.alertSerive.create(
        "", //title
        "danger", //type
        20000, // time
        "Please Enter Guest Name!" //body
      );
    } else if (this.guestReviewData.guestNumber == "") {
      this.alertSerive.create(
        "", //title
        "danger", //type
        20000, // time
        "Please Enter Guest Number !" //body
      );
    } else if (this.guestReviewData.staff == "") {
      this.alertSerive.create(
        "", //title
        "danger", //type
        20000, // time
        "Please Select a Staff !" //body
      );
    } else if (this.guestReviewData.foodQuality == "") {
      this.alertSerive.create(
        "", //title
        "danger", //type
        20000, // time
        "Please Select a Food Quality !" //body
      );
    } else if (this.guestReviewData.ambience == "") {
      this.alertSerive.create(
        "", //title
        "danger", //type
        20000, // time
        "Please Select a Ambience !" //body
      );
    } else if (this.guestReviewData.rating == "") {
      this.alertSerive.create(
        "", //title
        "danger", //type
        20000, // time
        "Please Select a Rating !" //body
      );
    } else if (this.guestReviewData.staffRating == "") {
      this.alertSerive.create(
        "", //title
        "danger", //type
        20000, // time
        "Please Select a Staff Rating !" //body
      );
    } else if (this.guestReviewData.guestEmail == "") {
      this.alertSerive.create(
        "", //title
        "danger", //type
        20000, // time
        "Please Enter Guest Email !" //body
      );
    } else if (this.guestReviewData.gdate == "") {
      this.alertSerive.create(
        "", //title
        "danger", //type
        20000, // time
        "Please Enter Date !" //body
      );
    } else if (this.guestReviewData.service == "") {
      this.alertSerive.create(
        "", //title
        "danger", //type
        20000, // time
        "Please Select a service !" //body
      );
    } else {
      this.guestReviewData.gdate = moment(this.guestReviewData.gdate).format(
        "YYYY-MM-DD"
      );
      console.log("guestInfoData old", this.guestReviewData);
      if (
        this.guestReviewData.guestId == 0 &&
        this.guestReviewData.guestReviewMapId == 0
      ) {
        this.spinner.show();
        this.guestReviewService
          .addGuestReview(this.guestReviewData)
          .subscribe((res) => {
            console.log("guestReviewData", this.guestReviewData);
            console.log("res", res);
            this.guestReviewSaveData = res;
            if (this.guestReviewSaveData.status == "Success") {
              console.log("add successfull");
              this.spinner.hide();
              this.alertSerive.create(
                "", //title
                "success", //type
                5000, // time
                "Information Saved Successfully!" //body
              );
              this.guestReviewData = {
                table: "",
                guestName: "",
                guestNumber: "",
                staff: "",
                gdate: "",
                guestEmail: "",
                foodQuality: "",
                service: "",
                ambience: "",
                rating: "",
                staffRating: "",
                comments: "",
                guestId: 0,
                guestReviewMapId: 0,
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
      } else if (
        this.guestReviewData.guestId > 0 &&
        this.guestReviewData.guestReviewMapId > 0
      ) {
        this.spinner.show();
        this.guestReviewService
          .editGuestReview(this.guestReviewData)
          .subscribe((res) => {
            console.log("guestReviewData", this.guestReviewData);
            console.log("res", res);
            this.guestReviewSaveData = res;
            if (this.guestReviewSaveData.status == "Success") {
              console.log("add successfull");
              this.spinner.hide();
              this.alertSerive.create(
                "", //title
                "success", //type
                5000, // time
                "Information Updated Successfully!" //body
              );
              this.guestReviewData = {
                table: "",
                guestName: "",
                guestNumber: "",
                staff: "",
                gdate: "",
                guestEmail: "",
                foodQuality: "",
                service: "",
                ambience: "",
                rating: "",
                staffRating: "",
                comments: "",
                guestId: 0,
                guestReviewMapId: 0,
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
    this.guestReviewData = {
      table: "",
      guestName: "",
      guestNumber: "",
      staff: "",
      gdate: "",
      guestEmail: "",
      foodQuality: "",
      service: "",
      ambience: "",
      rating: "",
      staffRating: "",
      comments: "",
      guestId: 0,
      guestReviewMapId: 0,
    };
  }

  deleteGuestReview(guestid) {
    this.spinner.show();
    this.guestReviewService.deleteGuestReview(guestid).subscribe((res) => {
      console.log("res: ", res);
      this.spinner.hide();
      this.ngOnInit();
      this.alertSerive.create(
        "", //title
        "success", //type
        5000, // time
        "Information Deleted successfully!" //body
      );
    });
  }
  editGuestReview(data) {
    console.log("data", data);

    this.guestReviewData.table = data.tableId;
    this.guestReviewData.guestName = data.guestName;
    this.guestReviewData.guestNumber = data.phoneNo;
    this.guestReviewData.guestEmail = data.emailId;
    this.guestReviewData.foodQuality = data.quality;
    this.guestReviewData.gdate = data.reviewDate;
    this.guestReviewData.service = data.service;
    this.guestReviewData.ambience = data.ambience;
    this.guestReviewData.staffRating = data.staffRating;
    this.guestReviewData.comments = data.remarks;
    this.guestReviewData.guestId = data.guestId;
    this.guestReviewData.guestReviewMapId = data.guestReviewMapId;
    this.guestReviewData.staff = data.staffName;

    var overallrating = data.overallScore;
    var arr = overallrating.split("/");
    this.guestReviewData.rating = arr[0];

    console.log("guestReviewData", this.guestReviewData);
  }
}
