import { BsDatepickerConfig } from "ngx-bootstrap/datepicker";
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

import { CalenderBusinessService } from "../../services/restaurant/calender-business.service";
import { RouteParameterService } from "../../../shared/route.parameter.service";

import moment from "moment";
import * as jsPDF from "jspdf";
import html2canvas from "html2canvas";
//import * as $ from "jquery";
import * as XLSX from "xlsx";
declare var $: any;
import { Ng4LoadingSpinnerService } from "ng4-loading-spinner";

import { AlertService } from "../../../shared/modules/alert/services/alert.service";

@Component({
  selector: "app-restaurant-calendar-business",
  templateUrl: "./restaurant-calendar-business.component.html",
  styleUrls: ["./restaurant-calendar-business.component.scss"],
})
export class RestaurantCalendarBusinessComponent implements OnInit {
  title = "easyfullcalendar";
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

  constructor(
    private router: Router,
    private calenderBusinessService: CalenderBusinessService,
    private modalService: BsModalService,
    private routeParamService: RouteParameterService,
    private alertSerive: AlertService,
    private spinner: Ng4LoadingSpinnerService
  ) {}

  ngOnInit() {
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

      // eventAfterAllRender: function (view) {
      //   if ($(".label").length == 0) {
      //     $(".fc-myCustomButton-button").before(
      //       '<div class="dropdown"><button class="btn btn-secondary dropdown-toggle" type="button" id="dropdown_coins" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Coin</button><div id="menu" class="dropdown-menu" aria-labelledby="dropdown_coins"><form class="px-4 py-2"><input type="search" class="form-control" id="searchCoin" placeholder="BTC" autofocus="autofocus" (keyup)="itemSearch()"></form><div id="menuItems"></div><div id="empty" class="dropdown-header">No coins found</div></div></div>'
      //     );
      //   }
      // },
    });
  }

  // buildDropDown(values) {
  //   let contents = [];
  //   for (let name of values) {
  //     contents.push(
  //       '<input type="button" class="dropdown-item" type="button" value="' +
  //         name +
  //         '"/>'
  //     );
  //   }
  //   $("#menuItems").append(contents.join(""));

  //   //Hide the row that shows no items were found
  //   $("#empty").hide();
  // }

  // //Capture the event when user types into the search box
  // itemSearch() {
  //   this.filter(this.search.value.trim().toLowerCase());
  // }

  // //For every word entered by the user, check if the symbol starts with that word
  // //If it does show the symbol, else hide it
  // filter(word) {
  //   let length = this.items.length;
  //   let collection = [];
  //   let hidden = 0;
  //   for (let i = 0; i < length; i++) {
  //     if (this.items[i].value.toLowerCase().startsWith(word)) {
  //       $(this.items[i]).show();
  //     } else {
  //       $(this.items[i]).hide();
  //       hidden++;
  //     }
  //   }

  //   //If all items are hidden, show the empty view
  //   if (hidden === length) {
  //     $("#empty").show();
  //   } else {
  //     $("#empty").hide();
  //   }
  //   $("#menuItems").on("click", ".dropdown-item", function () {
  //     $("#dropdown_coins").text($(this)[0].value);
  //     $("#dropdown_coins").dropdown("toggle");
  //   });

  //   // this.buildDropDown(names)
  // }

  //If the user clicks on any item, set the title of the button as the text of the item
  calenderDestory() {
    console.log("destory");
    $("#calendar").fullCalendar("destroy");
  }
}
