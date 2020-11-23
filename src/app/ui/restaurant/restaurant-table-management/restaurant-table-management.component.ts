import { BsDatepickerConfig } from "ngx-bootstrap/datepicker";
import {
  Component,
  OnInit,
  TemplateRef,
  QueryList,
  ViewChild,
  ViewChildren,
  ElementRef,
  Input,
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

import { TableManagementService } from "../../services/restaurant/table-management.service";
import { RouteParameterService } from "../../../shared/route.parameter.service";
import moment from "moment";
import * as jsPDF from "jspdf";
import html2canvas from "html2canvas";
import * as $ from "jquery";
import * as XLSX from "xlsx";
import { ITable } from "./table";
import { AlertService } from "../../../shared/modules/alert/services/alert.service";
import { DataEventService } from "../../../shared/data.event.service";
import { Ng4LoadingSpinnerService } from "ng4-loading-spinner";
import { ConfigService } from "../../../config.service";

@Component({
  selector: "app-restaurant-table-management",
  templateUrl: "./restaurant-table-management.component.html",
  styleUrls: ["./restaurant-table-management.component.scss"],
})
export class RestaurantTableManagementComponent implements OnInit {
  bsConfigStart: Partial<BsDatepickerConfig>;
  bsConfigEnd: Partial<BsDatepickerConfig>;

  // scrollBarContainerHeight: number;
  quickReservationModalRef: BsModalRef;

  popoverMessage = "Do you want to delete ?";
  popoverTitle = "Record delete confirmation";

  popoverMessage1 = "Do you want to proceed?";
  popoverTitle1 = "";
  confirm = "Order";
  delete = "Delete";

  popoverMessage2 = "Do you want to proceed?";
  popoverTitle2 = "";
  confirmText1: string = "Yes";
  cancelText1: string = "No";

  confirmText3: string = "Room";
  cancelText3: string = "Parcel";

  public tableList: ITable[];
  private popoverIndex: number;

  public availabletable: number = 0;
  public reservetable: number = 0;
  public runningtable: number = 0;
  public totaltable: number = 0;
  public tableDetails: any;

  public residd = localStorage.getItem("isCurrentRestaurantId");

  @ViewChild(PerfectScrollbarComponent)
  componentRef?: PerfectScrollbarComponent;
  public config: PerfectScrollbarConfigInterface = {};
  scrollBarContainerHeight: number = 0;
  @ViewChildren(PopoverDirective) popupref: QueryList<PopoverDirective>;
  @ViewChild("table") table: ElementRef;

  tableData = {
    status: "",
    tableid: "",
    setStatus: "",
    restaurantId: "",
  };

  infoSaveData: any;
  statusSaveData: any;
  tableSaveData: any;
  restaurantId = localStorage.getItem("isCurrentRestaurantId");
  public now: number;
  cancelClicked = true;

  @Input() options: object;
  // @Input() cancelText: string;
  // @Input() confirmText: string;

  confirmText: string = "Order";
  cancelText: string = "Delete";
  cancelText2: string = "cancel";

  // '<div style="display: block">';
  // ' <div class="fond">';
  // '<div class="boxAdd">';
  // '<div class="card card-info" style="margin: 0 !important;">';

  // ' <div class="card-header">';
  // '<h3 class="card-title"><i class="fas fa-edit"></i> {{options.popoverTitle}}:</h3></div>';
  // ' <div class="card-body">';
  // "{{options.popoverMessage}}";
  // "</div>";
  // '<div class="card-footer">';
  // '<button type="submit" class="btn btn-primary" (click)="options.onConfirm({clickEvent: $event})">Confirm</button>';
  // '<button  id="cancel" type="button" (click)="options.onCancel({clickEvent: $event})" class="btn btn-danger float-right">Cancel</button>';
  // "  </div> ";
  // "</div> ";
  // " </div>";
  // " </div> ";
  // "  </div>";

  constructor(
    private router: Router,
    private tableManagementService: TableManagementService,
    private modalService: BsModalService,
    private routeParamService: RouteParameterService,
    private alertSerive: AlertService,
    private _des: DataEventService,
    private spinner: Ng4LoadingSpinnerService,
    public configService: ConfigService
  ) {}

  ngOnInit() {
    let tablrRefreshTime = this.configService.getConfig().tableRefresh;
    console.log("tablrRefreshTime",tablrRefreshTime);
    this.spinner.show();
    this.getTable();
    this.now = Date.now();
    setInterval(() => {
      this.now = Date.now();
    }, 1000);
    setInterval(() => {
      this.getTable();
    }, tablrRefreshTime);
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
  getTable(){
    this.tableManagementService.getTableList().subscribe((res) => {
      console.log("res: ", res);
      this.tableList = res["resObject"].tableDetails;
      console.log("tableList", this.tableList);
      this.tableDetails = res["resObject"];
      this.spinner.hide();
      this.totaltable = this.tableList.length;
      for (var k in this.tableList) {
        if (this.tableList[k].status == "A") {
          this.availabletable += 1;
        }
        if (this.tableList[k].status == "R") {
          this.reservetable += 1;
        }
        if (this.tableList[k].status == "C") {
          this.runningtable += 1;
        }
      }
    });
  }

  order(event, val, item) {
    console.log("orderrrr", val);
    // Trigger action when the contexmenu is about to be shown
    //  $(document).bind("contextmenu", function (event) {
    // Avoid the real one
    event.preventDefault();
    console.log("orderrrr event");
    // Show contextmenu
    $(".custom-menu-table")
      .finish()
      .toggle(100)
      // In the right position (the mouse)
      .css({
        top: event.pageY + "px",
        left: event.pageX + "px",
      });
    //  });
    // If the document is clicked somewhere
    $(document).bind("mousedown", function (e) {
      // If the clicked element is not the menu
      if (!($(e.target).parents(".custom-menu-table").length > 0)) {
        // Hide it
        $(".custom-menu-table").hide(100);
      }
    });
    var self = this;
    // If the menu element is clicked
    $(".custom-menu-table li").click(function () {
      // This is the triggered action name
      if (val == "order") {
        switch ($(this).attr("data-action")) {
          // A case for each action. Your actions here

          case "order":
            self.orderpage(item);
            break;
          case "delete":
            self.deleteTable(item.tableId);
            break;
          case "room":
            self.roomPage();
            break;
          case "parcel":
            self.parcelPage();
            break;
        }
      } else if (val == "current") {
        switch ($(this).attr("data-action")) {
          // A case for each action. Your actions here

          case "order":
            self.orderpage(item);
            break;
          case "delete":
            self.deleteReserved("current");
            break;
          case "room":
            self.roomPage();
            break;
          case "parcel":
            self.parcelPage();
            break;
        }
      } else if (val == "reserved") {
        switch ($(this).attr("data-action")) {
          // A case for each action. Your actions here

          case "order":
            self.orderpage(item);
            break;
          case "delete":
            self.deleteReserved("reserved");
            break;
          case "room":
            self.roomPage();
            break;
          case "parcel":
            self.parcelPage();
            break;
        }
      }

      // Hide it AFTER the action was triggered
      $(".custom-menu-table").hide(100);
    });
  }
  orderreserve(event, val, item) {
    console.log("orderrrr", val);
    // Trigger action when the contexmenu is about to be shown
    //  $(document).bind("contextmenu", function (event) {
    // Avoid the real one
    event.preventDefault();
    console.log("orderrrr event");
    // Show contextmenu
    $(".custom-menu-reserve")
      .finish()
      .toggle(100)
      // In the right position (the mouse)
      .css({
        top: event.pageY + "px",
        left: event.pageX + "px",
      });
    //  });
    // If the document is clicked somewhere
    $(document).bind("mousedown", function (e) {
      // If the clicked element is not the menu
      if (!($(e.target).parents(".custom-menu-reserve").length > 0)) {
        // Hide it
        $(".custom-menu-reserve").hide(100);
      }
    });
    var self = this;
    // If the menu element is clicked
    $(".custom-menu-reserve li").click(function () {
      // This is the triggered action name
      switch ($(this).attr("data-action")) {
        // A case for each action. Your actions here
        case "order":
          self.orderpage(item);
          break;
      }

      // Hide it AFTER the action was triggered
      $(".custom-menu-reserve").hide(100);
    });
  }
  tableContextMenu(event, val) {
    console.log("tableContextMenu", val);

    // Trigger action when the contexmenu is about to be shown
    //  $(document).bind("contextmenu", function (event) {
    // Avoid the real one
    console.log("eventttt===", event.target);
    event.preventDefault();

    // Show contextmenu
    $(".custom-menu")
      .finish()
      .toggle(100)
      // In the right position (the mouse)
      .css({
        top: event.pageY + "px",
        left: event.pageX + "px",
      });
    // });
    // If the document is clicked somewhere
    $(document).bind("mousedown", function (e) {
      // If the clicked element is not the menu
      if (!($(e.target).parents(".custom-menu").length > 0)) {
        // Hide it
        $(".custom-menu").hide(100);
      }
    });
    var self = this;
    // If the menu element is clicked
    $(".custom-menu li").click(function () {
      // This is the triggered action name
      switch ($(this).attr("data-action")) {
        // A case for each action. Your actions here
        case "order":
          self.ordertable();
          break;
        case "delete":
          self.deleteReserved("table");
          break;
        case "room":
          self.roomPage();
          break;
        case "parcel":
          self.parcelPage();
          break;
      }

      // Hide it AFTER the action was triggered
      $(".custom-menu").hide(100);
    });
  }

  orderpage(data) {
    console.log("data", data);
    this.tableData.status = data.status;
    this.tableData.tableid = data.tableId;
    this.tableData["tableBookingId"] = data.tableBookingId;
    if (data.status == "C") {
      this.spinner.show();
      this.tableManagementService
        .getTableInformation(this.tableData.tableid)
        .subscribe((res) => {
          console.log("tableData", this.tableData);
          this.infoSaveData = res;
          if (this.infoSaveData.status == "Success") {
            this.spinner.hide();
            console.log("add successfull", this.infoSaveData);
            console.log("hhpp==", this.infoSaveData.resObject.length);
            if (this.infoSaveData.resObject.length > 0) {
              //  this.alerts.setMessage('Recipe Added successfully!','success');
              localStorage.setItem("roomTableDetails", JSON.stringify(data));
              localStorage.setItem(
                "currentTableDetails",
                this.infoSaveData.resObject[0].invoiceId
              );

              this._des.newEvent("restaurant_room_management");
            } else {
              this.spinner.hide();
              // this.ngOnInit();
              this.alertSerive.create(
                "", //title
                "danger", //type
                5000, // time
                "something went wrong!" //body
              );
            }
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
    } else {
      var ddate = new Date();
      var cdate = moment().format("YYYY-MM-DD");
      console.log("cdate", cdate);
      var resdata: any;
      this.tableData.restaurantId = this.restaurantId;
      this.spinner.show();
      this.tableManagementService
        .checkCounterStatus(this.residd, cdate)
        .subscribe((resd) => {
          console.log("resd", resd);
          resdata = resd;
          if (resdata.status != "Fail") {
            this.tableData.setStatus = "C";
            this.tableManagementService
              .addStatus(this.tableData)
              .subscribe((res) => {
                console.log("tableData", this.tableData);
                this.statusSaveData = res;
                if (this.statusSaveData.status == "Success") {
                  console.log("add successfull", this.statusSaveData);
                  data["tableBookingId"] = this.statusSaveData.resObject;
                  //  this.alerts.setMessage('Recipe Added successfully!','success');
                  localStorage.setItem(
                    "roomTableDetails",
                    JSON.stringify(data)
                  );
                  localStorage.setItem("currentTableDetails", "0");
                  this.spinner.hide();
                  this._des.newEvent("restaurant_room_management");
                }
              });
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
  addtable() {
    this.tableManagementService.addTable(this.restaurantId).subscribe((res) => {
      console.log("tableData", this.tableData);
      this.tableSaveData = res;
      if (this.tableSaveData.status == "Success") {
        console.log("add successfull", this.statusSaveData);
        //  this.alerts.setMessage('Recipe Added successfully!','success');

        this.alertSerive.create(
          "", //title
          "success", //type
          5000, // time
          "Information Saved Successfully!" //body
        );
        this.ngOnInit();
        this.availabletable = 0;
        this.reservetable = 0;
        this.runningtable = 0;
        this.totaltable = 0;
      }
    });
  }
  ordertable() {
    this.alertSerive.create(
      "", //title
      "success", //type
      5000, // time
      "Please select a table!" //body
    );
  }
  deleteReserved(val) {
    if (val == "current") {
      this.alertSerive.create(
        "", //title
        "success", //type
        5000, // time
        "Running table can't be deleted!" //body
      );
    } else if (val == "reserved") {
      this.alertSerive.create(
        "", //title
        "success", //type
        5000, // time
        "Reserved table can't be deleted!" //body
      );
    } else {
      this.alertSerive.create(
        "", //title
        "success", //type
        5000, // time
        "Please select a available table!" //body
      );
    }
  }
  deleteTable(tableId) {
    this.tableManagementService.deleteTableinfo(tableId).subscribe((res) => {
      console.log("res: ", res);

      this.ngOnInit();
      this.availabletable = 0;
      this.reservetable = 0;
      this.runningtable = 0;
      this.totaltable = 0;
      this.alertSerive.create(
        "", //title
        "danger", //type
        5000, // time
        "Information deleted successfully!" //body
      );
    });
  }
  onContextMenu(ev) {
    $(".btnclk").click();
    return false;
  }

  roomPage() {
    localStorage.setItem("orderpagename", "room");
    this._des.newEvent("restaurant_order_management");
  }
  parcelPage() {
    localStorage.setItem("orderpagename", "parcel");
    this._des.newEvent("restaurant_order_management");
  }
}
