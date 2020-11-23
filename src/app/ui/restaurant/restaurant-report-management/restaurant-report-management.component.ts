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

import { TableBookingManagementService } from "../../services/restaurant/table-booking-management.service";
import { RouteParameterService } from "../../../shared/route.parameter.service";

import moment from "moment";
import * as jsPDF from "jspdf";
import html2canvas from "html2canvas";
import * as $ from "jquery";
import * as XLSX from "xlsx";
import { AlertService } from "../../../shared/modules/alert/services/alert.service";
//import { IDropdownSettings } from "ng-multiselect-dropdown";
import { Ng4LoadingSpinnerService } from "ng4-loading-spinner";

@Component({
  selector: 'app-restaurant-report-management',
  templateUrl: './restaurant-report-management.component.html',
  styleUrls: ['./restaurant-report-management.component.scss']
})
export class RestaurantReportManagementComponent implements OnInit {

  bsConfigStart: Partial<BsDatepickerConfig>;
  bsConfigEnd: Partial<BsDatepickerConfig>;

  popoverMessage = "Do you want to delete ?";
  popoverTitle = "Record delete confirmation";

  popoverMessage1 = "Do you want to proceed?";
  popoverTitle1 = "";
  confirmText = "Yes";
  cancelText = "No";

  //  scrollBarContainerHeight: number;
  quickReservationModalRef: BsModalRef;

  reprtRestaurantMaster:any;
  private popoverIndex: number;
  reportData = {
    restaurantId: "",
    startDate: "",
    endDate: "",
    reportType: "",
    filer:""
  };
  reportRestaurantMaster: any;
  reportSaveData: any;
  public now: number;
  tableList: any;

  cancelClicked = true;

  dropdownList = [];
  selectedItems = [];
  dropdownSettings = {};
  requiredField: boolean = false;
  deleteres: any;

  @ViewChild(PerfectScrollbarComponent)
  componentRef?: PerfectScrollbarComponent;
  public config: PerfectScrollbarConfigInterface = {};
  scrollBarContainerHeight: number = 0;
  @ViewChildren(PopoverDirective) popupref: QueryList<PopoverDirective>;
  @ViewChild("table") table: ElementRef;
  constructor(
    private router: Router,
    private tableBookingManagementService: TableBookingManagementService,
    private modalService: BsModalService,
    private routeParamService: RouteParameterService,
    private alertSerive: AlertService,
    private spinner: Ng4LoadingSpinnerService
  ) {}

  ngOnInit() {
    
    this.restaurantMaster();
    this.tableMaster();

    // this.tableMaster();
    var dformat = localStorage.getItem("isCurrentDateformat");
    this.reportData.startDate = moment().format(dformat);
    this.reportData.endDate = moment().format(dformat);
    this.bsConfigEnd = Object.assign(
      {},
      {
        containerClass: "theme-blue",
        dateInputFormat: "DD-MMM-YYYY",
        minDate: new Date(),
        showWeekNumbers: false,
      }
    );
    this.now = Date.now();
    setInterval(() => {
      this.now = Date.now();
    }, 1000);

    
  }
  tableMaster() {
    this.tableBookingManagementService.getTableList().subscribe((res) => {
      console.log("res: ", res);
      this.tableList = res["resObject"];
      this.dropdownList = res["resObject"];
      console.log("tableList", this.tableList);
    });
  }
  restaurantMaster() {
    this.tableBookingManagementService.getRestaurantType().subscribe((res) => {
      console.log("res: ", res);
      this.reprtRestaurantMaster = res["resObject"];
      console.log("reprtRestaurantMaster", this.reprtRestaurantMaster);
    });
  }
  




}
