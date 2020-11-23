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

import { KitchenOrderService } from "../../services/restaurant/kitchen-order.service";
import { RouteParameterService } from "../../../shared/route.parameter.service";
import { IKitchenOrder } from "./kitchenOrder";
import moment from "moment";
import * as jsPDF from "jspdf";
import html2canvas from "html2canvas";
import * as $AB from "jquery";
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
  selector: "app-kitchen-order",
  templateUrl: "./kitchen-order.component.html",
  styleUrls: ["./kitchen-order.component.scss"],
})
export class KitchenOrderComponent implements OnInit {

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
     public rawTileList: any;
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

  scrollBarContainerHeight: number;
  quickReservationModalRef: BsModalRef;

  public kitchenOrderList: any;
  public kitchenOrderTile: IKitchenOrder[];
  public kitchenOrderPrint: IKitchenOrder[];
  private popoverIndex: number;
  private kitchenOrderListlength: any;
  private kitchenOrderListlength1: any;

  popoverMessage = "Do you want to delete ?";
  popoverTitle = "Record delete confirmation";

  popoverMessage2 = "Do you want to proceed?";
  popoverTitle2 = "";
  confirmText1: string = "Yes";
  cancelText1: string = "No";

  restaurantTypeMaster: any;
  checked: any;

  kitchenOrder = {
    restaurant: "",
    period: "",
    status: "",
    view: "",
    limitValue: "10",
  };
  itemarr = [];
  itemsavearr = [];
  printItemarr = [];
  orderDetails = {
    noOfItem: "",
    itemType: "",
    descripition: "",
  };
  kitchenOderDetails: any;
  kitchenOderSaveData: any;
  public now: number;
  cancelClicked = true;

  orderList: any;
  itemList: any;
  ticketData: any;
  isVisiblePrint = false;
  isVisibleTile = false;
  isVisibleGeneral = true;

  kitchenOrderTileList: any;

  listviewSaveData: any;
  tileviewSavedata: any;
  listviewdata: any;
  kotstatusdata: any;
  deleteres: any;
  public allBookingCkbox: boolean;

  @ViewChild(PerfectScrollbarComponent)
  componentRef?: PerfectScrollbarComponent;
  @ViewChildren(PopoverDirective) popupref: QueryList<PopoverDirective>;
  @ViewChild("table") table: ElementRef;

  constructor(
    private router: Router,
    private kitchenOrderService: KitchenOrderService,
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
    this.kitchenOrderPrint = [];
    this.restaurantTypeMasterDropdown();
    this.disableConfirmUnconfirm = true;
    this.searchRequest = true;
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

    setInterval(() => {
      //  this.kitchenOrderPrint = [];
      console.log("timmer", this.kitchenOrder.status);
      if (this.kitchenOrder.view == "gridView") {
        console.log("if hit");
        this.restaurantTypeMasterDropdown();

        this.kitchenOrder.restaurant = "2";
        this.kitchenOrder.period = "all";
        this.kitchenOrder.status = "U";
        // this.kitchenOrder.limitValue = "50";

        this.kitchenListRefresh();
      }
    }, 60000);
  }
  kitchenListRefresh() {
    this.kitchenOrderService
      .getKitchenOrder(this.kitchenOrder)
      .subscribe((res) => {
        console.log("res: ", res);
        this.tileviewSavedata = res;

        if (this.tileviewSavedata.status == "Success") {
          this.kitchenOrderTileList = res["resObject"];
          var abc = res["resObject"];
          var assoArr = {};
          for (var j in this.kitchenOrderTileList) {
            var itemarr = [];
            assoArr = this.kitchenOrderTileList[j].categoryItemDtls;
            for (var p in assoArr) {
              itemarr.push(assoArr[p]);
            }
            this.kitchenOrderTileList[j].orderItemDtls = itemarr;
          }

          console.log("kitchenOrderTileList", this.kitchenOrderTileList);
        } else {
          this.alertSerive.create(
            "", //title
            "danger", //type
            5000, // time
            "something went wrong!" //body
          );
        }
      });
  }

  restaurantTypeMasterDropdown() {
    this.kitchenOrderService.getRestaurantType().subscribe((res) => {
      console.log("res: ", res);
      this.restaurantTypeMaster = res["resObject"];
      console.log("restaurantTypeMaster", this.restaurantTypeMaster);
    });
  }
  kitchenOrderrSave() {
    console.log("kitchenOrderrSave");

    if (this.kitchenOrder.view == "listView") {
      if (this.kitchenOrder.restaurant == "") {
        this.alertSerive.create(
          "", //title
          "danger", //type
          20000, // time
          "Please Select a Restaurant!" //body
        );
      } else if (this.kitchenOrder.period == "") {
        this.alertSerive.create(
          "", //title
          "danger", //type
          20000, // time
          "Please Select Time Period!" //body
        );
      } else if (this.kitchenOrder.status == "") {
        this.alertSerive.create(
          "", //title
          "danger", //type
          20000, // time
          "Please Select Status !" //body
        );
      } else {
        this.spinner.show();
        this.kitchenOrderService
          .getKitchenOrder(this.kitchenOrder)
          .subscribe((res) => {
            console.log("res: ", res);
            this.listviewSaveData = res;
            if (this.listviewSaveData.status == "Success") {
              this.rawBookingList = res["resObject"];
              if(this.rawBookingList != undefined || this.rawBookingList != null){
                this.kitchenOrderList = [...this.rawBookingList];
                this.paginateBookingList = this.kitchenOrderList.slice(0, this.pageItems);
              }
              else{
                this.kitchenOrderList =res["resObject"];
              }
              this.currentPage = 1;
              this.searchRequest = false;
              if (this.paginateBookingList.length > 5) {
                this.kitchenOrderListlength = this.paginateBookingList.length - 2;
              } else {
                this.kitchenOrderListlength = 5;
              }
              this.spinner.hide();
              console.log("kitchenOrderList", this.kitchenOrderList);
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
    } else {
      this.spinner.show();
      this.kitchenOrderService
        .getKitchenOrder(this.kitchenOrder)
        .subscribe((res) => {
          console.log("res: ", res);
          this.tileviewSavedata = res;
          if (this.tileviewSavedata.status == "Success") {
            this.rawTileList = res["resObject"];
            this.kitchenOrderTileList = res["resObject"];
            var abc = res["resObject"];
            var assoArr = {};
            for (var j in this.kitchenOrderTileList) {
              var itemarr = [];
              assoArr = this.kitchenOrderTileList[j].categoryItemDtls;
              for (var p in assoArr) {
                itemarr.push(assoArr[p]);
              }
              this.kitchenOrderTileList[j].orderItemDtls = itemarr;
            }
            this.spinner.hide();

            console.log("kitchenOrderTileList", this.kitchenOrderTileList);
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
    this.kitchenOrderList = this.rawBookingList.filter((bookingItem: any) =>
    bookingItem.period && bookingItem.period.toLowerCase().includes(filterText.toLowerCase())
        || bookingItem.sourceName && bookingItem.sourceName.toLowerCase().includes(filterText.toLowerCase())
        || bookingItem.attendentName && bookingItem.attendentName.toLowerCase().includes(filterText.toLowerCase())
        || bookingItem.tableNo && bookingItem.tableNo.toLowerCase().includes(filterText.toLowerCase())
        || bookingItem.orderNo && bookingItem.orderNo.toLowerCase().includes(filterText.toLowerCase())
        || bookingItem.comment && bookingItem.comment.toLowerCase().includes(filterText.toLowerCase())
        || bookingItem.ticketNo && bookingItem.ticketNo.toLowerCase().includes(filterText.toLowerCase())
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
  changeSearchTileFilter(filterText: string) {
    this.kitchenOrderTileList = this.rawTileList.filter((bookingItem: any) =>
    bookingItem.tableNo && bookingItem.tableNo.toLowerCase().includes(filterText.toLowerCase())
        || bookingItem.orderNumber && bookingItem.orderNumber.toLowerCase().includes(filterText.toLowerCase())
        || bookingItem.comment && bookingItem.comment.toLowerCase().includes(filterText.toLowerCase())
        || bookingItem.ticketNo && bookingItem.ticketNo.toLowerCase().includes(filterText.toLowerCase())
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
    this.paginateBookingList = this.kitchenOrderList == null ? [] : this.kitchenOrderList.slice(startItem, endItem);
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
  selectBookingItemCKBStatus(bookingItem: any) {
    var self = this;
    
  if (bookingItem == 'all') {
    for (let i = 0; i < this.kitchenOrderList.length; i++) {
      this.kitchenOrderList[i].checked = this.allBookingCkbox;
      self.kitchenOrderPrint = self.kitchenOrderList;
   }
  }
  else {
    this.allBookingCkbox = this.kitchenOrderList.every((bookingItem: any) => bookingItem.checked);
    var values = new Array();
    for(var k in this.kitchenOrderList){
      
      if(this.kitchenOrderList[k].checked == true){
        values.push(this.kitchenOrderList[k]);
      }
    }
    self.kitchenOrderPrint = values;
    console.log("values",values);
    }
    console.log('on check', _.some(this.kitchenOrderList, 'checked'));
    this.disableConfirmUnconfirm = !_.some(this.kitchenOrderList, 'checked'); 
  }
  selection(item) {
    var self = this;
    $("input[name='case[]']").click(function () {
      var values = new Array();
      $.each($("input[name='case[]']:checked"), function () {
        var data = $(this).parents("tr:eq(0)");
        values.push(item);
      });
      self.kitchenOrderPrint = values;
      console.log(values);
    });
  }
  viewKitchen(item) {
    this.spinner.show();
    console.log("item==", item);
    this.ticketData = item.ticketNo;

    this.kitchenOrderService
      .getOrderItemDetailsBykotid(item.ticketNo)
      .subscribe((res) => {
        console.log("res: ", res);
        this.listviewdata = res;
        if (this.listviewdata.status == "Success") {
          this.itemarr = [];
          this.orderList = res;
          var resdata = this.orderList.resObject;
          var assoArr = {};

          for (var i = 0; i < resdata.length; i++) {
            var infoarr = [];
            // this.orderDetails = resdata[i];
            var key =
              resdata[i]["itemDescription"] + "_" + resdata[i]["itemType"];

            var tempArr = [];
            if (!assoArr[key]) {
              tempArr.push({
                noOfItem: 1,
                itemType: resdata[i]["itemType"],
                descripition: resdata[i]["itemDescription"],
                itemOrderId: resdata[i]["itemOrderId"],
              });

              assoArr[key] = tempArr[0];
            } else {
              var arr = assoArr[key];
              arr.noOfItem++;
              assoArr[key] = arr;
            }
          }
          for (var j in assoArr) {
            this.itemarr.push(assoArr[j]);
          }
          this.spinner.hide();
          (<any>$("#myMessageModal")).modal("show");
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
  kotStatus(item, setStatus, getStatus) {
    console.log(item);
    this.spinner.show();
    this.kitchenOrderService
      .setKotStatus(item, setStatus, getStatus)
      .subscribe((res) => {
        console.log("res==", res);
        this.kotstatusdata = res;
        if (this.kotstatusdata.status == "Success") {
          this.spinner.hide();
          this.alertSerive.create(
            "", //title
            "success", //type
            20000, // time
            "Status Change Successfully!" //body
          );
          this.kitchenOrderrSave();
          this.ngOnInit();
          this.kitchenOrder = {
            restaurant: "",
            period: "",
            status: "",
            view: "",
            limitValue: "10",
          };
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
  kitchenView(ev) {
    var kView = ev.target.value;
    this.kitchenOrderPrint = [];
    console.log("kview===", kView);
    if (kView == "gridView") {
      this.kitchenOrder.period = "all";
      this.isVisiblePrint = false;
      this.isVisibleTile = true;
      this.isVisibleGeneral = false;
    } else {
      this.isVisiblePrint = true;
      this.isVisibleTile = false;
      this.kitchenOrder.period = "";
      this.isVisibleGeneral = false;
     
    }
  }
  kotPrint() {
    var self = this;
    if (
      this.kitchenOrderPrint != undefined &&
      this.kitchenOrderPrint.length > 0
    ) {
      setTimeout(function () {
        var divContents = $("#print-table").html();
        console.log("print kot table................", divContents);

        let popupWin = window.open(
          "",
          "_blank",
          "top=0,left=0,height=100%,width=auto"
        );
        popupWin.document.open();
        popupWin.document.write(
          `
    <html>
      <head>
        <title>Print tab</title>
      </head>
  <body onload="window.print();window.close()">` +
            divContents +
            `</body>
    </html>`
        );
        popupWin.document.close();
      }, 2000);
    } else {
      this.alertSerive.create(
        "", //title
        "danger", //type
        5000, // time
        "Please Fetch and select any table row first!" //body
      );
    }
  }
  tilePrint(itemdetails) {
    for (var k in itemdetails) {
      for (var j in itemdetails[k]) {
        this.itemsavearr.push(itemdetails[k][j]);
      }
    }
    console.log("pppppppppp", this.itemsavearr);
    setTimeout(function () {
      var divContents = $("#itemprinttable").html();
      console.log("print kot table................", divContents);

      let popupWin = window.open(
        "",
        "_blank",
        "top=0,left=0,height=100%,width=auto"
      );
      popupWin.document.open();
      popupWin.document.write(
        `
      <html>
        <head>
          <title>Print tab</title>
        </head>
    <body onload="window.print();window.close()">` +
          divContents +
          `</body>
      </html>`
      );
      popupWin.document.close();
    }, 2000);
  }
  deleteTicket(deleteid, type) {
    this.spinner.show();
    this.kitchenOrderService
      .deleteTicketItem(deleteid, type)
      .subscribe((res) => {
        console.log("res: ", res);
        this.deleteres = res;
        if (this.deleteres.status == "Success") {
          this.spinner.hide();
          if (type == "ticket") {
            this.kitchenOrderrSave();
          } else {
            (<any>$("#myMessageModal")).modal("hide");
          }

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
}
