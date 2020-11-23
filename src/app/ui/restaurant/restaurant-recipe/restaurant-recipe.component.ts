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

import { RecipeService } from "../../services/restaurant/recipe.service";
import { RouteParameterService } from "../../../shared/route.parameter.service";
import { IRestaurantRecipe } from "./recipeList";
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
  selector: "app-restaurant-recipe",
  templateUrl: "./restaurant-recipe.component.html",
  styleUrls: ["./restaurant-recipe.component.scss"],
})
export class RestaurantRecipeComponent implements OnInit {
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

  quickReservationModalRef: BsModalRef;

  public recipeList: IRestaurantRecipe[];
  public recipeListLength: any;
  private popoverIndex: number;
  recipeData = {
    category: "",
    menuType: "",
    comments: "",
    price: "",
    itemMastId: 0,
    categoryItemMapId: 0,
  };
  recipeCategoryMaster: any;
  recipeMenuTypeMaster: any;
  recipeSaveData: any;
  public now: number;
  cancelClicked = true;
  deleteres: any;

  @ViewChildren(PopoverDirective) popupref: QueryList<PopoverDirective>;
  @ViewChild("table") table: ElementRef;

  @ViewChild(PerfectScrollbarComponent)
  componentRef?: PerfectScrollbarComponent;

  scrollBarContainerHeight: number = 0;
  //template: string = `<img src="http://pa1.narvii.com/5722/2c617cd9674417d272084884b61e4bb7dd5f0b15_hq.gif" />`;

  constructor(
    private router: Router,
    private recipeService: RecipeService,
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
    this.recipeService.getRecipeList().subscribe((res) => {
      console.log("res: ", res);
      this.rawBookingList = res["resObject"];
      this.recipeList = [...this.rawBookingList];
      this.paginateBookingList = this.recipeList.slice(0, this.pageItems);
      this.currentPage = 1;
      this.searchRequest = false;
      if (this.paginateBookingList.length > 4) {
        this.recipeListLength = this.paginateBookingList.length - 2;
      } else {
        this.recipeListLength = 5;
      }
      this.spinner.hide();
      console.log("recipeList", this.recipeList);
    });
    this.categoryMaster();
    this.menuTypeMaster();
    this.now = Date.now();
    setInterval(() => {
      this.now = Date.now();
    }, 1000);
     /* pagination */
     this.searchRequest = false;
    
     this.searchedBookingSrcItem = {
       sourceId: "0",
       sourceName: "All",
       sourceType: null
   };
   this.searchedBookingStatus = "All";
   this.disableConfirmUnconfirm = true;

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
  categoryMaster() {
    this.recipeService.getAllCatergoryList().subscribe((res) => {
      console.log("res: ", res);
      this.recipeCategoryMaster = res["resObject"];
      console.log("recipeCategoryMaster", this.recipeCategoryMaster);
    });
  }
  menuTypeMaster() {
    this.recipeService.getAllMenutypeList().subscribe((res) => {
      console.log("res: ", res);
      this.recipeMenuTypeMaster = res["resObject"];
      console.log("recipeMenuTypeMaster", this.recipeMenuTypeMaster);
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
  this.recipeList = this.rawBookingList.filter((bookingItem: any) =>
  bookingItem.date && bookingItem.date.toLowerCase().includes(filterText.toLowerCase())
      || bookingItem.categoryDescription && bookingItem.categoryDescription.toLowerCase().includes(filterText.toLowerCase())
      || bookingItem.price && bookingItem.price.toString().toLowerCase().includes(filterText.toLowerCase())
      || bookingItem.itemType && bookingItem.itemType.toLowerCase().includes(filterText.toLowerCase())
      || bookingItem.itemDescription && bookingItem.itemDescription.toLowerCase().includes(filterText.toLowerCase())
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
  this.paginateBookingList = this.recipeList == null ? [] : this.recipeList.slice(startItem, endItem);
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
    const tableHeading = 'Recipe Desk';
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

  recipeAdd() {
    var intRegex = /^\d*$/;
    if (this.recipeData.category == "") {
      this.alertSerive.create(
        "", //title
        "danger", //type
        20000, // time
        "Please Select a Category!" //body
      );
    } else if (this.recipeData.menuType == "") {
      this.alertSerive.create(
        "", //title
        "danger", //type
        20000, // time
        "Please Select a Menu!" //body
      );
    } else if (this.recipeData.comments == "") {
      this.alertSerive.create(
        "", //title
        "danger", //type
        20000, // time
        "Please Enter Description!" //body
      );
    } else if (this.recipeData.price == "") {
      this.alertSerive.create(
        "", //title
        "danger", //type
        20000, // time
        "please Enter Price!" //body
      );
    } else if (!intRegex.test(this.recipeData.price)) {
      this.alertSerive.create(
        "", //title
        "danger", //type
        20000, // time
        "Please Enter Only Numbers in Price Section!" //body
      );
    } else {
      console.log("recipeData old", this.recipeData);

      if (this.recipeData.itemMastId == 0) {
        this.spinner.show();
        this.recipeService
          .addRecipeDetails(this.recipeData)
          .subscribe((res) => {
            console.log("recipeData", this.recipeData);
            this.recipeSaveData = res;
            if (this.recipeSaveData.status == "Success") {
              console.log("add successfull");
              //  this.alerts.setMessage('Recipe Added successfully!','success');
              this.spinner.hide();
              this.alertSerive.create(
                "", //title
                "success", //type
                5000, // time
                "Information Saved Successfully!" //body
              );
              this.recipeData = {
                category: "",
                menuType: "",
                comments: "",
                price: "",
                itemMastId: 0,
                categoryItemMapId: 0,
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
      } else if (this.recipeData.itemMastId > 0) {
        this.spinner.show();
        this.recipeService
          .editRecipeDetails(this.recipeData)
          .subscribe((res) => {
            console.log("recipeData", this.recipeData);
            this.recipeSaveData = res;
            if (this.recipeSaveData.status == "Success") {
              console.log("add successfull");
              //  this.alerts.setMessage('Recipe Added successfully!','success');
              this.spinner.hide();
              this.alertSerive.create(
                "", //title
                "success", //type
                5000, // time
                "Information Updated Successfully!" //body
              );
              this.recipeData = {
                category: "",
                menuType: "",
                comments: "",
                price: "",
                itemMastId: 0,
                categoryItemMapId: 0,
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
    this.recipeData = {
      category: "",
      menuType: "",
      comments: "",
      price: "",
      itemMastId: 0,
      categoryItemMapId: 0,
    };
  }
  deleteRecipe(recipeId) {
    this.spinner.show();
    this.recipeService.deleteRecipe(recipeId).subscribe((res) => {
      console.log("res: ", res);
      this.deleteres = res;
      if (this.deleteres.status == "Success") {
        this.ngOnInit();
        this.spinner.hide();
        this.alertSerive.create(
          "", //title
          "danger", //type
          5000, // time
          "Information deleted successfully!" //body
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

  editRecipe(data) {
    console.log("data", data);

    this.recipeData.category = data.categoryId;
    this.recipeData.menuType = data.menuTypeId;
    this.recipeData.comments = data.itemDescription;
    this.recipeData.price = data.price;
    this.recipeData.itemMastId = data.itemMastId;
    this.recipeData.categoryItemMapId = data.categoryItemMapId;

    console.log("recipeData", this.recipeData);
  }
}
