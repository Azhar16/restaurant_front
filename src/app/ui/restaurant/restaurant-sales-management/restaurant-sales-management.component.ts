import { Component, OnInit } from "@angular/core";
import { BsDatepickerConfig } from "ngx-bootstrap/datepicker";

@Component({
  selector: "app-restaurant-sales-management",
  templateUrl: "./restaurant-sales-management.component.html",
  styleUrls: ["./restaurant-sales-management.component.scss"]
})
export class RestaurantSalesManagementComponent implements OnInit {
  public salesObject: any;

  public bsValueStart: Date;
  public bsValueEnd: Date;

  public bsConfigStart: Partial<BsDatepickerConfig>;
  public bsConfigEnd: Partial<BsDatepickerConfig>;
  constructor() {}

  ngOnInit() {
    this.bsConfigEnd = Object.assign(
      {},
      {
        containerClass: "theme-blue",
        dateInputFormat: "DD-MMM-YYYY",
        // minDate: new Date(),
        showWeekNumbers: false
      }
    );
  }
}
