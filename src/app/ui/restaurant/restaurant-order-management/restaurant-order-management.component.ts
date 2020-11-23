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

import { OrderManagementService } from "../../services/restaurant/order-management.service";
import { RouteParameterService } from "../../../shared/route.parameter.service";
import { IcateGory, IItem, IRoom } from "./orderList";
import moment from "moment";
import * as jsPDF from "jspdf";
import html2canvas from "html2canvas";
import * as $AB from "jquery";
import * as XLSX from "xlsx";
import { Ng4LoadingSpinnerService } from "ng4-loading-spinner";

import { AlertService } from "../../../shared/modules/alert/services/alert.service";
import { DataEventService } from "../../../shared/data.event.service";
//import {CdkPortal,DomPortalHost} from '@angular/cdk/portal';

@Component({
  selector: "app-restaurant-order-management",
  templateUrl: "./restaurant-order-management.component.html",
  styleUrls: ["./restaurant-order-management.component.scss"],
})
export class RestaurantOrderManagementComponent implements OnInit {
  bsConfigStart: Partial<BsDatepickerConfig>;
  bsConfigEnd: Partial<BsDatepickerConfig>;

  scrollBarContainerHeight: number;
  quickReservationModalRef: BsModalRef;

  public categoryList: IcateGory[];
  public itemList: IItem[];
  public roomList: IRoom[];
  categoryCount: any;
  itemCount: any;
  private popoverIndex: number;
  categoryFoodType = { categoryDescription: "" };
  categorySaveData: any;
  itemarr = [];
  itemsavearr = [];
  itemDrinkarr = [];
  itemvegtaxarr = [];
  itemDrinktaxarr = [];
  itemindex: any;
  itemidarr = [];
  taxList: any;
  paymodeList: any;
  totalPrice: number;
  sudototalPrice: number;
  textAmount: number;
  grossAmount: number;
  newrowdata: number;
  newtax: number;
  tableDetails: any;
  disvalues: number;
  tDetails: any;
  psudoitemarr = {
    orderId: "",
    itemId: "",
    noOfItem: "",
    itemPrice: "",
    changed: "",
    kotseqNo: "",
  };

  tableOrderNo: any;
  pageTitle = "";
  tabtitle = "";
  tabno = "";
  public residd = localStorage.getItem("isCurrentRestaurantId");

  roomOrderData = {
    counterId: "",
    invoiceId: "",
    persons: "",
    waiter: "",
    isDiscount: "N",
    restaurantId: this.residd,
    roomId: "",
    parcelId: "",
    txnDate: "",
    paymentModeId: "",
    netAmount: "",
    discountType: "",
    discountAmount: "",
    taxAmount: "",
    taxId: "",
    typeValue: "",
    totalAmount: "",
    currencyId: "",
    orderDetails: [],
    comment: "",
  };
  discountAmount: any;
  discountradiotype: any;
  roomSaveData: any;
  roomModaldata: any;
  tableInvoiceId: any;
  associativeArr = {};
  public now: number;

  popoverMessage2 = "Do you want to proceed?";
  popoverTitle2 = "";
  confirmText1: string = "Yes";
  cancelText1: string = "No";

  cancelClicked = true;
  rescgst = 0;
  ressgst = 0;
  cgstAmount = 0;
  sgstAmount = 0;

  liquidQnty = 0;
  iQnty = 0;
  liquidNetAmount = 0;
  iNetAmount = 0;
  lCgst = 0;
  lSgst = 0;
  lCgstAmount = 0;
  lSgstAmount = 0;
  lTaxAmount = 0;
  resTaxAmount = 0;

  ival = 0;
  jval = 0;
  isVisibleLiquid = false;
  isVisibleLiquidTable = false;

  isVisibleRoom = true;
  isVisibleParcel = false;

  isActiveRoom = true;
  isActiveParcel = false;

  categoryMstList: any;

  @ViewChild(PerfectScrollbarComponent)
  componentRef?: PerfectScrollbarComponent;
  @ViewChildren(PopoverDirective) popupref: QueryList<PopoverDirective>;
  @ViewChild("table") table: ElementRef;
  savedTableTransactionData: any;
  restaurantBillDetails: any;

  constructor(
    private router: Router,
    private orderManagementService: OrderManagementService,
    private modalService: BsModalService,
    private routeParamService: RouteParameterService,
    private alertSerive: AlertService,
    private _des: DataEventService,
    private spinner: Ng4LoadingSpinnerService
  ) {}

  ngOnInit() {
    //  this.tableDetails = localStorage.getItem("roomTableDetails");
    // this.tableInvoiceId = localStorage.getItem("currentTableDetails");
    // this.tDetails = JSON.parse(this.tableDetails);
    // console.log("tableDetails", this.tableDetails);
    var orderpagedetails = localStorage.getItem("orderpagename");
    $("#distamnt").hide();
    $("#distper").hide();
    $("#typeamt").hide();
    $("#typeper").hide();
    $("#discounttype").hide();
    this.roomOrderData.discountType = "Amount";
    this.discountradiotype = $("input[name='taxtype']:checked")
      .attr("checked", "checked")
      .val();
    this.itemidarr = [];
    // this.itemsavearr = [];
    // this.itemDrinkarr = [];
    // this.itemvegtaxarr = [];
    // this.itemDrinktaxarr = [];
    // this.liquidQnty = 0;
    // this.resTaxAmount = 0;
    // this.lTaxAmount = 0;
    // this.iQnty = 0;
    // this.iNetAmount = 0;
    // this.liquidNetAmount = 0;
    if (orderpagedetails != undefined) {
      console.log("undefined===", orderpagedetails);
      if (orderpagedetails == "room") {
        console.log("room===", orderpagedetails);
        $(".parcelbtn").hide();
        $(".roombtn").show();
        this.pageTitle = "Room Management";
        this.tabtitle = "Room";

        this.isVisibleRoom = true;
        this.isVisibleParcel = false;

        this.isActiveRoom = true;
        this.isActiveParcel = false;
      } else {
        console.log("parcel===", orderpagedetails);
        $(".roombtn").hide();
        $(".parcelbtn").show();

        this.isVisibleRoom = false;
        this.isVisibleParcel = true;

        this.isActiveRoom = false;
        this.isActiveParcel = true;

        this.pageTitle = "Parcel Management";
        this.tabtitle = "Parcel";
      }
    } else {
      console.log("else===", orderpagedetails);
      $(".parcelbtn").hide();
    }

    this.getCategoryType();
    // this.getTax();
    this.payMode();
    this.getRoomList();

    // if (this.tableInvoiceId != 0) {
    //   this.getTableInformation(this.tableInvoiceId);
    // }

    this.now = Date.now();
    setInterval(() => {
      this.now = Date.now();
    }, 1000);
    this.ival = 0;
    this.ival = 0;
  }
  getCategoryType() {
    this.orderManagementService.getCategoryMaster().subscribe((res) => {
      console.log("res: ", res);

      this.categoryMstList = res["resObject"];
      this.getCategoryList(this.categoryMstList[0].categoryTypeId);
      setTimeout(function () {
        $(".tab1").addClass("active");
      }, 600);
      console.log("categoryMstList", this.categoryMstList);
    });
  }

  roomChange(ev) {
    var roomid = ev.target.value;

    this.orderManagementService.getRoomInfo(roomid).subscribe((res) => {
      console.log("res: ", res);

      this.savedTableTransactionData = res;
      var resobjtdata = this.savedTableTransactionData.resObject;
      console.log("lengrh===", resobjtdata.length);
      var resdata = this.savedTableTransactionData.resObject.orderDetails;
      if (resdata.length > 0) {
        this.itemarr = [];
        this.totalPrice = 0;
        this.sudototalPrice = 0;
        this.textAmount = 0;
        this.grossAmount = 0;
        //this.tableOrderNo = resobjtdata.invoiceId;
        this.roomOrderData.counterId = "";
        this.roomOrderData.persons = "";
        this.roomOrderData.waiter = "";
        this.tabno = $(".room_cls option:selected").html();

        console.log("if===", resdata.length);
        var qnty = 0;
        //  this.roomOrderData.taxId = resobjtdata;
        this.roomOrderData.paymentModeId = resobjtdata.paymentModeId;
        this.totalPrice = resobjtdata.netAmount;
        this.sudototalPrice = resobjtdata.netAmount;
        this.textAmount = resobjtdata.taxAmount;
        this.grossAmount = resobjtdata.totalAmount;
        this.tableOrderNo = resobjtdata.invoiceId;
        this.roomOrderData.counterId = resobjtdata.counterId;
        this.roomOrderData.persons = resobjtdata.noOfPerson;
        this.roomOrderData.waiter = resobjtdata.waiterName;
        this.roomOrderData.isDiscount = resobjtdata.isDiscount;
        this.roomOrderData.comment = resobjtdata.comment;
        if (resobjtdata.isDiscount == "Y") {
          $("#discounttype").show();
          this.roomOrderData.discountType = resobjtdata.discountType;
          if (resobjtdata.discountType == "Amount") {
            $('input[name="switchcheck"]').prop("checked", false);
            $("#distamnt").show();
            $("#distper").hide();
            $("#typeamt").show();
            $("#typeper").hide();
            $("#distamnt").val(resobjtdata.discountAmount);
            this.roomOrderData.discountAmount = resobjtdata.discountAmount;
          } else if (resobjtdata.discountType == "Percentage") {
            $('input[name="switchcheck"]').prop("checked", true);
            $("#distamnt").hide();
            $("#distper").show();
            $("#typeamt").hide();
            $("#typeper").show();
            $("#distper").val(resobjtdata.percentageAmt.toFixed());
            this.roomOrderData.discountAmount = resobjtdata.percentageAmt.toFixed();
          }
        }

        var assoArr = {};

        for (var i = 0; i < resdata.length; i++) {
          this.roomOrderData.orderDetails.push(resdata[i]);
          var infoarr = [];
          this.psudoitemarr = resdata[i];
          var key = resdata[i]["itemId"] + "_" + resdata[i]["kotseqNo"];

          var tempArr = [];
          if (!assoArr[key]) {
            tempArr.push({
              itemId: resdata[i]["itemId"],
              itemPrice: resdata[i]["itemPrice"],
              noOfItem: 1,
              itemName: resdata[i]["itemName"],
              itemFixedPrice: resdata[i]["itemPrice"],
              itemTaxAmout: resdata[i]["itemTaxAmout"],
              itemTaxper: resdata[i]["itemTaxPercentage"],
              itemType: resdata[i]["itemType"],
              kotseqNo: resdata[i]["kotseqNo"],
              itemFixedQnty: 1,
              itemFixedTax: resdata[i]["itemTaxAmout"],
            });

            assoArr[key] = tempArr[0];
          } else {
            var arr = assoArr[key];
            arr.noOfItem++;
            arr.itemFixedQnty++;
            arr.itemPrice = arr.itemPrice * arr.noOfItem;
            arr.itemTaxAmout = arr.itemTaxAmout * arr.noOfItem;
            assoArr[key] = arr;
          }
          if (!this.associativeArr[key]) {
            console.log("if hit");
            infoarr.push(resdata[i]);
            this.associativeArr[key] = infoarr;
          } else {
            var temarr = this.associativeArr[key];

            temarr.push(resdata[i]);
            console.log("temarr===", temarr);
            // this.associativeArr[key] = tempArr;
          }
        }
        console.log("assoArr", assoArr);
        console.log("associativeArr", this.associativeArr);

        for (var j in assoArr) {
          this.itemarr.push(assoArr[j]);
        }

        console.log("itemarr", this.itemarr);
      }
    });
  }

  getRoomList() {
    this.orderManagementService.getRoomDetails(this.residd).subscribe((res) => {
      console.log("res: ", res);
      this.roomList = res["resObject"];
      console.log("roomList", this.roomList);
    });
  }

  getCategoryList(catid) {
    for (var k in this.categoryMstList) {
      if (this.categoryMstList[k].categoryTypeId == catid) {
        console.log(".tab" + catid);
        $(".tab" + catid).addClass("active");
      } else {
        console.log(this.categoryMstList[k].categoryTypeId);
        $(".tab" + this.categoryMstList[k].categoryTypeId).removeClass(
          "active"
        );
      }
    }
    this.orderManagementService.getCategoryList(catid).subscribe((res) => {
      console.log("res: ", res);
      this.categoryList = res["resObject"];
      this.categoryCount = res;
      console.log("categoryList", this.categoryList);
    });
  }

  payMode() {
    this.orderManagementService.getAllPaymentMode().subscribe((res) => {
      console.log("res: ", res);
      this.paymodeList = res["resObject"];
      this.roomOrderData.paymentModeId = this.paymodeList[0].paymodId;
      console.log("paymodeList", this.paymodeList);
    });
  }
  getTax() {
    this.orderManagementService.getAllTaxType().subscribe((res) => {
      console.log("res: ", res);
      this.taxList = res["resObject"];
      this.roomOrderData.taxId = this.taxList[0].taxId;
      console.log("taxList", this.taxList);
    });
  }
  getAllItem(item) {
    this.orderManagementService
      .getAllItemByCategory(item.categoryId)
      .subscribe((res) => {
        console.log("res: ", res);
        this.itemList = res["resObject"];
        this.itemCount = res;
        console.log("itemList", this.itemList);
      });
  }
  dishService(dataitem, dataItemPrice, dataTaxamount) {
    this.totalPrice = 0;
    this.textAmount = 0;
    this.newrowdata = 0;
    this.sudototalPrice = 0;
    this.newtax = 0;
    console.log("dataitem=====", dataTaxamount);

    if (this.itemarr.length > 0) {
      for (var k in this.itemarr) {
        if (this.itemarr[k].itemId == dataitem.itemId) {
          var idd =
            parseInt(
              (<HTMLInputElement>(
                document.getElementById("itemseleted" + dataitem.itemId)
              )).value
            ) + 1;
          console.log("idd" + idd);
          console.log("itemFixedPrice" + dataTaxamount);
          var itemprice = idd * dataItemPrice;
          var itemTaxAmout = idd * dataTaxamount;

          this.itemarr[k].noOfItem = idd;
          this.itemarr[k].itemPrice = itemprice;
          this.itemarr[k].itemTaxAmout = itemTaxAmout.toFixed(2);
          this.newrowdata = dataitem.itemPrice;
          this.newtax = dataitem.itemTaxAmout;
          this.totalPrice += this.newrowdata;
          this.sudototalPrice += this.newrowdata;
          this.textAmount += +this.newtax.toFixed(2);
        } else {
          if (!this.itemidarr.includes(dataitem.itemId)) {
            console.log("include", dataitem.itemTaxAmout.toFixed(2));
            this.newtax = dataitem.itemTaxAmout;
            this.itemarr.push({
              itemId: dataitem.itemId,
              itemName: dataitem.itemName,
              itemPrice: dataitem.itemPrice,
              noOfItem: "1",
              itemFixedPrice: dataitem.itemPrice,
              kotseqNo: 0,
              itemTaxAmout: dataitem.itemTaxAmout,
              itemTaxper: dataitem.itemTaxPercentage,
              itemType: dataitem.itemType,
              itemFixedTax: dataitem.itemTaxAmout,
            });
            this.itemidarr.push(dataitem.itemId);
            this.newrowdata = dataitem.itemPrice;

            this.totalPrice += this.newrowdata;
            this.sudototalPrice += this.newrowdata;
            this.textAmount += this.newtax;
          }
        }
        this.totalPrice += parseInt(
          (<HTMLInputElement>(
            document.getElementById("itemseletedprice" + this.itemarr[k].itemId)
          )).innerText
        );
        this.sudototalPrice += parseInt(
          (<HTMLInputElement>(
            document.getElementById("itemseletedprice" + this.itemarr[k].itemId)
          )).innerText
        );
        this.textAmount += parseInt(
          (<HTMLInputElement>(
            document.getElementById("itemseletedTax" + this.itemarr[k].itemId)
          )).innerText
        );
        console.log("txtamount==", this.textAmount);
        // this.textAmount = this.textAmount.toFixed(2);
        var taxvall = $("#taxId option:selected").text();
        // this.textAmount = (this.totalPrice * +taxvall) / 100;
        // this.textAmount = +this.textAmount.toFixed(2);
        this.grossAmount =
          +this.totalPrice.toFixed(2) + +this.textAmount.toFixed(2);
        console.log("discount===|||", this.roomOrderData.discountAmount);
        if (+this.roomOrderData.discountAmount > 0) {
          console.log("discount type===", this.roomOrderData.discountType);
          console.log("discount===if===", this.roomOrderData.discountAmount);
          if (this.roomOrderData.discountType == "Percentage") {
            var disamount = (
              (this.sudototalPrice * +this.roomOrderData.discountAmount) /
              100
            ).toString();
            this.grossAmount = this.grossAmount - +disamount;
            this.grossAmount = +this.grossAmount.toFixed(2);
          } else if (this.roomOrderData.discountType == "Amount") {
            this.grossAmount =
              this.grossAmount - +this.roomOrderData.discountAmount;
            this.grossAmount = +this.grossAmount.toFixed(2);
          }
        }
        this.grossAmount = +this.grossAmount.toFixed(2);
        console.log("totalPrice", this.totalPrice);
        console.log("textAmount", this.textAmount);
        console.log("taxvall", taxvall);
      }
    } else {
      console.log("klklkl");
      this.itemindex = dataitem.itemId;

      this.itemarr.push({
        itemId: dataitem.itemId,
        itemName: dataitem.itemName,
        itemPrice: dataitem.itemPrice,
        noOfItem: "1",
        itemFixedPrice: dataitem.itemPrice,
        kotseqNo: 0,
        itemTaxAmout: dataitem.itemTaxAmout,
        itemTaxper: dataitem.itemTaxPercentage,
        itemType: dataitem.itemType,
        itemFixedTax: dataitem.itemTaxAmout,
      });
      this.itemidarr.push(dataitem.itemId);
      this.totalPrice = dataitem.itemPrice;
      this.sudototalPrice = dataitem.itemPrice;
      var taxvall = $("#taxId option:selected").text();
      this.textAmount = dataitem.itemTaxAmout;
      // this.textAmount = +this.textAmount.toFixed(2);
      this.grossAmount =
        +this.totalPrice.toFixed(2) + +this.textAmount.toFixed(2);
      this.grossAmount = +this.grossAmount.toFixed(2);
      console.log("totalPrice", this.totalPrice);
      console.log("textAmount", this.textAmount);
      console.log("taxvall", taxvall);
    }

    var psudoitemarr = {
      itemId: dataitem.itemId,
      itemName: dataitem.itemName,
      itemPrice: dataitem.itemPrice,
      noOfItem: 1,
      changed: 1,
      itemTaxAmout: dataitem.itemTaxAmout,
      itemTaxper: dataitem.itemTaxPercentage,
      itemType: dataitem.itemType,
      itemFixedTax: dataitem.itemTaxAmout,
    };

    this.roomOrderData.orderDetails.push(psudoitemarr);

    console.log("itemarr", this.itemarr);
    console.log("itemarr single", this.itemarr[dataitem.itemId]);
    console.log("itemarr type", typeof this.itemarr);
  }
  itemRemove(indx, item) {
    console.log("indx===", indx);
    console.log("item===", item);
    console.log("orderdetails===///", this.roomOrderData.orderDetails);
    //  array.splice(index, 1);
    if (item.kotseqNo > 0) {
      console.log("if condition");
      for (var i = 0; i < this.roomOrderData.orderDetails.length; i++) {
        if (this.roomOrderData.orderDetails[i].itemId == item.itemId) {
          this.roomOrderData.orderDetails[i].changed = 2;
        }
      }
    } else {
      var pseduorder = [];
      for (var i = 0; i < this.roomOrderData.orderDetails.length; i++) {
        console.log("ind", this.roomOrderData.orderDetails[i].itemId);
        //    for (var j = 0; j < this.roomOrderData.orderDetails.length; j++) {
        console.log("orderdetails===ppp", this.roomOrderData.orderDetails);
        if (this.roomOrderData.orderDetails[i].itemId != item.itemId) {
          pseduorder.push(this.roomOrderData.orderDetails[i]);
        }
        //   }
      }
      this.roomOrderData.orderDetails = pseduorder;
      console.log("orderdetails===", this.roomOrderData.orderDetails);
      console.log("pseduorder===", pseduorder);
      console.log("itemidarr===", this.itemidarr);
    }
    for (var i = 0; i < this.itemidarr.length; i++) {
      if (this.itemidarr[i] == item.itemId) {
        this.itemidarr.splice(i, 1);
      }
    }

    console.log("itemidarr new===", this.itemidarr);
    this.itemarr.splice(indx, 1);
    this.totalPrice = this.totalPrice - item.itemPrice;
    this.textAmount = this.textAmount - item.itemTaxAmout;
    this.grossAmount =
      +this.totalPrice.toFixed(2) + +this.textAmount.toFixed(2);
    console.log("discount===|||", this.roomOrderData.discountAmount);
    if (+this.roomOrderData.discountAmount > 0) {
      console.log("discount type===", this.roomOrderData.discountType);
      console.log("discount===if===", this.roomOrderData.discountAmount);

      if (this.roomOrderData.discountType == "Percentage") {
        console.log("subtotal==||", this.totalPrice);
        var disamount = (
          (this.totalPrice * +this.roomOrderData.discountAmount) /
          100
        ).toString();
        console.log("disamount==||", disamount);
        console.log("textamo==||", this.textAmount);
        this.grossAmount = this.grossAmount - +disamount;
        this.grossAmount = +this.grossAmount.toFixed(2);
        console.log("grossAmount==||", this.grossAmount);
      } else if (this.roomOrderData.discountType == "Amount") {
        this.grossAmount =
          this.grossAmount - +this.roomOrderData.discountAmount;
        this.grossAmount = +this.grossAmount.toFixed(2);
      }
    }
    console.log("remove===", this.itemarr);
  }
  itemMinius(itemData) {
    this.totalPrice = 0;
    this.textAmount = 0;
    this.sudototalPrice = 0;

    console.log("iiiitteemm===", itemData);
    if (itemData.kotseqNo > 0) {
      var key = itemData.itemId + "_" + itemData.kotseqNo;
      console.log("arrarr", this.associativeArr[key]);

      var arr = this.associativeArr[key];
      console.log("arrrr==", arr);
      var flag = false;
      for (var i = 0; i < arr.length; i++) {
        // if (itemData.noOfItem > arr[i].noOfItem) {
        //  console.log("2");
        //   for (var i = 0; i < this.roomOrderData.orderDetails.length; i++) {
        //     //    for (var j = 0; j < this.roomOrderData.orderDetails.length; j++) {
        //     if (this.roomOrderData.orderDetails[i].itemId == itemData.itemId) {
        //       this.roomOrderData.orderDetails.splice(i, 1);
        //       break;
        //     }
        //     //   }
        //   }
        // } else {
        console.log("3");
        if (arr[i].changed != 2) {
          console.log("4");
          flag = true;
          arr[i].changed = 2;
          break;
        }
        if (flag) {
          break;
        }
        this.roomOrderData.orderDetails.push(arr[i]);
        //  }
      }

      console.log("miniusarr", arr);
      console.log("miniuorder", this.roomOrderData.orderDetails);
    } else {
      for (var i = 0; i < this.roomOrderData.orderDetails.length; i++) {
        //    for (var j = 0; j < this.roomOrderData.orderDetails.length; j++) {
        if (this.roomOrderData.orderDetails[i].itemId == itemData.itemId) {
          this.roomOrderData.orderDetails.splice(i, 1);
          break;
        }
        //   }
      }
    }
    for (var k in this.itemarr) {
      console.log("itemseleted" + itemData.itemId);
      if (itemData.itemId == this.itemarr[k].itemId) {
        console.log("itemData" + itemData.itemId);
        var itemqnty = (<HTMLInputElement>(
          document.getElementById("itemseleted" + itemData.itemId)
        )).value;
        // var itemprice = (<HTMLInputElement>document.getElementById('itemseletedprice'+itemData.itemId)).innerText;
        console.log("itemqnty" + itemData.itemFixedTax);
        if (+itemqnty > 1) {
          var newitemqnty = +itemqnty - 1;
          var newitemprice = newitemqnty * itemData.itemFixedPrice;
          var newtaxamount = newitemqnty * itemData.itemFixedTax;
          this.newrowdata = newitemprice;
          this.newtax = newtaxamount;
          console.log("newitemqnty", newitemqnty);
          console.log("newitemprice", newitemprice);
          console.log("newtaxamount", newtaxamount);
          // (<HTMLInputElement>document.getElementById('itemseleted'+itemData.itemId)).value = newitemqnty;
          // (<HTMLInputElement>document.getElementById('itemseletedprice'+itemData.itemId)).innerHTML = newitemprice;
          this.itemarr[k].noOfItem = newitemqnty;
          this.itemarr[k].itemPrice = newitemprice;
          this.itemarr[k].itemTaxAmout = newtaxamount;
        }
        console.log("totalPrice====", this.totalPrice);
        console.log("textAmount====", this.textAmount);
        console.log("newtextAmount====", this.newtax);
        this.totalPrice += this.newrowdata;
        this.sudototalPrice += this.newrowdata;
        this.textAmount += this.newtax;

        console.log("totalPrice====///", this.totalPrice);
        console.log("textAmount====///", this.textAmount);
      } else {
        this.totalPrice += parseInt(
          (<HTMLInputElement>(
            document.getElementById("itemseletedprice" + this.itemarr[k].itemId)
          )).innerText
        );
        this.sudototalPrice += parseInt(
          (<HTMLInputElement>(
            document.getElementById("itemseletedprice" + this.itemarr[k].itemId)
          )).innerText
        );
        this.textAmount += parseInt(
          (<HTMLInputElement>(
            document.getElementById("itemseletedTax" + this.itemarr[k].itemId)
          )).innerText
        );
      }

      // this.totalPrice += parseInt((<HTMLInputElement>document.getElementById('itemseletedprice'+this.itemarr[k].itemId)).innerText);
      var taxvall = $("#taxId option:selected").text();
      // this.textAmount = (this.totalPrice * +taxvall) / 100;
      //  this.textAmount = +this.textAmount.toFixed(2);
      this.grossAmount =
        +this.totalPrice.toFixed(2) + +this.textAmount.toFixed(2);
      this.grossAmount = +this.grossAmount.toFixed(2);
      if (+this.roomOrderData.discountAmount > 0) {
        console.log("discount type===", this.roomOrderData.discountType);
        console.log("discount===if===", this.roomOrderData.discountAmount);

        if (this.roomOrderData.discountType == "Percentage") {
          console.log("subtotal==||", this.totalPrice);
          var disamount = (
            (this.totalPrice * +this.roomOrderData.discountAmount) /
            100
          ).toString();
          console.log("disamount==||", disamount);
          console.log("textamo==||", this.textAmount);
          this.grossAmount = this.grossAmount - +disamount;
          this.grossAmount = +this.grossAmount.toFixed(2);
          console.log("grossAmount==||", this.grossAmount);
        } else if (this.roomOrderData.discountType == "Amount") {
          this.grossAmount =
            this.grossAmount - +this.roomOrderData.discountAmount;
          this.grossAmount = +this.grossAmount.toFixed(2);
        }
      }
      console.log("totalPrice", this.totalPrice);
      console.log("textAmount", this.textAmount);
      console.log("taxvall", taxvall);
    }
  }
  itemPlus(itemData) {
    var newplusdata = {
      itemId: itemData.itemId,
      noOfItem: 1,
      itemPrice: itemData.itemPrice,
      changed: 1,
      itemTaxAmout: itemData.itemTaxAmout,
      itemTaxper: itemData.itemTaxPercentage,
      itemType: itemData.itemType,
      itemFixedTax: itemData.itemTaxAmout,
    };
    this.roomOrderData.orderDetails.push(newplusdata);

    console.log("reverse===", this.roomOrderData.orderDetails.reverse());

    this.totalPrice = 0;
    this.textAmount = 0;
    this.sudototalPrice = 0;
    for (var k in this.itemarr) {
      console.log("itemseleted" + itemData.itemId);
      if (itemData.itemId == this.itemarr[k].itemId) {
        console.log("itemData" + itemData.itemId);
        var itemqnty = (<HTMLInputElement>(
          document.getElementById("itemseleted" + itemData.itemId)
        )).value;
        // var itemprice = (<HTMLInputElement>document.getElementById('itemseletedprice'+itemData.itemId)).innerText;
        console.log("itemqnty" + itemqnty);
        var newitemqnty = parseInt(itemqnty) + 1;
        var newitemprice = newitemqnty * itemData.itemFixedPrice;
        var newtaxamount = newitemqnty * itemData.itemFixedTax;
        if (this.itemarr[k].itemId == itemData.itemId) {
          this.itemarr[k].noOfItem = newitemqnty;
          this.itemarr[k].itemPrice = newitemprice;
          this.itemarr[k].itemTaxAmout = newtaxamount.toFixed(2);
          this.totalPrice += newitemprice;
          this.sudototalPrice += newitemprice;
          this.textAmount += newtaxamount;
          if (itemData.noOfItem >= itemData.itemFixedQnty) {
            this.itemarr[k].kotseqNo = 0;
          }
        }

        //  console.log("newitemqnty",newitemqnty);
        // (<HTMLInputElement>document.getElementById('itemseleted'+itemData.itemId)).value = newitemqnty;
        //  (<HTMLInputElement>document.getElementById('itemseletedprice'+itemData.itemId)).innerHTML = newitemprice;
      } else {
        this.totalPrice += parseInt(
          (<HTMLInputElement>(
            document.getElementById("itemseletedprice" + this.itemarr[k].itemId)
          )).innerText
        );
        this.sudototalPrice += parseInt(
          (<HTMLInputElement>(
            document.getElementById("itemseletedprice" + this.itemarr[k].itemId)
          )).innerText
        );
        this.textAmount += parseInt(
          (<HTMLInputElement>(
            document.getElementById("itemseletedTax" + this.itemarr[k].itemId)
          )).innerText
        );
      }

      var taxvall = $("#taxId option:selected").text();
      // this.textAmount = (this.totalPrice * +taxvall) / 100;
      this.textAmount = +this.textAmount.toFixed(2);
      this.grossAmount =
        +this.totalPrice.toFixed(2) + +this.textAmount.toFixed(2);
      this.grossAmount = +this.grossAmount.toFixed(2);
      if (+this.roomOrderData.discountAmount > 0) {
        console.log("discount type===", this.roomOrderData.discountType);
        console.log("discount===if===", this.roomOrderData.discountAmount);

        if (this.roomOrderData.discountType == "Percentage") {
          console.log("subtotal==||", this.totalPrice);
          var disamount = (
            (this.totalPrice * +this.roomOrderData.discountAmount) /
            100
          ).toString();
          console.log("disamount==||", disamount);
          console.log("textamo==||", this.textAmount);
          this.grossAmount = this.grossAmount - +disamount;
          this.grossAmount = +this.grossAmount.toFixed(2);
          console.log("grossAmount==||", this.grossAmount);
        } else if (this.roomOrderData.discountType == "Amount") {
          this.grossAmount =
            this.grossAmount - +this.roomOrderData.discountAmount;
          this.grossAmount = +this.grossAmount.toFixed(2);
        }
      }
      console.log("totalPrice", this.totalPrice);
      console.log("textAmount", this.textAmount);
      console.log("taxvall", taxvall);
    }
  }
  taxChange() {
    // var taxper = (<HTMLInputElement>document.getElementById('taxId'));
    var taxvall = $("#taxId option:selected").text();

    this.textAmount = (this.totalPrice * +taxvall) / 100;
    this.textAmount = +this.textAmount.toFixed(2);
    this.grossAmount =
      +this.totalPrice.toFixed(2) + +this.textAmount.toFixed(2);
    this.grossAmount = +this.grossAmount.toFixed(2);
    console.log("tax1", typeof this.textAmount);
    console.log("tax2", typeof this.grossAmount);
  }

  roomSave() {
    //  console.log("uuyyuu", this.tableDetails);
    console.log("totalPrice", this.totalPrice);
    console.log("roomSaveData", this.roomOrderData);
    var intRegex = /^\d*$/;
    if (this.totalPrice == undefined) {
      this.alertSerive.create(
        "", //title
        "danger", //type
        20000, // time
        "Please Select a Dish First!" //body
      );
    } else if (!intRegex.test(this.roomOrderData.persons)) {
      this.alertSerive.create(
        "", //title
        "danger", //type
        20000, // time
        "Please Enter No of Person!" //body
      );
    } else if (this.roomOrderData.roomId == "") {
      this.alertSerive.create(
        "", //title
        "danger", //type
        20000, // time
        "Please Select a Room!" //body
      );
    } else {
      var orderArr = [];
      for (var k in this.itemarr) {
        for (var i = 0; i < this.itemarr[k].noOfItem; i++) {
          orderArr.push({
            itemId: this.itemarr[k].itemId,
            noOfItem: "1",
            itemPrice: this.itemarr[k].itemFixedPrice,
            changed: "1",
          });
        }
      }
      //  var abss = JSON.parse(this.tableDetails);
      this.roomOrderData.taxAmount = this.textAmount.toString();
      this.roomOrderData.netAmount = this.totalPrice.toString();
      this.roomOrderData.totalAmount = this.grossAmount.toString();
      // this.roomOrderData.roomId = abss.tableId;
      //  this.roomOrderData.discountType = this.discountradiotype;
      this.roomOrderData.typeValue = "save";
      this.roomOrderData.currencyId = "1";
      // this.roomOrderData.orderDetails = orderArr;

      console.log("roomOrderData", this.roomOrderData);
      this.spinner.show();
      this.orderManagementService
        .addRoomOrder(this.roomOrderData)
        .subscribe((res) => {
          console.log("roomSaveData", this.roomOrderData);
          this.roomSaveData = res;
          if (this.roomSaveData.status == "Success") {
            console.log("add successfull", this.roomSaveData);
            //  this.alerts.setMessage('Recipe Added successfully!','success');
            this.alertSerive.create(
              "", //title
              "success", //type
              5000, // time
              "Information Saved successfully!" //body
            );
            this.roomOrderData = {
              counterId: "",
              invoiceId: "",
              persons: "",
              waiter: "",
              isDiscount: "N",
              restaurantId: this.residd,
              roomId: "",
              parcelId: "",
              txnDate: "",
              paymentModeId: "",
              netAmount: "",
              discountType: "",
              discountAmount: "",
              taxAmount: "",
              typeValue: "",
              taxId: "",
              totalAmount: "",
              currencyId: "",
              orderDetails: [],
              comment: "",
            };
            this.ngOnInit();
            this.itemarr = [];
            this.spinner.hide();
            //  this._des.newEvent("restaurant_table_management");
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
  // discountLoad(ev) {
  //   this.disvalues = ev.target.value;
  //   console.log("disvalues", this.disvalues);
  //   console.log("discountradiotype", this.roomOrderData.discountType);
  //   if (this.roomOrderData.discountType == "Amount") {
  //     this.roomOrderData.discountAmount = this.disvalues.toString();
  //     // this.totalPrice = this.sudototalPrice - this.disvalues;
  //     //  this.totalPrice = +this.totalPrice.toFixed(2);

  //     this.grossAmount =
  //       +this.totalPrice.toFixed(2) +
  //       +this.textAmount.toFixed(2) -
  //       this.disvalues;
  //     this.grossAmount = +this.grossAmount.toFixed(2);
  //     console.log("amt1 ", this.roomOrderData.discountAmount);
  //     console.log("amt2 ", this.totalPrice);
  //     console.log("amt2 type=== ", typeof this.totalPrice);
  //     console.log("amt3 type33=== ", typeof this.grossAmount);
  //   } else if (this.roomOrderData.discountType == "Percentage") {
  //     this.roomOrderData.discountAmount = this.disvalues.toString();
  //     var disamount = ((this.sudototalPrice * this.disvalues) / 100).toString();
  //     console.log("pp1", this.roomOrderData.discountAmount);
  //     console.log("pp2", this.sudototalPrice);
  //     // this.totalPrice =
  //     this.sudototalPrice - +this.roomOrderData.discountAmount;
  //     // this.totalPrice = +this.totalPrice.toFixed(2);
  //     console.log("pp3", this.totalPrice);
  //     this.grossAmount =
  //       +this.totalPrice.toFixed(2) + +this.textAmount.toFixed(2) - +disamount;
  //     this.grossAmount = +this.grossAmount.toFixed(2);
  //     console.log("per1 ", this.roomOrderData.discountAmount);
  //     console.log("per2 ", this.totalPrice);
  //     console.log("per2 type=== ", typeof this.totalPrice);
  //     console.log("per2 type33=== ", this.grossAmount);
  //   }
  // }
  discountLoad(ev) {
    this.disvalues = ev.target.value;
    console.log("disvalues", this.disvalues);
    console.log("discountradiotype", this.roomOrderData.discountType);
    if ($('input[name="switchcheck"]').prop("checked") == false) {
      this.roomOrderData.discountAmount = this.disvalues.toString();
      // this.totalPrice = this.sudototalPrice - this.disvalues;
      //  this.totalPrice = +this.totalPrice.toFixed(2);

      this.grossAmount =
        +this.totalPrice.toFixed(2) +
        +this.textAmount.toFixed(2) -
        this.disvalues;
      this.grossAmount = +this.grossAmount.toFixed(2);
      console.log("amt1 ", this.roomOrderData.discountAmount);
      console.log("amt2 ", this.totalPrice);
      console.log("amt2 type=== ", typeof this.totalPrice);
      console.log("amt3 type33=== ", typeof this.grossAmount);
    } else if ($('input[name="switchcheck"]').prop("checked") == true) {
      this.roomOrderData.discountAmount = this.disvalues.toString();
      var disamount = ((this.sudototalPrice * this.disvalues) / 100).toString();
      console.log("pp1", this.roomOrderData.discountAmount);
      console.log("pp2", this.sudototalPrice);
      // this.totalPrice =
      this.sudototalPrice - +this.roomOrderData.discountAmount;
      // this.totalPrice = +this.totalPrice.toFixed(2);
      console.log("pp3", this.totalPrice);
      this.grossAmount =
        +this.totalPrice.toFixed(2) + +this.textAmount.toFixed(2) - +disamount;
      this.grossAmount = +this.grossAmount.toFixed(2);
      console.log("per1 ", this.roomOrderData.discountAmount);
      console.log("per2 ", this.totalPrice);
      console.log("per2 type=== ", typeof this.totalPrice);
      console.log("per2 type33=== ", this.grossAmount);
    }
  }
  // discChange(ev) {
  //   var val = ev.target.value;
  //   console.log("discountradiotype", this.discountradiotype);
  //   if (val == "Y") {
  //     $("#discounttype").show();

  //     if (this.roomOrderData.discountType == "Amount") {
  //       console.log("yyy");
  //       $("#distamnt").show();
  //       $("#distper").hide();
  //       $("#typeamt").show();
  //       $("#typeper").hide();
  //     } else {
  //       console.log("nnn");
  //       $("#distamnt").hide();
  //       $("#distper").show();
  //       $("#typeamt").hide();
  //       $("#typeper").show();
  //     }
  //   } else {
  //     $("#discounttype").hide();
  //     $("#distamnt").hide();
  //     $("#distper").hide();
  //     $("#typeamt").hide();
  //     $("#typeper").hide();
  //   }
  // }
  discChange(ev) {
    var val = ev.target.value;
    console.log("discountradiotype", this.discountradiotype);
    if (val == "Y") {
      $("#discounttype").show();

      if ($('input[name="switchcheck"]').prop("checked") == false) {
        this.roomOrderData.discountType = "Amount";
        console.log("yyy");
        $("#distamnt").show();
        $("#distper").hide();
        $("#typeamt").show();
        $("#typeper").hide();
      } else {
        this.roomOrderData.discountType = "Percentage";
        console.log("nnn");
        $("#distamnt").hide();
        $("#distper").show();
        $("#typeamt").hide();
        $("#typeper").show();
      }
    } else {
      this.totalPrice = this.sudototalPrice;
      this.grossAmount =
        +this.totalPrice.toFixed(2) + +this.textAmount.toFixed(2);
      $("#distamnt").val("");
      $("#distper").val("");

      $("#discounttype").hide();
      $("#distamnt").hide();
      $("#distper").hide();
      $("#typeamt").hide();
      $("#typeper").hide();
    }
  }
  // radioChange(ev) {
  //   console.log("evv", ev.target.value);
  //   this.discountradiotype = ev.target.value;
  //   this.totalPrice = this.sudototalPrice;
  //   this.grossAmount =
  //     +this.totalPrice.toFixed(2) + +this.textAmount.toFixed(2);
  //   if (this.roomOrderData.discountType == "Percentage") {
  //     console.log("yyy");
  //     $("#distamnt").hide();
  //     $("#typeamt").hide();
  //     $("#distper").show();
  //     $("#typeper").show();
  //   } else {
  //     console.log("nnn");
  //     $("#distamnt").show();
  //     $("#typeamt").show();
  //     $("#distper").hide();
  //     $("#typeper").hide();
  //   }
  // }

  radioChange(ev) {
    console.log("evv", ev.target.value);

    this.discountradiotype = ev.target.value;
    this.totalPrice = this.sudototalPrice;
    this.grossAmount =
      +this.totalPrice.toFixed(2) + +this.textAmount.toFixed(2);
    if ($('input[name="switchcheck"]').prop("checked") == true) {
      this.roomOrderData.discountType = "Percentage";
      console.log("yyy");
      $("#distamnt").hide();
      $("#typeamt").hide();
      $("#distper").show();
      $("#typeper").show();
      $("#distamnt").val("");
    } else {
      console.log("nnn");
      this.roomOrderData.discountType = "Amount";
      $("#distamnt").show();
      $("#typeamt").show();
      $("#distper").hide();
      $("#typeper").hide();
      $("#distper").val("");
    }
  }
  roomPrintSave() {
    var intRegex = /^\d*$/;
    if (this.totalPrice == undefined) {
      this.alertSerive.create(
        "", //title
        "danger", //type
        20000, // time
        "Please Select a Dish First!" //body
      );
    } else if (!intRegex.test(this.roomOrderData.persons)) {
      this.alertSerive.create(
        "", //title
        "danger", //type
        20000, // time
        "Please Enter No of Person!" //body
      );
    } else if (this.roomOrderData.roomId == "") {
      this.alertSerive.create(
        "", //title
        "danger", //type
        20000, // time
        "Please Select a Room!" //body
      );
    } else {
      //  console.log("uuyyuu", this.tableDetails);
      // var abss = JSON.parse(this.tableDetails);
      this.roomOrderData.taxAmount = this.textAmount.toString();
      this.roomOrderData.netAmount = this.totalPrice.toString();
      this.roomOrderData.totalAmount = this.grossAmount.toString();
      // this.roomOrderData.roomId = this.grossAmount.roomId;
      //  this.roomOrderData.discountType = this.discountradiotype;
      this.roomOrderData.typeValue = "payprint";
      this.roomOrderData.currencyId = "1";
      this.spinner.show();
      this.orderManagementService
        .addRoomOrder(this.roomOrderData)
        .subscribe((res) => {
          console.log("roomSaveData", this.roomOrderData);
          this.roomSaveData = res;
          if (this.roomSaveData.status == "Success") {
            console.log("add successfull", this.roomSaveData);

            this.restaurantBillDetails = this.roomSaveData.resObject;
            this.restaurantBillDetails["pagetype"] = "room";

            var resdata = this.restaurantBillDetails.orderDetails;
            var restaxdata = this.restaurantBillDetails.taxDetails;
            var assoArr = {};
            console.log("resdata===", resdata);
            for (var i = 0; i < resdata.length; i++) {
              if (resdata[i].itemType == "Liquid") {
                this.isVisibleLiquidTable = true;
              }
              var infoarr = [];
              // this.orderDetails = resdata[i];
              var key = resdata[i]["itemId"] + "_" + resdata[i]["kotseqNo"];

              var tempArr = [];
              if (!assoArr[key]) {
                tempArr.push({
                  noOfItem: 1,
                  itemType: resdata[i]["itemType"],
                  descripition: resdata[i]["itemName"],
                  itemFixedPrice: resdata[i]["itemPrice"],
                  itemPrice: resdata[i]["itemPrice"],
                  itemTaxAmout: resdata[i]["itemTaxAmout"],
                });

                assoArr[key] = tempArr[0];
              } else {
                var arr = assoArr[key];
                arr.noOfItem++;
                arr.itemPrice = arr.itemPrice * arr.noOfItem;
                arr.itemTaxAmout = arr.itemTaxAmout * arr.noOfItem;
                assoArr[key] = arr;
              }
            }
            for (var j in assoArr) {
              if (assoArr[j].itemType != "Liquid") {
                this.itemsavearr.push(assoArr[j]);
              } else {
                this.itemDrinkarr.push(assoArr[j]);
              }
            }

            // this.rescgst = this.restaurantBillDetails.orderDetails[0].cgst;
            // this.ressgst = this.restaurantBillDetails.orderDetails[0].sgst;

            // this.cgstAmount =
            //   (this.restaurantBillDetails.netAmount * this.rescgst) / 100;
            // this.sgstAmount =
            //   (this.restaurantBillDetails.netAmount * this.ressgst) / 100;

            for (var k in this.restaurantBillDetails.orderDetails) {
              if (
                this.restaurantBillDetails.orderDetails[k].itemType == "Liquid"
              ) {
                this.isVisibleLiquid = true;
                this.liquidQnty += 1;
                this.liquidNetAmount += this.restaurantBillDetails.orderDetails[
                  k
                ].itemPrice;
                this.lCgst = this.restaurantBillDetails.orderDetails[k].cgst;
                this.lSgst = this.restaurantBillDetails.orderDetails[k].sgst;
                this.lCgstAmount = (this.liquidNetAmount * this.lCgst) / 100;
                this.lSgstAmount = (this.liquidNetAmount * this.lSgst) / 100;
                this.lTaxAmount += this.restaurantBillDetails.orderDetails[
                  k
                ].itemTaxAmout;
              } else {
                this.iQnty += 1;
                this.iNetAmount += this.restaurantBillDetails.orderDetails[
                  k
                ].itemPrice;
                this.rescgst = this.restaurantBillDetails.orderDetails[k].cgst;
                this.ressgst = this.restaurantBillDetails.orderDetails[k].sgst;
                this.cgstAmount = (this.iNetAmount * this.rescgst) / 100;
                this.sgstAmount = (this.iNetAmount * this.ressgst) / 100;
                this.resTaxAmount += this.restaurantBillDetails.orderDetails[
                  k
                ].itemTaxAmout;
              }
            }

            var taxassoarr = {};
            for (var i = 0; i < restaxdata.length; i++) {
              var taxxnameid =
                restaxdata[i]["taxName"] + "_" + restaxdata[i]["itemTypeName"];
              var tempArr = [];
              if (!taxassoarr[taxxnameid]) {
                tempArr.push({
                  noOfItem: 1,
                  itemType: restaxdata[i]["itemTypeName"],
                  itemTaxName: restaxdata[i]["taxName"],
                  itemTaxPercentage: restaxdata[i]["taxPercentage"],
                  itemTypeName: restaxdata[i]["taxTypeName"],
                  itemTaxAmout: restaxdata[i]["taxAmount"],
                  itemfixedAmount: restaxdata[i]["taxAmount"],
                });

                taxassoarr[taxxnameid] = tempArr[0];
              } else {
                var arr = taxassoarr[taxxnameid];
                arr.noOfItem++;
                arr.itemTaxAmout =
                  arr.itemTaxAmout + restaxdata[i]["taxAmount"];
                taxassoarr[taxxnameid] = arr;
              }
            }
            var vegnonvegtaxarr = [];
            for (var j in taxassoarr) {
              if (taxassoarr[j].itemType != "Liquid") {
                vegnonvegtaxarr.push(taxassoarr[j]);
              } else {
                this.itemDrinktaxarr.push(taxassoarr[j]);
              }
            }
            var vegnonvegassoarr = {};
            for (var i = 0; i < vegnonvegtaxarr.length; i++) {
              console.log("arr calling==", i);
              var taxxname = vegnonvegtaxarr[i]["itemTaxName"];
              console.log("taxxname", taxxname);
              console.log("taxxname==", vegnonvegtaxarr[i]["itemTaxName"]);
              var tempArr = [];
              if (!vegnonvegassoarr[taxxname]) {
                tempArr.push({
                  noOfItem: 1,
                  itemTaxName: vegnonvegtaxarr[i]["itemTaxName"],
                  itemTaxPercentage: vegnonvegtaxarr[i]["itemTaxPercentage"],
                  itemTypeName: vegnonvegtaxarr[i]["itemTypeName"],
                  itemTaxAmout: vegnonvegtaxarr[i]["itemTaxAmout"],
                  itemfixedAmount: vegnonvegtaxarr[i]["itemTaxAmout"],
                });

                vegnonvegassoarr[taxxname] = tempArr[0];
              } else {
                var arr = vegnonvegassoarr[taxxname];

                arr.noOfItem++;
                arr.itemTaxAmout =
                  arr.itemTaxAmout + vegnonvegtaxarr[i]["itemTaxAmout"];
                vegnonvegassoarr[taxxname] = arr;
              }
            }
            for (var j in vegnonvegassoarr) {
              this.itemvegtaxarr.push(vegnonvegassoarr[j]);
            }
            console.log("vegnonvegtaxarr===", vegnonvegtaxarr);
            console.log("itemvegtaxarr===", this.itemvegtaxarr);
            console.log("itemDrinktaxarr===", this.itemDrinktaxarr);

            console.log("1===", this.iQnty);
            console.log("2===", this.iNetAmount);
            console.log("3===", this.rescgst);
            console.log("4===", this.cgstAmount);
            console.log("5===", this.liquidQnty);
            console.log("6===", this.liquidNetAmount);
            console.log("7===", this.lSgst);
            console.log("8===", this.lSgstAmount);

            console.log("www===", this.restaurantBillDetails);
            console.log("wwe===", typeof this.restaurantBillDetails);
            console.log("roomdata-===", this.itemarr);

            //  $("#billid").css("display", "block");
            this.spinner.hide();
            this.roomOrderData = {
              counterId: "",
              invoiceId: "",
              persons: "",
              waiter: "",
              isDiscount: "N",
              restaurantId: this.residd,
              roomId: "",
              parcelId: "",
              txnDate: "",
              paymentModeId: "",
              netAmount: "",
              discountType: "",
              discountAmount: "",
              taxAmount: "",
              typeValue: "",
              taxId: "",
              totalAmount: "",
              currencyId: "",
              orderDetails: [],
              comment: "",
            };

            var self = this;
            if (this.restaurantBillDetails != undefined) {
              setTimeout(function () {
                var divContents = $("#billresid").html();
                console.log("print receipt................", divContents);

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
                self._des.newEvent("restaurant_table_management");
              }, 2000);
            }

            //  console.log("roomModaldata", this.roomModaldata);
            // (<any>$("#myMessageModal")).modal("show");

            /* localStorage.setItem(
              "restaurantBillDetails",
              JSON.stringify(this.roomModaldata)
            ); */
            //  this._des.newEvent("restaurant_bill");

            /*  var data = document.getElementById("myMessageModal");
            html2canvas(data).then(canvas => {
              // Few necessary setting options
              var imgWidth = 208;
              var pageHeight = 295;
              var imgHeight = (canvas.height * imgWidth) / canvas.width;
              var heightLeft = imgHeight;

              const contentDataURL = canvas.toDataURL("image/png");
              let pdf = new jsPDF("p", "mm", "a4"); // A4 size page of PDF
              var position = 10;
              pdf.addImage(
                contentDataURL,
                "PNG",
                0,
                position,
                imgWidth,
                imgHeight
              );
              pdf.save("Order.pdf"); // Generated PDF
            });*/
            //var el = (<HTMLInputElement>document.getElementById('#myMessageModal'));
            // el.modal('show');
            //  this.alerts.setMessage('Recipe Added successfully!','success');
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

  roomPrintPay() {
    // console.log("uuyyuu", this.tableDetails);
    console.log("totalPrice", this.totalPrice);
    console.log("roomSaveData", this.roomOrderData);
    var intRegex = /^\d*$/;
    if (this.totalPrice == undefined) {
      this.alertSerive.create(
        "", //title
        "danger", //type
        20000, // time
        "Please Select a Dish First!" //body
      );
    } else if (!intRegex.test(this.roomOrderData.persons)) {
      this.alertSerive.create(
        "", //title
        "danger", //type
        20000, // time
        "Please Enter No of Persons!" //body
      );
    } else if (this.roomOrderData.roomId == "") {
      this.alertSerive.create(
        "", //title
        "danger", //type
        20000, // time
        "Please Select a Room!" //body
      );
    } else {
      var orderArr = [];
      for (var k in this.itemarr) {
        for (var i = 0; i < this.itemarr[k].noOfItem; i++) {
          orderArr.push({
            itemId: this.itemarr[k].itemId,
            noOfItem: "1",
            itemPrice: this.itemarr[k].itemFixedPrice,
            changed: "1",
          });
        }
      }
      //  var abss = JSON.parse(this.tableDetails);
      this.roomOrderData.taxAmount = this.textAmount.toString();
      this.roomOrderData.netAmount = this.totalPrice.toString();
      this.roomOrderData.totalAmount = this.grossAmount.toString();
      //  this.roomOrderData.roomId = this.grossAmount.roomId;
      // this.roomOrderData.discountType = this.discountradiotype;
      this.roomOrderData.typeValue = "saveprint";
      // this.roomOrderData.orderDetails = orderArr;
      this.roomOrderData.currencyId = "1";

      console.log("roomOrderData", this.roomOrderData);
      this.spinner.show();
      this.orderManagementService
        .addRoomOrder(this.roomOrderData)
        .subscribe((res) => {
          console.log("roomSaveData", this.roomOrderData);
          this.roomSaveData = res;
          if (this.roomSaveData.status == "Success") {
            console.log("add successfull", this.roomSaveData);
            //  this.alerts.setMessage('Recipe Added successfully!','success');
            this.restaurantBillDetails = this.roomSaveData.resObject;
            var resdata = this.restaurantBillDetails.orderDetails;
            var assoArr = {};
            console.log("resdata===", resdata);
            for (var i = 0; i < resdata.length; i++) {
              if (resdata[i].itemType == "Liquid") {
                this.isVisibleLiquidTable = true;
              }
              var infoarr = [];
              // this.orderDetails = resdata[i];
              var key = resdata[i]["itemId"] + "_" + resdata[i]["kotseqNo"];

              var tempArr = [];
              if (!assoArr[key]) {
                tempArr.push({
                  noOfItem: 1,
                  itemType: resdata[i]["itemType"],
                  descripition: resdata[i]["itemName"],
                  kotId: resdata[i]["kotId"],
                });

                assoArr[key] = tempArr[0];
              } else {
                var arr = assoArr[key];
                arr.noOfItem++;
                assoArr[key] = arr;
              }
            }
            for (var j in assoArr) {
              if (assoArr[j].itemType != "Liquid") {
                this.itemsavearr.push(assoArr[j]);
              } else {
                this.itemDrinkarr.push(assoArr[j]);
              }
            }

            // this.alertSerive.create(
            //   "", //title
            //   "success", //type
            //   5000, // time
            //   "Information Saved successfully!" //body
            // );
            this.roomOrderData = {
              counterId: "",
              invoiceId: "",
              persons: "",
              waiter: "",
              isDiscount: "N",
              restaurantId: this.residd,
              roomId: "",
              parcelId: "",
              txnDate: "",
              paymentModeId: "",
              netAmount: "",
              discountType: "",
              discountAmount: "",
              taxAmount: "",
              typeValue: "",
              taxId: "",
              totalAmount: "",
              currencyId: "",
              orderDetails: [],
              comment: "",
            };
            // this.ngOnInit();
            console.log("ppp777", this.itemsavearr);
            this.spinner.hide();
            var self = this;
            if (this.itemsavearr != undefined) {
              setTimeout(function () {
                var divContents = $("#itemprinttable").html();
                console.log("print receipt................", divContents);

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
                self._des.newEvent("restaurant_table_management");
              }, 2000);
            }
            this.itemarr = [];
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

  parcelPrintSave() {
    var intRegex = /^\d*$/;
    if (this.totalPrice == undefined) {
      this.alertSerive.create(
        "", //title
        "danger", //type
        20000, // time
        "Please Select a Dish First!" //body
      );
    } else if (!intRegex.test(this.roomOrderData.persons)) {
      this.alertSerive.create(
        "", //title
        "danger", //type
        20000, // time
        "Please Enter No of Persons!" //body
      );
    } else if (this.roomOrderData.parcelId == "") {
      this.alertSerive.create(
        "", //title
        "danger", //type
        20000, // time
        "Please Enter Parcel details!" //body
      );
    } else if (!intRegex.test(this.roomOrderData.parcelId)) {
      this.alertSerive.create(
        "", //title
        "danger", //type
        20000, // time
        "Please Enter Parcel in number!" //body
      );
    } else {
      //  console.log("uuyyuu", this.tableDetails);
      // var abss = JSON.parse(this.tableDetails);
      this.roomOrderData.taxAmount = this.textAmount.toString();
      this.roomOrderData.netAmount = this.totalPrice.toString();
      this.roomOrderData.totalAmount = this.grossAmount.toString();
      // this.roomOrderData.roomId = this.grossAmount.roomId;
      //  this.roomOrderData.discountType = this.discountradiotype;
      this.roomOrderData.typeValue = "payprint";
      this.roomOrderData.currencyId = "1";
      this.spinner.show();
      this.orderManagementService
        .addParcelOrder(this.roomOrderData)
        .subscribe((res) => {
          console.log("roomSaveData", this.roomOrderData);
          this.roomSaveData = res;
          if (this.roomSaveData.status == "Success") {
            console.log("add successfull", this.roomSaveData);

            this.restaurantBillDetails = this.roomSaveData.resObject;
            this.restaurantBillDetails["pagetype"] = "parcel";

            var resdata = this.restaurantBillDetails.orderDetails;
            var restaxdata = this.restaurantBillDetails.taxDetails;
            var assoArr = {};
            console.log("resdata===", resdata);
            for (var i = 0; i < resdata.length; i++) {
              if (resdata[i].itemType == "Liquid") {
                this.isVisibleLiquidTable = true;
              }
              var infoarr = [];
              // this.orderDetails = resdata[i];
              var key = resdata[i]["itemId"] + "_" + resdata[i]["kotseqNo"];

              var tempArr = [];
              if (!assoArr[key]) {
                tempArr.push({
                  noOfItem: 1,
                  itemType: resdata[i]["itemType"],
                  descripition: resdata[i]["itemName"],
                  itemFixedPrice: resdata[i]["itemPrice"],
                  itemPrice: resdata[i]["itemPrice"],
                  itemTaxAmout: resdata[i]["itemTaxAmout"],
                });

                assoArr[key] = tempArr[0];
              } else {
                var arr = assoArr[key];
                arr.noOfItem++;
                arr.itemPrice = arr.itemPrice * arr.noOfItem;
                arr.itemTaxAmout = arr.itemTaxAmout * arr.noOfItem;
                assoArr[key] = arr;
              }
            }
            for (var j in assoArr) {
              if (assoArr[j].itemType != "Liquid") {
                this.itemsavearr.push(assoArr[j]);
              } else {
                this.itemDrinkarr.push(assoArr[j]);
              }
            }

            // this.rescgst = this.restaurantBillDetails.orderDetails[0].cgst;
            // this.ressgst = this.restaurantBillDetails.orderDetails[0].sgst;

            // this.cgstAmount =
            //   (this.restaurantBillDetails.netAmount * this.rescgst) / 100;
            // this.sgstAmount =
            //   (this.restaurantBillDetails.netAmount * this.ressgst) / 100;

            for (var k in this.restaurantBillDetails.orderDetails) {
              if (
                this.restaurantBillDetails.orderDetails[k].itemType == "Liquid"
              ) {
                this.isVisibleLiquid = true;
                this.liquidQnty += 1;
                this.liquidNetAmount += this.restaurantBillDetails.orderDetails[
                  k
                ].itemPrice;
                this.lCgst = this.restaurantBillDetails.orderDetails[k].cgst;
                this.lSgst = this.restaurantBillDetails.orderDetails[k].sgst;
                this.lCgstAmount = (this.liquidNetAmount * this.lCgst) / 100;
                this.lSgstAmount = (this.liquidNetAmount * this.lSgst) / 100;
                this.lTaxAmount += this.restaurantBillDetails.orderDetails[
                  k
                ].itemTaxAmout;
              } else {
                this.iQnty += 1;
                this.iNetAmount += this.restaurantBillDetails.orderDetails[
                  k
                ].itemPrice;
                this.rescgst = this.restaurantBillDetails.orderDetails[k].cgst;
                this.ressgst = this.restaurantBillDetails.orderDetails[k].sgst;
                this.cgstAmount = (this.iNetAmount * this.rescgst) / 100;
                this.sgstAmount = (this.iNetAmount * this.ressgst) / 100;
                this.resTaxAmount += this.restaurantBillDetails.orderDetails[
                  k
                ].itemTaxAmout;
              }
            }
            var taxassoarr = {};
            for (var i = 0; i < restaxdata.length; i++) {
              var taxxnameid =
                restaxdata[i]["taxName"] + "_" + restaxdata[i]["itemTypeName"];
              var tempArr = [];
              if (!taxassoarr[taxxnameid]) {
                tempArr.push({
                  noOfItem: 1,
                  itemType: restaxdata[i]["itemTypeName"],
                  itemTaxName: restaxdata[i]["taxName"],
                  itemTaxPercentage: restaxdata[i]["taxPercentage"],
                  itemTypeName: restaxdata[i]["taxTypeName"],
                  itemTaxAmout: restaxdata[i]["taxAmount"],
                  itemfixedAmount: restaxdata[i]["taxAmount"],
                });

                taxassoarr[taxxnameid] = tempArr[0];
              } else {
                var arr = taxassoarr[taxxnameid];
                arr.noOfItem++;
                arr.itemTaxAmout =
                  arr.itemTaxAmout + restaxdata[i]["taxAmount"];
                taxassoarr[taxxnameid] = arr;
              }
            }
            var vegnonvegtaxarr = [];
            for (var j in taxassoarr) {
              if (taxassoarr[j].itemType != "Liquid") {
                vegnonvegtaxarr.push(taxassoarr[j]);
              } else {
                this.itemDrinktaxarr.push(taxassoarr[j]);
              }
            }
            var vegnonvegassoarr = {};
            for (var i = 0; i < vegnonvegtaxarr.length; i++) {
              console.log("arr calling==", i);
              var taxxname = vegnonvegtaxarr[i]["itemTaxName"];
              console.log("taxxname", taxxname);
              console.log("taxxname==", vegnonvegtaxarr[i]["itemTaxName"]);
              var tempArr = [];
              if (!vegnonvegassoarr[taxxname]) {
                tempArr.push({
                  noOfItem: 1,
                  itemTaxName: vegnonvegtaxarr[i]["itemTaxName"],
                  itemTaxPercentage: vegnonvegtaxarr[i]["itemTaxPercentage"],
                  itemTypeName: vegnonvegtaxarr[i]["itemTypeName"],
                  itemTaxAmout: vegnonvegtaxarr[i]["itemTaxAmout"],
                  itemfixedAmount: vegnonvegtaxarr[i]["itemTaxAmout"],
                });

                vegnonvegassoarr[taxxname] = tempArr[0];
              } else {
                var arr = vegnonvegassoarr[taxxname];

                arr.noOfItem++;
                arr.itemTaxAmout =
                  arr.itemTaxAmout + vegnonvegtaxarr[i]["itemTaxAmout"];
                vegnonvegassoarr[taxxname] = arr;
              }
            }
            for (var j in vegnonvegassoarr) {
              this.itemvegtaxarr.push(vegnonvegassoarr[j]);
            }
            console.log("vegnonvegtaxarr===", vegnonvegtaxarr);
            console.log("itemvegtaxarr===", this.itemvegtaxarr);
            console.log("itemDrinktaxarr===", this.itemDrinktaxarr);

            console.log("1===", this.iQnty);
            console.log("2===", this.iNetAmount);
            console.log("3===", this.rescgst);
            console.log("4===", this.cgstAmount);
            console.log("5===", this.liquidQnty);
            console.log("6===", this.liquidNetAmount);
            console.log("7===", this.lSgst);
            console.log("8===", this.lSgstAmount);

            console.log("www===", this.restaurantBillDetails);
            console.log("wwe===", typeof this.restaurantBillDetails);
            console.log("roomdata-===", this.itemarr);

            //  $("#billid").css("display", "block");
            this.spinner.hide();
            this.roomOrderData = {
              counterId: "",
              invoiceId: "",
              persons: "",
              waiter: "",
              isDiscount: "N",
              restaurantId: this.residd,
              roomId: "",
              parcelId: "",
              txnDate: "",
              paymentModeId: "",
              netAmount: "",
              discountType: "",
              discountAmount: "",
              taxAmount: "",
              typeValue: "",
              taxId: "",
              totalAmount: "",
              currencyId: "",
              orderDetails: [],
              comment: "",
            };

            var self = this;
            if (this.restaurantBillDetails != undefined) {
              setTimeout(function () {
                var divContents = $("#billresid").html();
                console.log("print receipt................", divContents);

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
                self._des.newEvent("restaurant_table_management");
              }, 2000);
            }

            //  console.log("roomModaldata", this.roomModaldata);
            // (<any>$("#myMessageModal")).modal("show");

            /* localStorage.setItem(
              "restaurantBillDetails",
              JSON.stringify(this.roomModaldata)
            ); */
            //  this._des.newEvent("restaurant_bill");

            /*  var data = document.getElementById("myMessageModal");
            html2canvas(data).then(canvas => {
              // Few necessary setting options
              var imgWidth = 208;
              var pageHeight = 295;
              var imgHeight = (canvas.height * imgWidth) / canvas.width;
              var heightLeft = imgHeight;

              const contentDataURL = canvas.toDataURL("image/png");
              let pdf = new jsPDF("p", "mm", "a4"); // A4 size page of PDF
              var position = 10;
              pdf.addImage(
                contentDataURL,
                "PNG",
                0,
                position,
                imgWidth,
                imgHeight
              );
              pdf.save("Order.pdf"); // Generated PDF
            });*/
            //var el = (<HTMLInputElement>document.getElementById('#myMessageModal'));
            // el.modal('show');
            //  this.alerts.setMessage('Recipe Added successfully!','success');
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

  parcelSave() {
    var intRegex = /^\d*$/;
    if (this.totalPrice == undefined) {
      this.alertSerive.create(
        "", //title
        "danger", //type
        20000, // time
        "Please Select a Dish First!" //body
      );
    } else if (!intRegex.test(this.roomOrderData.persons)) {
      this.alertSerive.create(
        "", //title
        "danger", //type
        20000, // time
        "Please Enter No of Persons!" //body
      );
    } else if (this.roomOrderData.parcelId == "") {
      this.alertSerive.create(
        "", //title
        "danger", //type
        20000, // time
        "Please Enter Parcel details!" //body
      );
    } else if (!intRegex.test(this.roomOrderData.parcelId)) {
      this.alertSerive.create(
        "", //title
        "danger", //type
        20000, // time
        "Please Enter Parcel in number!" //body
      );
    } else {
      //  console.log("uuyyuu", this.tableDetails);
      // var abss = JSON.parse(this.tableDetails);
      this.roomOrderData.taxAmount = this.textAmount.toString();
      this.roomOrderData.netAmount = this.totalPrice.toString();
      this.roomOrderData.totalAmount = this.grossAmount.toString();
      // this.roomOrderData.roomId = this.grossAmount.roomId;
      //  this.roomOrderData.discountType = this.discountradiotype;
      this.roomOrderData.typeValue = "save";
      this.roomOrderData.currencyId = "1";
      this.spinner.show();
      this.orderManagementService
        .addParcelOrder(this.roomOrderData)
        .subscribe((res) => {
          console.log("roomSaveData", this.roomOrderData);
          this.roomSaveData = res;
          if (this.roomSaveData.status == "Success") {
            console.log("add successfull", this.roomSaveData);
            //  this.alerts.setMessage('Recipe Added successfully!','success');
            this.alertSerive.create(
              "", //title
              "success", //type
              5000, // time
              "Information Saved successfully!" //body
            );
            this.roomOrderData = {
              counterId: "",
              invoiceId: "",
              persons: "",
              waiter: "",
              isDiscount: "N",
              restaurantId: this.residd,
              roomId: "",
              parcelId: "",
              txnDate: "",
              paymentModeId: "",
              netAmount: "",
              discountType: "",
              discountAmount: "",
              taxAmount: "",
              typeValue: "",
              taxId: "",
              totalAmount: "",
              currencyId: "",
              orderDetails: [],
              comment: "",
            };
            this.ngOnInit();
            this.itemarr = [];
            this.spinner.hide();

            //  this._des.newEvent("restaurant_table_management");
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

  parcelSavePrint() {
    var intRegex = /^\d*$/;
    if (this.totalPrice == undefined) {
      this.alertSerive.create(
        "", //title
        "danger", //type
        20000, // time
        "Please Select a Dish First!" //body
      );
    } else if (!intRegex.test(this.roomOrderData.persons)) {
      this.alertSerive.create(
        "", //title
        "danger", //type
        20000, // time
        "Please Enter No of Persons!" //body
      );
    } else if (this.roomOrderData.parcelId == "") {
      this.alertSerive.create(
        "", //title
        "danger", //type
        20000, // time
        "Please Enter Parcel details!" //body
      );
    } else if (!intRegex.test(this.roomOrderData.parcelId)) {
      this.alertSerive.create(
        "", //title
        "danger", //type
        20000, // time
        "Please Enter Parcel in number!" //body
      );
    } else {
      //  console.log("uuyyuu", this.tableDetails);
      // var abss = JSON.parse(this.tableDetails);
      this.roomOrderData.taxAmount = this.textAmount.toString();
      this.roomOrderData.netAmount = this.totalPrice.toString();
      this.roomOrderData.totalAmount = this.grossAmount.toString();
      // this.roomOrderData.roomId = this.grossAmount.roomId;
      //  this.roomOrderData.discountType = this.discountradiotype;
      this.roomOrderData.typeValue = "saveprint";
      // this.roomOrderData.orderDetails = orderArr;
      this.roomOrderData.currencyId = "1";

      console.log("roomOrderData", this.roomOrderData);
      this.spinner.show();
      this.orderManagementService
        .addParcelOrder(this.roomOrderData)
        .subscribe((res) => {
          console.log("roomSaveData", this.roomOrderData);
          this.roomSaveData = res;
          if (this.roomSaveData.status == "Success") {
            console.log("add successfull", this.roomSaveData);
            //  this.alerts.setMessage('Recipe Added successfully!','success');
            this.restaurantBillDetails = this.roomSaveData.resObject;
            var resdata = this.restaurantBillDetails.orderDetails;
            var assoArr = {};
            console.log("resdata===", resdata);
            for (var i = 0; i < resdata.length; i++) {
              if (resdata[i].itemType == "Liquid") {
                this.isVisibleLiquidTable = true;
              }
              var infoarr = [];
              // this.orderDetails = resdata[i];
              var key = resdata[i]["itemId"] + "_" + resdata[i]["kotseqNo"];

              var tempArr = [];
              if (!assoArr[key]) {
                tempArr.push({
                  noOfItem: 1,
                  itemType: resdata[i]["itemType"],
                  descripition: resdata[i]["itemName"],
                  kotId: resdata[i]["kotId"],
                });

                assoArr[key] = tempArr[0];
              } else {
                var arr = assoArr[key];
                arr.noOfItem++;
                assoArr[key] = arr;
              }
            }
            for (var j in assoArr) {
              if (assoArr[j].itemType != "Liquid") {
                this.itemsavearr.push(assoArr[j]);
              } else {
                this.itemDrinkarr.push(assoArr[j]);
              }
            }

            // this.alertSerive.create(
            //   "", //title
            //   "success", //type
            //   5000, // time
            //   "Information Saved successfully!" //body
            // );
            this.roomOrderData = {
              counterId: "",
              invoiceId: "",
              persons: "",
              waiter: "",
              isDiscount: "N",
              restaurantId: this.residd,
              roomId: "",
              parcelId: "",
              txnDate: "",
              paymentModeId: "",
              netAmount: "",
              discountType: "",
              discountAmount: "",
              taxAmount: "",
              typeValue: "",
              taxId: "",
              totalAmount: "",
              currencyId: "",
              orderDetails: [],
              comment: "",
            };
            this.ngOnInit();
            console.log("ppp777", this.itemsavearr);
            this.spinner.hide();
            var self = this;
            if (this.itemsavearr != undefined) {
              setTimeout(function () {
                var divContents = $("#itemprinttable").html();
                console.log("print receipt................", divContents);

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
                self._des.newEvent("restaurant_table_management");
              }, 2000);
            }
            this.itemarr = [];
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

  modalclick() {
    (<any>$("#myMessageModal")).modal("hide");
    this._des.newEvent("restaurant_table_management");
  }
  backtable() {
    this._des.newEvent("restaurant_table_management");
  }

  convertNumberToWords(amount) {
    var words = new Array();
    words[0] = "";
    words[1] = "One";
    words[2] = "Two";
    words[3] = "Three";
    words[4] = "Four";
    words[5] = "Five";
    words[6] = "Six";
    words[7] = "Seven";
    words[8] = "Eight";
    words[9] = "Nine";
    words[10] = "Ten";
    words[11] = "Eleven";
    words[12] = "Twelve";
    words[13] = "Thirteen";
    words[14] = "Fourteen";
    words[15] = "Fifteen";
    words[16] = "Sixteen";
    words[17] = "Seventeen";
    words[18] = "Eighteen";
    words[19] = "Nineteen";
    words[20] = "Twenty";
    words[30] = "Thirty";
    words[40] = "Forty";
    words[50] = "Fifty";
    words[60] = "Sixty";
    words[70] = "Seventy";
    words[80] = "Eighty";
    words[90] = "Ninety";
    amount = amount.toString();
    var atemp = amount.split(".");
    var number = atemp[0].split(",").join("");
    var n_length = number.length;
    var words_string = "";
    if (n_length <= 9) {
      var n_array = [0, 0, 0, 0, 0, 0, 0, 0, 0];
      var received_n_array = new Array();
      for (var i = 0; i < n_length; i++) {
        received_n_array[i] = number.substr(i, 1);
      }
      for (var i = 9 - n_length, j = 0; i < 9; i++, j++) {
        n_array[i] = received_n_array[j];
      }
      for (var i = 0, j = 1; i < 9; i++, j++) {
        if (i == 0 || i == 2 || i == 4 || i == 7) {
          if (n_array[i] == 1) {
            n_array[j] = 10 + parseInt(n_array[j].toString());
            n_array[i] = 0;
          }
        }
      }
      var value: number;
      for (var i = 0; i < 9; i++) {
        if (i == 0 || i == 2 || i == 4 || i == 7) {
          value = n_array[i] * 10;
        } else {
          value = n_array[i];
        }
        if (value != 0) {
          words_string += words[value] + " ";
        }
        if (
          (i == 1 && value != 0) ||
          (i == 0 && value != 0 && n_array[i + 1] == 0)
        ) {
          words_string += "Crores ";
        }
        if (
          (i == 3 && value != 0) ||
          (i == 2 && value != 0 && n_array[i + 1] == 0)
        ) {
          words_string += "Lakhs ";
        }
        if (
          (i == 5 && value != 0) ||
          (i == 4 && value != 0 && n_array[i + 1] == 0)
        ) {
          words_string += "Thousand ";
        }
        if (
          i == 6 &&
          value != 0 &&
          n_array[i + 1] != 0 &&
          n_array[i + 2] != 0
        ) {
          words_string += "Hundred and ";
        } else if (i == 6 && value != 0) {
          words_string += "Hundred ";
        }
      }
      words_string = words_string.split("  ").join(" ");
    }
    return words_string;
  }
  convertIndex() {
    this.ival += 1;
    console.log("ival===", this.ival);
    return this.ival;
  }
  convertIndexval() {
    this.jval += 1;
    return this.jval;
  }
  openTabmenu(pageName) {
    var tabcontent = document.getElementsByClassName("tabcontent");
    var element = document.getElementById("subscribeLi");

    if (pageName == "room") {
      this.isVisibleRoom = true;
      this.isVisibleParcel = false;

      this.isActiveRoom = true;
      this.isActiveParcel = false;

      this.pageTitle = "Room Management";
      this.tabtitle = "Room";
      this.tabno = "";

      $(".roombtn").show();
      $(".parcelbtn").hide();
      $("#roombtnid").css(
        "border-bottom: 2px solid #ea1d02;padding-bottom: 2px;"
      );

      this.itemarr = [];
      this.totalPrice = 0;
      this.sudototalPrice = 0;
      this.textAmount = 0;
      this.grossAmount = 0;
      //this.tableOrderNo = resobjtdata.invoiceId;
      this.roomOrderData.counterId = "";
      this.roomOrderData.persons = "";
      this.roomOrderData.waiter = "";
      this.roomOrderData.roomId = "";
      this.roomOrderData.parcelId = "";
    }
    if (pageName == "parcel") {
      $("#parcelbtnid").css(
        "border-bottom: 2px solid #ea1d02;padding-bottom: 2px;"
      );
      this.pageTitle = "Parcel Management";
      this.tabtitle = "Parcel";
      this.tabno = "";
      this.isVisibleRoom = false;
      this.isVisibleParcel = true;

      this.isActiveRoom = false;
      this.isActiveParcel = true;

      $(".roombtn").hide();
      $(".parcelbtn").show();
      this.itemarr = [];
      this.totalPrice = 0;
      this.sudototalPrice = 0;
      this.textAmount = 0;
      this.grossAmount = 0;
      //this.tableOrderNo = resobjtdata.invoiceId;
      this.roomOrderData.counterId = "";
      this.roomOrderData.persons = "";
      this.roomOrderData.waiter = "";
      this.roomOrderData.parcelId = "";
      this.roomOrderData.roomId = "";
    }
  }
  parcelType(ev) {
    this.tabno = ev.target.value;
  }
}
