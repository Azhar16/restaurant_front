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
import { DayPilotMonthComponent } from "daypilot-pro-angular";
import { flatMap } from 'rxjs/operators';
import { NgForm } from '@angular/forms';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import {
  PerfectScrollbarConfigInterface,
  PerfectScrollbarComponent,
} from "ngx-perfect-scrollbar";
import { PopoverDirective } from "ngx-bootstrap/popover";
import { Router } from "@angular/router";

import { PurchaseManagementService } from "../../services/restaurant/purchase-management.service";
import { RouteParameterService } from "../../../shared/route.parameter.service";
import { IPurchase } from "./purchaseList";
import moment from "moment";
import * as jsPDF from "jspdf";
import html2canvas from "html2canvas";
import * as $ from "jquery";
import * as XLSX from "xlsx";
import _ from 'underscore';
//import { NgxSpinnerService } from "ngx-spinner";
import { Ng4LoadingSpinnerService } from "ng4-loading-spinner";
//import { ToastrService } from 'ngx-toastr';
import { AlertService } from "../../../shared/modules/alert/services/alert.service";

@Component({
  selector: "app-restaurant-purchase-management",
  templateUrl: "./restaurant-purchase-management.component.html",
  styles: ['::ng-deep.bs-datepicker { left: 25px; top: 2px; }']
})
export class RestaurantPurchaseManagementComponent implements OnInit {

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
  public selectedAvailRoomTypeItem: IPurchase;
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

  //  scrollBarContainerHeight: number;
  quickReservationModalRef: BsModalRef;

  public purchaseList: IPurchase[];
  public purchaseListLength: any;
  private popoverIndex: number;
  purchaseData = {
    prodDesc: "",
    prodType: "",
    prodQuantity: "",
    prodPricing: "",
    categoryId: "",
    purchaseid: 0,
  };
  purchaseTypeMaster: any;
  purchaseSaveData: any;

  public now: number;

  cancelClicked = true;
  deleteres: any;

  @ViewChild(PerfectScrollbarComponent)
  componentRef?: PerfectScrollbarComponent;
 // public config: PerfectScrollbarConfigInterface = {};
  scrollBarContainerHeight: number = 0;
  @ViewChildren(PopoverDirective) popupref: QueryList<PopoverDirective>;
  @ViewChild("table") table: ElementRef;


  public searchRequest: boolean;
  public searchedBookingSrcItem: any;
  public searchedBookingStatus: string;
  public rawBookingList: any;
  public disableConfirmUnconfirm: boolean;
  public filterSearchData: string;

 
 


  constructor(
    private router: Router,
    private purchaseManagementService: PurchaseManagementService,
    private modalService: BsModalService,
    private cd: ChangeDetectorRef,
    private routeParamService: RouteParameterService,
    private alertSerive: AlertService, 
//  private spinner: NgxSpinnerService,
    private spinner: Ng4LoadingSpinnerService,
  //  private toastr: ToastrService,
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
    this.purchaseManagementService.getPurchaseList().subscribe((res) => {
      console.log("res: ", res);
      this.rawBookingList = res["resObject"];
      this.purchaseList = [...this.rawBookingList];
      this.paginateBookingList = this.purchaseList.slice(0, this.pageItems);
      this.currentPage = 1;
      this.searchRequest = false;
      if (this.paginateBookingList.length > 4) {
        this.purchaseListLength = this.paginateBookingList.length - 2;
      } else {
        this.purchaseListLength = 5;
      }
      
      this.spinner.hide();
      console.log("purchaseList", this.purchaseList);
    });
    this.searchRequest = false;
        // this.routeParamService.changeRoute({
        //     url: this.router.url,
        //     pageName: 'Manage Reservation'
        // });

       
        this.searchedBookingSrcItem = {
          sourceId: "0",
          sourceName: "All",
          sourceType: null
      };
      this.searchedBookingStatus = "All";
      this.disableConfirmUnconfirm = true;
    this.purchaseTypeMasterDropdown();
    this.now = Date.now();
    setInterval(() => {
      this.now = Date.now();
    }, 1000);
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
  this.purchaseList = this.rawBookingList.filter((bookingItem: any) =>
  bookingItem.description && bookingItem.description.toLowerCase().includes(filterText.toLowerCase())
      || bookingItem.categoryDescription && bookingItem.categoryDescription.toLowerCase().includes(filterText.toLowerCase())
      || bookingItem.quantity && bookingItem.quantity.toString().toLowerCase().includes(filterText.toLowerCase())
      || bookingItem.rate && bookingItem.rate.toString().toLowerCase().includes(filterText.toLowerCase())
      || bookingItem.taxDate && bookingItem.taxDate.toLowerCase().includes(filterText.toLowerCase())
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
  this.paginateBookingList = this.purchaseList == null ? [] : this.purchaseList.slice(startItem, endItem);
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
  purchaseTypeMasterDropdown() {
    this.purchaseManagementService.getPurchaseType().subscribe((res) => {
      console.log("res: ", res);
      this.purchaseTypeMaster = res["resObject"];
      console.log("purchaseTypeMaster", this.purchaseTypeMaster);
    });
  }
  public printData() {
    const tableHeading = 'Purchase Desk';
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
  purchaseAdd() {
    var intRegex = /^\d*$/;
    if (this.purchaseData.prodDesc == "") {
      this.alertSerive.create(
        "", //title
        "danger", //type
        20000, // time
        "Please Enter Description!" //body
      );
    } else if (this.purchaseData.prodType == "") {
      this.alertSerive.create(
        "", //title
        "danger", //type
        20000, // time
        "Please Select a Product Type!" //body
      );
    } else if (this.purchaseData.prodQuantity == "") {
      this.alertSerive.create(
        "", //title
        "danger", //type
        20000, // time
        "Please Enter Quantity!" //body
      );
    } else if (!intRegex.test(this.purchaseData.prodQuantity)) {
      this.alertSerive.create(
        "", //title
        "danger", //type
        20000, // time
        "Please Enter Only Numbers in Quantity Section!" //body
      );
    } else if (this.purchaseData.prodPricing == "") {
      this.alertSerive.create(
        "", //title
        "danger", //type
        20000, // time
        "please Enter Price!" //body
      );
    } else if (!intRegex.test(this.purchaseData.prodPricing)) {
      this.alertSerive.create(
        "", //title
        "danger", //type
        20000, // time
        "Please Enter Only Numbers in Pricing Section!" //body
      );
    } else {
      console.log("purchaseData old", this.purchaseData);
      if (this.purchaseData.purchaseid == 0) {
        this.spinner.show();
        this.purchaseManagementService
          .addPurchaseDetails(this.purchaseData)
          .subscribe((res) => {
            console.log("purchaseData", this.purchaseData);
            console.log("res", res);
            this.purchaseSaveData = res;
            if (this.purchaseSaveData.status == "Success") {
              console.log("add successfull");
              //  this.alerts.setMessage('purchase Data Added successfully!','success');
              this.spinner.hide();
              this.alertSerive.create(
                "", //title
                "success", //type
                5000, // time
                "Information Saved Successfully!" //body
              );
              this.purchaseData = {
                prodDesc: "",
                prodType: "",
                prodQuantity: "",
                prodPricing: "",
                categoryId: "",
                purchaseid: 0,
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
      } else if (this.purchaseData.purchaseid > 0) {
        this.spinner.show();
        this.purchaseManagementService
          .editPurchaseDetails(this.purchaseData)
          .subscribe((res) => {
            console.log("purchaseData", this.purchaseData);
            console.log("res", res);
            this.purchaseSaveData = res;
            if (this.purchaseSaveData.status == "Success") {
              console.log("add successfull");
              //  this.alerts.setMessage('purchase Data Added successfully!','success');
              this.spinner.hide();
              this.alertSerive.create(
                "", //title
                "success", //type
                5000, // time
                "Information Updated Successfully!" //body
              );
              this.purchaseData = {
                prodDesc: "",
                prodType: "",
                prodQuantity: "",
                prodPricing: "",
                categoryId: "",
                purchaseid: 0,
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
    this.purchaseData = {
      prodDesc: "",
      prodType: "",
      prodQuantity: "",
      prodPricing: "",
      categoryId: "",
      purchaseid: 0,
    };
  }

  deletePurchase(purchaseId) {
    this.spinner.show();
    this.purchaseManagementService
      .deletePurchase(purchaseId)
      .subscribe((res) => {
        console.log("res: ", res);
        this.deleteres = res;
        if (this.deleteres.status == "Success") {
          this.spinner.hide();
          this.ngOnInit();
          this.alertSerive.create(
            "", //title
            "success", //type
            5000, // time
            "Information Deleted successfully!" //body
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

  editPurchase(data) {
    console.log("data", data);
    this.purchaseData.prodDesc = data.description;
    this.purchaseData.prodType = data.categoryId;
    this.purchaseData.prodQuantity = data.quantity;
    this.purchaseData.prodPricing = data.rate;
    this.purchaseData.categoryId = data.categoryId;
    this.purchaseData.purchaseid = data.purchaseId;

    console.log("purchaseData", this.purchaseData);
  }
}
