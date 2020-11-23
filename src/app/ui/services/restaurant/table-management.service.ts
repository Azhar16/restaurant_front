import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { throwError, forkJoin, Observable, of } from "rxjs";
import { map, catchError } from "rxjs/operators";

import { environment } from "../../../../environments/environment";
import { UserResolver } from "../../../shared/user.resolver.service";

import { ConfigService } from "../../../config.service";

@Injectable({
  providedIn: "root",
})
export class TableManagementService {
  userHotelID: String;

  constructor(
    private _userResolver: UserResolver,
    private _http: HttpClient,
    public configService: ConfigService
  ) {
    this.userHotelID = this._userResolver.getHotelID();
  }

  errorHandler(errorRes: Response) {
    console.log("error: ", errorRes, errorRes.status);
    return throwError(errorRes);
  }

  getTableList() {
    let servUrl = this.configService.getConfig().baseUrl;
    var residd = localStorage.getItem("isCurrentRestaurantId");
    let counterUrl =
      servUrl + "tableCtrl/getTableByRestaurant?restaurantId=" + residd;
    console.log("counterUrl==" + counterUrl);
    return this._http.get(counterUrl).pipe(
      map((res) => res),
      catchError(this.errorHandler)
    );
  }

  addStatus(tableData) {
    console.log("tabledatt", tableData);
    let servUrl = this.configService.getConfig().baseUrl;
    let counterUrl =
      servUrl +
      "bookingCtrl/changeTableStatus?setStatus=" +
      tableData.setStatus +
      "&getStatus=" +
      tableData.status +
      "&tableId=" +
      tableData.tableid +
      "&restaurantId=" +
      tableData.restaurantId +
      "&tableBookingId=" +
      tableData.tableBookingId;
    console.log("counterUrl==" + counterUrl);
    return this._http.post(counterUrl, {}).pipe(
      map((res) => res),
      catchError(this.errorHandler)
    );
  }

  getTableInformation(tableid) {
    let servUrl = this.configService.getConfig().baseUrl;
    let counterUrl =
      servUrl + "tableCtrl/getTableInformation?tableId=" + tableid;
    console.log("counterUrl==" + counterUrl);
    return this._http.get(counterUrl).pipe(
      map((res) => res),
      catchError(this.errorHandler)
    );
  }
  addTable(restaurantId) {
    let servUrl = this.configService.getConfig().baseUrl;
    let counterUrl =
      servUrl + "tableCtrl/addTable?restaurantId=" + restaurantId;
    console.log("counterUrl==" + counterUrl);
    return this._http.post(counterUrl, {}).pipe(
      map((res) => res),
      catchError(this.errorHandler)
    );
  }

  deleteTableinfo(tableId) {
    let servUrl = this.configService.getConfig().baseUrl;
    let counterUrl = servUrl + "tableCtrl/deleteTable?tableId=" + tableId;
    console.log("counterUrl==" + counterUrl);
    return this._http.post(counterUrl, {}).pipe(
      map((res) => res),
      catchError(this.errorHandler)
    );
  }
  checkCounterStatus(restaurantId, cdate) {
    let servUrl = this.configService.getConfig().baseUrl;
    let counterUrl =
      servUrl +
      "counterCtrl/checkCounterOpenorNot?restaurantId=" +
      restaurantId +
      "&date=" +
      cdate;
    console.log("counterUrl==" + counterUrl);
    return this._http.get(counterUrl).pipe(
      map((res) => res),
      catchError(this.errorHandler)
    );
  }
}
