import { Router } from "@angular/router";
import { Subscription } from "rxjs";

import { DataEventService } from "../../shared/data.event.service";
import { RouteParameterService } from "../../shared/route.parameter.service";
import { RestaurentGeneralComponent } from "./restaurent-general/restaurent-general.component";
import { LeftSideBarComponent } from "./left-side-bar/left-side-bar.component";

import { RestaurantCalendarBusinessComponent } from "./restaurant-calendar-business/restaurant-calendar-business.component";
import { RestaurantPrimaryCategoryFoodComponent } from "./restaurant-primary-category-food/restaurant-primary-category-food.component";
import { RestaurantRecipeComponent } from "./restaurant-recipe/restaurant-recipe.component";
import { RestaurantOpenCounterComponent } from "./restaurant-open-counter/restaurant-open-counter.component";
import { RestaurantTableManagementComponent } from "./restaurant-table-management/restaurant-table-management.component";
import { RestaurantRoomManagementComponent } from "./restaurant-room-management/restaurant-room-management.component";
import { RestaurantOrderManagementComponent } from "./restaurant-order-management/restaurant-order-management.component";
import { RestaurantCloseCounterComponent } from "./restaurant-close-counter/restaurant-close-counter.component";
import { RestaurantGuestManagementComponent } from "./restaurant-guest-management/restaurant-guest-management.component";
import { RestaurantGuestReviewManagementComponent } from "./restaurant-guest-review-management/restaurant-guest-review-management.component";
import { RestaurantPurchaseManagementComponent } from "./restaurant-purchase-management/restaurant-purchase-management.component";
import { RestaurantTableBookingManagementComponent } from "./restaurant-table-booking-management/restaurant-table-booking-management.component";
import { RestaurantSalesManagementComponent } from "./restaurant-sales-management/restaurant-sales-management.component";
import { RestaurantReportManagementComponent } from "./restaurant-report-management/restaurant-report-management.component";
import { KitchenOrderComponent } from "./kitchen-order/kitchen-order.component";
import { RestaurantBillComponent } from "./restaurant-bill/restaurant-bill.component";
import { RestaurantTaxComponent } from "./restaurant-tax/restaurant-tax.component";
import { RevenuereportsComponent } from './revenuereports/revenuereports.component';
import { OrderreportsComponent } from './orderreports/orderreports.component';


import moment from "moment";

import { BsDatepickerConfig } from "ngx-bootstrap/datepicker";
import {
  Component,
  OnInit,
  TemplateRef,
  QueryList,
  ViewChild,
  ViewChildren,
  ElementRef,
  OnDestroy,
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

import { CalenderBusinessService } from "../services/restaurant/calender-business.service";

import * as jsPDF from "jspdf";
import html2canvas from "html2canvas";
//import * as $ from "jquery";
import * as XLSX from "xlsx";
declare var $: any;
import { Ng4LoadingSpinnerService } from "ng4-loading-spinner";

import { AlertService } from "../../shared/modules/alert/services/alert.service";

export const resturentChildComponents = [
  RestaurentGeneralComponent,
  LeftSideBarComponent,
  RestaurantCalendarBusinessComponent,
  RestaurantPrimaryCategoryFoodComponent,
  RestaurantRecipeComponent,
  RestaurantOpenCounterComponent,
  RestaurantTableManagementComponent,
  RestaurantRoomManagementComponent,
  RestaurantOrderManagementComponent,
  RestaurantCloseCounterComponent,
  RestaurantGuestManagementComponent,
  RestaurantGuestReviewManagementComponent,
  RestaurantPurchaseManagementComponent,
  RestaurantTableBookingManagementComponent,
  RestaurantSalesManagementComponent,
  RestaurantReportManagementComponent,
  KitchenOrderComponent,
  RestaurantBillComponent,
  RestaurantTaxComponent,
  RevenuereportsComponent,
  OrderreportsComponent,
];

@Component({
  selector: "app-ui-restaurant",
  templateUrl: "./restaurant.component.html",
  styles: ["::ng-deep.bs-datepicker { left: 100px; top: 5px; }"],
})
export class RestaurantComponent implements OnInit, OnDestroy {
  title = "easyfullcalendar";
  bsConfigStart: Partial<BsDatepickerConfig>;
  bsConfigEnd: Partial<BsDatepickerConfig>;

  popoverMessage = "Do you want to delete ?";
  popoverTitle = "Record delete confirmation";

  popoverMessage2 = "Do you want to proceed?";
  popoverTitle2 = "";
  confirmText1: string = "Yes";
  cancelText1: string = "No";

  showCalender = true;

  scrollBarContainerHeight: number;
  quickReservationModalRef: BsModalRef;

  private popoverIndex: number;
  public cDetails: any;
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

  public residd = localStorage.getItem("isCurrentRestaurantId");

  //Initialize with the list of symbols

  //Find the input search box
  search = document.getElementById("searchCoin");

  //Find every item inside the dropdown
  items = document.getElementsByClassName("dropdown-item");
  eventsarray = [];

  @ViewChild(PerfectScrollbarComponent)
  componentRef?: PerfectScrollbarComponent;
  @ViewChildren(PopoverDirective) popupref: QueryList<PopoverDirective>;
  @ViewChild("table") table: ElementRef;

  private eventSubscription: Subscription;

  public fdPageView: string = "console";

  revenueStatusReportType: string;

  tariffChartConfigStart: Partial<BsDatepickerConfig>;
  tariffChartConfigEnd: Partial<BsDatepickerConfig>;

  public tcDatePickerStart: any;
  public tcDatePickerEnd: any;

  schedulerHeight: number;

  constructor(
    private dateData: DataEventService,
    private router: Router,
    private routeParamService: RouteParameterService,
    private calenderBusinessService: CalenderBusinessService,
    private modalService: BsModalService,
    private alertSerive: AlertService,
    private spinner: Ng4LoadingSpinnerService
  ) {}

  ngOnInit() {
    this.routeParamService.changeRoute({
      url: this.router.url,
      pageName: "Restaurant",
    });
    this.eventSubscription = this.dateData.currentEvent.subscribe(
      (eventData) => {
        console.log("in reports: ", eventData);
        switch (eventData) {
          case "restaurant_general":
            this.fdPageView = "restaurentGeneral";
            this.revenueStatusReportType = eventData;
            this.showCalender = false;
            break;
          case "restaurant_calendar_business":
            this.fdPageView = "restaurantCalendarBusiness";
            this.revenueStatusReportType = eventData;
            this.showCalender = true;
            //this.calenderDestory();
            break;
          case "restaurant_primary_category_food":
            this.fdPageView = "restaurantPrimaryCategoryFood";
            this.revenueStatusReportType = eventData;
            this.showCalender = false;
            break;
          case "restaurant_recipe":
            this.fdPageView = "restaurentRecipe";
            this.revenueStatusReportType = eventData;
            this.showCalender = false;
            break;
          case "restaurant_open_counter":
            this.fdPageView = "restaurentOpenCounter";
            this.revenueStatusReportType = eventData;
            this.showCalender = false;
            break;
          case "restaurant_table_management":
            this.fdPageView = "restaurentTableManagement";
            this.revenueStatusReportType = eventData;
            this.showCalender = false;
            break;
          case "restaurant_room_management":
            this.fdPageView = "restaurentRoomManagement";
            this.revenueStatusReportType = eventData;
            this.showCalender = false;
            break;
          case "restaurant_order_management":
            this.fdPageView = "restaurentOrderManagement";
            this.revenueStatusReportType = eventData;
            this.showCalender = false;
            break;
          case "restaurant_close_counter":
            this.fdPageView = "restaurentCloseCounter";
            this.revenueStatusReportType = eventData;
            this.showCalender = false;
            break;
          case "restaurant_guest_management":
            this.fdPageView = "restaurentGuestManagement";
            this.revenueStatusReportType = eventData;
            this.showCalender = false;
            break;
          case "restaurant_guest_review_management":
            this.fdPageView = "restaurentGuestReviewManagement";
            this.revenueStatusReportType = eventData;
            this.showCalender = false;
            break;
          case "restaurant_purchase_management":
            this.fdPageView = "restaurentPurchaseManagement";
            this.revenueStatusReportType = eventData;
            this.showCalender = false;
            break;
          case "restaurant_table_booking_management":
            this.fdPageView = "restaurentTableBookingManagement";
            this.revenueStatusReportType = eventData;
            this.showCalender = false;
            break;
          case "restaurant_sales_management":
            this.fdPageView = "restaurentSalesManagement";
            this.revenueStatusReportType = eventData;
            this.showCalender = false;
            break;
          case "restaurant_report_management":
            this.fdPageView = "restaurentReportManagement";
            this.revenueStatusReportType = eventData;
            this.showCalender = false;
            break;
          case "restaurant_kitchen_order":
            this.fdPageView = "restaurantKitchenOrder";
            this.revenueStatusReportType = eventData;
            this.showCalender = false;
            break;
          case "restaurant_bill":
            this.fdPageView = "restaurantbill";
            this.revenueStatusReportType = eventData;
            this.showCalender = false;
            break;
          case "restaurant_tax":
            this.fdPageView = "restaurantTax";
            this.revenueStatusReportType = eventData;
            this.showCalender = false;
            break;
          case "revenue_reports":
            this.fdPageView = "revenuereports";
            this.revenueStatusReportType = eventData;
            this.showCalender = false;
            break;
         
          case "order_reports":
            this.fdPageView = "orderreports";
            this.revenueStatusReportType = eventData;
            this.showCalender = false;
            break;
         
        }
      }
    );
    this.schedulerHeight =
      $(document).height() -
      ($("#main-navbar").outerHeight() +
        $("#sub-navbar").outerHeight() +
        $(".frontdesk-header").outerHeight() +
        $(".fixed-bottom").outerHeight() +
        78);

    var ndate = new Date();
    var cDate = moment(ndate).format("YYYY-MM-DD");
    this.spinner.show();
    this.calenderDetails();
    this.calenderView(cDate, "new");
    this.eventsarray = [];
    // this.calender(this.eventsarray);

    function getWeather(callback) {
      var weather =
        "http://api.openweathermap.org/data/2.5/weather?q=kolkata,india&APPID=09d53586c274e3ab90aa3588c844858e&units=metric";
      jQuery.ajax({
        dataType: "jsonp",
        url: weather,
        success: callback,
      });
    }

    // get data:
    getWeather(function (data) {
      console.log(data);
      // console.log(data.list[0].main.temp);
      // console.log(data.list[0].main.temp_min);
      // console.log(data.list[0].main.temp_max);
    });
  }

  ngOnDestroy() {
    this.eventSubscription.unsubscribe();
  }
  calenderDetails() {
    //

    this.calenderBusinessService
      .getCalenderDetails(this.residd)
      .subscribe((res) => {
        console.log("res: ", res);
        this.cDetails = res["resObject"];
        console.log("cDetails", this.cDetails);
      });
  }
  myFunction() {
    console.log("myFunction click");
    document.getElementById("myDropdown").classList.toggle("show");
  }

  filterFunction() {
    console.log("filterFunction click");
    var input, filter, ul, li, a, i;
    input = document.getElementById("myInput");
    filter = input.value.toUpperCase();
    var div = document.getElementById("myDropdown");
    a = div.getElementsByTagName("a");
    for (i = 0; i < a.length; i++) {
      var txtValue = a[i].textContent || a[i].innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        a[i].style.display = "";
      } else {
        a[i].style.display = "none";
      }
    }
  }
  GetCurrentDisplayedMonth() {
    var date = new Date($("#calendar").fullCalendar("getDate"));
    var month_int = date.getMonth();
    return month_int;
  }
  async calenderView(currentdate, dtype) {
    console.log("dtype: ", dtype);
    this.spinner.show();
    var ndate = new Date();
    var cDate = moment(currentdate).format("YYYY-MM-DD");

    // console.log("cDate: ", cDate);
    console.log("month_int", this.GetCurrentDisplayedMonth());

    $("#calendar").fullCalendar("refetchEvents");
    $("#calendar").fullCalendar("refresh");
    this.calenderDestory();
    await this.calenderBusinessService
      .getCalenderView(this.residd, cDate)
      .subscribe((res) => {
        console.log("res: ", res);

        var cView = res["resObject"];

        var eventsarray = [];
        var dDate = moment(ndate).format("YYYY-MM-");
        console.log("dDate", dDate);

        //  if (dtype == "edit") {
        console.log("kkk");
        // $("#calendar").fullCalendar("removeEventSource", this.eventsarray);
        // $("#calendar").fullCalendar("addEventSource", this.eventsarray);
        // $("#calendar").fullCalendar("refetchEvents");
        // $("#calendar").fullCalendar("refresh");
        for (var k in cView) {
          if (cView[k].amountCollection != "CLOSED") {
            if (cView[k].amountCollection > 0) {
              eventsarray.push({
                //  title: String.fromCharCode(0x20b9) + cView[k].amountCollection,
                title: cView[k].amountCollection,
                start: cView[k].day,
                className: "calenderevent",
              });
            }
            if (
              cView[k].amountCollection == 0 ||
              cView[k].amountCollection < 0
            ) {
              eventsarray.push({
                //  title: String.fromCharCode(0x20b9) + cView[k].amountCollection,
                title: cView[k].amountCollection,
                start: cView[k].day,
                className: "calenderzeroevent",
              });
            }
          } else {
            eventsarray.push({
              title: "CLOSED",
              start: cView[k].day,
              className: "calenderclosedevent",
              //  textColor: "#e41f4c",
            });
          }
        }
        //  } else {
        this.calender(eventsarray, cDate);
        //  }

        //

        console.log("evemtsarray=", typeof eventsarray);
        console.log("evemtsarray 0 ==", eventsarray);
        this.spinner.hide();
        console.log("hide working...");
      });
  }
  calender(eventsarraynew, cDate) {
    console.log("hited", eventsarraynew);
    var self = this;
    //  $("#calendar").fullCalendar("option", "contentHeight", 650);
    $("#calendar").fullCalendar({
      header: {
        left: "prev,next title",
        center: "",
        right: "",
      },
      defaultDate: cDate,
      height: 480,

      views: {
        day: {
          columnFormat: "dddd",
        },
      },
      navLinks: true,
      editable: true,
      eventLimit: true,
      eventColor: "#fff",
      eventRender: function (event, element, view) {
        element.find("span.fc-title").attr("data-toggle", "tooltip");
        element.find("span.fc-title").attr("title", event.title);
      },
      customButtons: {
        prev: {
          text: "prev",
          click: function () {
            $("#calendar").fullCalendar("prev");
            var b = $("#calendar").fullCalendar("getDate");
            console.log(b.format("L"));
            var datef = b.format("L");
            // self.calenderDestory();

            self.calenderView(datef, "edit");
          },
        },
        next: {
          text: "next",
          click: function () {
            console.log("next");
            $("#calendar").fullCalendar("next");
            var b = $("#calendar").fullCalendar("getDate");
            console.log(b.format("L"));
            var datef = b.format("L");

            self.calenderView(datef, "edit");
          },
        },
      },
      events: eventsarraynew,
    });
  }

  calenderDestory() {
    console.log("destory");
    $("#calendar").fullCalendar("destroy");
  }
}
