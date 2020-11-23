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

import { RestaurantTaxService } from "../../services/restaurant/restaurant-tax.service";
import { RouteParameterService } from "../../../shared/route.parameter.service";
import { IRestaurantTax } from "./taxList";
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


@Component({
  selector: "app-restaurant-tax",
  templateUrl: "./restaurant-tax.component.html",
  styleUrls: ["./restaurant-tax.component.scss"],
})
export class RestaurantTaxComponent implements OnInit {
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

  //scrollBarContainerHeight: number;
  quickReservationModalRef: BsModalRef;

  public taxList: IRestaurantTax[];
  private taxListLength: any;
  private popoverIndex: number;
  taxData = {
    restaurant: "",
    taxcode: "",
    description: "",
    category: "",
    value: "",
    valueType: "",
    taxId: 0,
    taxMapId: 0,
  };
  recipeCategoryMaster: any;
  foodMenuTypeMaster: any;
  taxSaveData: any;
  public now: number;
  cancelClicked = true;
  deleteres: any;
  taxRestaurantMaster: any;
  categoryMstList: any;

  @ViewChild(PerfectScrollbarComponent)
  componentRef?: PerfectScrollbarComponent;
  scrollBarContainerHeight: number = 0;
  @ViewChildren(PopoverDirective) popupref: QueryList<PopoverDirective>;
  @ViewChild("table") table: ElementRef;

  //template: string = `<img src="http://pa1.narvii.com/5722/2c617cd9674417d272084884b61e4bb7dd5f0b15_hq.gif" />`;

  constructor(
    private router: Router,
    private restaurantTaxService: RestaurantTaxService,
    private modalService: BsModalService,
    private routeParamService: RouteParameterService,
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
    this.spinner.show();
    this.disableConfirmUnconfirm = true;
    this.searchRequest = true;
    this.restaurantTaxService.getTaxList().subscribe((res) => {
      console.log("res: ", res);
      this.rawBookingList = res["resObject"];
      if(this.rawBookingList != undefined || this.rawBookingList != null){
      this.taxList = [...this.rawBookingList];
      this.paginateBookingList = this.taxList.slice(0, this.pageItems);
      }
      else{
        this.taxList =res["resObject"];
      }
      this.currentPage = 1;
      this.searchRequest = false;
      if (this.paginateBookingList.length > 4) {
        this.taxListLength = this.paginateBookingList.length - 2;
      } else {
        this.taxListLength = 5;
      }

      this.spinner.hide();
      //  console.log("recipeList", this.recipeList);
    });
    //  this.categoryMaster();
    this.restaurantMaster();
    this.menuTypeMaster();
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
  this.taxList = this.rawBookingList.filter((bookingItem: any) =>
  bookingItem.restaurantName && bookingItem.restaurantName.toLowerCase().includes(filterText.toLowerCase())
      || bookingItem.taxCode && bookingItem.taxCode.toLowerCase().includes(filterText.toLowerCase())
      || bookingItem.taxDescription && bookingItem.taxDescription.toLowerCase().includes(filterText.toLowerCase())
      || bookingItem.taxValue && bookingItem.taxValue.toString().toLowerCase().includes(filterText.toLowerCase())
      || bookingItem.itemTypeName && bookingItem.itemTypeName.toLowerCase().includes(filterText.toLowerCase())
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
  this.paginateBookingList = this.taxList == null ? [] : this.taxList.slice(startItem, endItem);
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
    this.restaurantTaxService.getRestaurantType().subscribe((res) => {
      console.log("res: ", res);
      this.taxRestaurantMaster = res["resObject"];
      console.log("bookingRestaurantMaster", this.taxRestaurantMaster);
    });
  }
  menuTypeMaster() {
    this.restaurantTaxService.getAllMenutypeList().subscribe((res) => {
      console.log("res: ", res);
      this.foodMenuTypeMaster = res["resObject"];
      console.log("foodMenuTypeMaster", this.foodMenuTypeMaster);
    });
  }
  taxAdd() {
    console.log("vall==", parseInt(this.taxData.value));
    var intRegex = /^\d*$/;
    if (this.taxData.restaurant == "") {
      this.alertSerive.create(
        "", //title
        "danger", //type
        20000, // time
        "Please Select a Restaurant!" //body
      );
    } else if (this.taxData.taxcode == "") {
      this.alertSerive.create(
        "", //title
        "danger", //type
        20000, // time
        "Please Enter Tax Code!" //body
      );
    } else if (this.taxData.category == "") {
      this.alertSerive.create(
        "", //title
        "danger", //type
        20000, // time
        "Please Select a Food Category!" //body
      );
    } else if (this.taxData.description == "") {
      this.alertSerive.create(
        "", //title
        "danger", //type
        20000, // time
        "please Enter Description!" //body
      );
    } else if (this.taxData.value == "") {
      this.alertSerive.create(
        "", //title
        "danger", //type
        20000, // time
        "please Enter Tax Value!" //body
      );
    } else if (
      !intRegex.test(this.taxData.value) ||
      parseInt(this.taxData.value) < 0
    ) {
      this.alertSerive.create(
        "", //title
        "danger", //type
        20000, // time
        "please Enter valid Tax Amount!" //body
      );
    } else {
      if ($('input[name="switchcheck"]').prop("checked") == false) {
        this.taxData.valueType = "Value";
      }
      if ($('input[name="switchcheck"]').prop("checked") == true) {
        this.taxData.valueType = "Percentage";
      }

      if (this.taxData.taxId == 0) {
        this.spinner.show();
        this.restaurantTaxService
          .addTaxDetails(this.taxData)
          .subscribe((res) => {
            console.log("taxData", this.taxData);
            this.taxSaveData = res;
            if (this.taxSaveData.status == "Success") {
              console.log("add successfull");
              //  this.alerts.setMessage('Recipe Added successfully!','success');
              this.spinner.hide();
              this.alertSerive.create(
                "", //title
                "success", //type
                5000, // time
                "Information Saved Successfully!" //body
              );
              this.taxData = {
                restaurant: "",
                taxcode: "",
                description: "",
                category: "",
                value: "",
                valueType: "",
                taxId: 0,
                taxMapId: 0,
              };
              this.ngOnInit();
            } else {
              this.spinner.hide();
              this.alertSerive.create(
                "", //title
                "danger", //type
                5000, // time
                this.taxSaveData.responseMessage //body
              );
            }
          });
      } else if (this.taxData.taxId > 0 && this.taxData.taxMapId > 0) {
        this.spinner.show();
        this.restaurantTaxService
          .editTaxDetails(this.taxData)
          .subscribe((res) => {
            console.log("taxData", this.taxData);
            this.taxSaveData = res;
            if (this.taxSaveData.status == "Success") {
              console.log("add successfull");
              //  this.alerts.setMessage('Recipe Added successfully!','success');
              this.spinner.hide();
              this.alertSerive.create(
                "", //title
                "success", //type
                5000, // time
                "Information Updated Successfully!" //body
              );
              this.taxData = {
                restaurant: "",
                taxcode: "",
                description: "",
                category: "",
                value: "",
                valueType: "",
                taxId: 0,
                taxMapId: 0,
              };
              this.ngOnInit();
            } else {
              this.spinner.hide();
              this.alertSerive.create(
                "", //title
                "danger", //type
                5000, // time
                this.taxSaveData.responseMessage //body
              );
            }
          });
      }
    }
  }
  clearSearch() {
    this.taxData = {
      restaurant: "",
      taxcode: "",
      description: "",
      category: "",
      value: "",
      valueType: "",
      taxId: 0,
      taxMapId: 0,
    };
  }

  deleteTax(taxId) {
    this.spinner.show();
    this.restaurantTaxService.deleteTax(taxId).subscribe((res) => {
      console.log("res: ", res);
      this.deleteres = res;
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

  editTax(data) {
    console.log("data", data);

    this.taxData.restaurant = data.restaurantId;
    this.taxData.taxcode = data.taxCode;
    this.taxData.description = data.taxDescription;
    this.taxData.value = data.taxValue;
    this.taxData.category = data.itemTypeId;
    this.taxData.taxId = data.taxId;
    this.taxData.taxMapId = data.taxMapId;
    if (data.valueType == "Percentage") {
      $('input[name="switchcheck"]').prop("checked", true);
    }
    if (data.valueType == "Value") {
      $('input[name="switchcheck"]').prop("checked", false);
    }
  }
}
