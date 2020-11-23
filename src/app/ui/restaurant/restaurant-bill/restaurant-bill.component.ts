import { BsDatepickerConfig } from "ngx-bootstrap/datepicker";
import {
  Component,
  OnInit,
  TemplateRef,
  QueryList,
  ViewChild,
  ViewChildren,
  ElementRef
} from "@angular/core";
import { DayPilot, DayPilotModalComponent } from "daypilot-pro-angular";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from "@angular/forms";
import { BsModalRef } from "ngx-bootstrap/modal/bs-modal-ref.service";
import { BsModalService } from "ngx-bootstrap/modal";

import {
  PerfectScrollbarConfigInterface,
  PerfectScrollbarComponent
} from "ngx-perfect-scrollbar";
import { PopoverDirective } from "ngx-bootstrap/popover";
import { Router } from "@angular/router";

import { RoomManagementService } from "../../services/restaurant/room-management.service";
import { RouteParameterService } from "../../../shared/route.parameter.service";
import moment from "moment";
import * as jsPDF from "jspdf";
import html2canvas from "html2canvas";
import * as $AB from "jquery";
import * as XLSX from "xlsx";

import { AlertService } from "../../../shared/modules/alert/services/alert.service";
import { DataEventService } from "../../../shared/data.event.service";
import { AstMemoryEfficientTransformer } from "@angular/compiler";
@Component({
  selector: "app-restaurant-bill",
  templateUrl: "./restaurant-bill.component.html",
  styleUrls: ["./restaurant-bill.component.scss"]
})
export class RestaurantBillComponent implements OnInit {
  restaurantBillDetails: any;
  itemarr = [];
  totalQuantity: any;

  constructor(
    private router: Router,
    private roomManagementService: RoomManagementService,
    private modalService: BsModalService,
    private routeParamService: RouteParameterService,
    private alertSerive: AlertService,
    private _des: DataEventService
  ) {}

  ngOnInit() {
    var res = localStorage.getItem("restaurantBillDetails");

    console.log(
      "restaurthis.restaurantBillDetailsantBillDetails",
      this.restaurantBillDetails
    );

    var resdata = this.restaurantBillDetails.orderDetails;
    console.log("resdata", resdata);
    console.log("resdata1", resdata.length);
    var assoArr = {};

    for (var i = 0; i < resdata.length; i++) {
      var infoarr = [];
      var key = resdata[i]["itemId"] + "_" + resdata[i]["kotseqNo"];

      var tempArr = [];
      if (!assoArr[key]) {
        console.log("ifff");
        tempArr.push({
          itemId: resdata[i]["itemId"],
          itemPrice: resdata[i]["itemPrice"],
          noOfItem: 1,
          itemName: resdata[i]["itemName"],
          itemFixedPrice: resdata[i]["itemPrice"]
        });

        assoArr[key] = tempArr[0];
      } else {
        console.log("else");
        var arr = assoArr[key];
        arr.noOfItem++;
        arr.itemFixedQnty++;
        arr.itemPrice = arr.itemPrice * arr.noOfItem;
        assoArr[key] = arr;
      }
    }
    console.log("assoArr", assoArr);
    for (var j in assoArr) {
      this.itemarr.push(assoArr[j]);
      this.totalQuantity += assoArr[j].noOfItem;
    }
    console.log("itemarrr-===-", this.itemarr);
  }
}
