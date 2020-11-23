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

import { PrimaryCategoryFoodService } from "../../services/restaurant/primary-category-food.service";
import { RouteParameterService } from "../../../shared/route.parameter.service";
import { IcateGoryFood } from "./categoryFoodList";
import moment from "moment";
import * as jsPDF from "jspdf";
import html2canvas from "html2canvas";
import * as $ from "jquery";
import * as XLSX from "xlsx";
import { Ng4LoadingSpinnerService } from "ng4-loading-spinner";

import { AlertService } from "../../../shared/modules/alert/services/alert.service";

@Component({
  selector: "app-restaurant-primary-category-food",
  templateUrl: "./restaurant-primary-category-food.component.html",
  styleUrls: ["./restaurant-primary-category-food.component.scss"],
})
export class RestaurantPrimaryCategoryFoodComponent implements OnInit {
  bsConfigStart: Partial<BsDatepickerConfig>;
  bsConfigEnd: Partial<BsDatepickerConfig>;

  popoverMessage = "Do you want to delete ?";
  popoverTitle = "Record delete confirmation";

  popoverMessage2 = "Do you want to proceed?";
  popoverTitle2 = "";
  confirmText1: string = "Yes";
  cancelText1: string = "No";

  // scrollBarContainerHeight: number;
  quickReservationModalRef: BsModalRef;

  public categoryList = [];
  public categoryAcordinList:any;
  categoryCount: any;
  private popoverIndex: number;
  categoryFoodType = { categoryDescription: "", categotytype: "" };
  categorySaveData: any;
  public now: number;
  cancelClicked = true;
  deleteres: any;
  categoryMstList: any;

  @ViewChild(PerfectScrollbarComponent)
  componentRef?: PerfectScrollbarComponent;
  public config: PerfectScrollbarConfigInterface = {};
  scrollBarContainerHeight: number = 0;
  @ViewChildren(PopoverDirective) popupref: QueryList<PopoverDirective>;
  @ViewChild("table") table: ElementRef;

  constructor(
    private router: Router,
    private primaryCategoryFoodService: PrimaryCategoryFoodService,
    private modalService: BsModalService,
    private routeParamService: RouteParameterService,
    private alertSerive: AlertService,
    private spinner: Ng4LoadingSpinnerService
  ) {}

  ngOnInit() {
    this.spinner.show();
    this.primaryCategoryFoodService.getCategoryList().subscribe((res) => {
      console.log("res: ", res);
      this.categoryList = res["resObject"];
      this.categoryCount = res;
      var acc=[];
      var glblcategory='';
      for(var k in this.categoryList){
        glblcategory = this.categoryList[k].categoryTypeName;
        
         if(this.categoryList[k].categoryTypeName  && !acc[glblcategory]){
         acc[glblcategory] = [];
         }
        
         acc[glblcategory].push({categoryId:this.categoryList[k].categoryId,categoryDescription:this.categoryList[k].categoryDescription,categoryTypeId:this.categoryList[k].categoryTypeId,categoryTypeName:glblcategory});
        
      }
      
      console.log("ACC",acc);
      console.log("acod",typeof this.categoryList);
      console.log("acod",typeof this.categoryAcordinList);
      console.log("categoryAcordinList",this.categoryAcordinList);
      this.spinner.hide();
      console.log("categoryList", this.categoryList);
      var finalacc = [];
      for(var k in acc){
        console.log("kkk",k);
        console.log("category", acc[k]);
        finalacc.push({type:k,category:acc[k]});
      }
      this.categoryAcordinList = finalacc;
      console.log("finalacc",finalacc);
      console.log("finalaccacod",typeof finalacc);
    });
    this.now = Date.now();
    setInterval(() => {
      this.now = Date.now();
    }, 1000);
    this.categoryMaster();

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
    this.primaryCategoryFoodService.getCategoryMaster().subscribe((res) => {
      console.log("res: ", res);
      this.categoryMstList = res["resObject"];
      console.log("categoryMstList", this.categoryMstList);
    });
  }
  addCategoryFoodType() {
    if (this.categoryFoodType.categoryDescription == "") {
      this.alertSerive.create(
        "", //title
        "danger", //type
        20000, // time
        "Please Enter a Category Description !" //body
      );
    } else if (this.categoryFoodType.categotytype == "") {
      this.alertSerive.create(
        "", //title
        "danger", //type
        20000, // time
        "Please Select a Category Type !" //body
      );
    } else {
      console.log("addCategoryFoodType old", this.categoryFoodType);
      this.spinner.show();
      this.primaryCategoryFoodService
        .addCategoryFood(this.categoryFoodType)
        .subscribe((res) => {
          console.log("addCategoryFoodType", this.categoryFoodType);
          this.categorySaveData = res;
          if (this.categorySaveData.status == "Success") {
            // this.alerts.setMessage('Food Category Added successfully!','success');
            this.spinner.hide();
            this.alertSerive.create(
              "", //title
              "success", //type
              5000, // time
              "Information Saved Successfully!" //body
            );
            this.ngOnInit();
            this.categoryFoodType = {
              categoryDescription: "",
              categotytype: "",
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
  }
  clearSearch() {
    this.categoryFoodType = { categoryDescription: "", categotytype: "" };
  }

  deleteCategories(categoryid) {
    this.spinner.show();
    this.primaryCategoryFoodService
      .deleteCategoryFood(categoryid)
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
