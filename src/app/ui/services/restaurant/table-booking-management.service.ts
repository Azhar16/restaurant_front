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
export class TableBookingManagementService {
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

  getBookingList() {
    let servUrl = this.configService.getConfig().baseUrl;
    var residd = localStorage.getItem("isCurrentRestaurantId");
    let counterUrl =
      servUrl + "bookingCtrl/getAllBookingAllocation?restaurantId=" + residd;
    console.log("counterUrl==" + counterUrl);
    return this._http.get(counterUrl).pipe(
      map((res) => res),
      catchError(this.errorHandler)
    );
  }
  getRestaurantType() {
    let servUrl = this.configService.getConfig().baseUrl;
    let counterUrl = servUrl + "restaurantCtrl/getAllRestaurant";
    console.log("counterUrl==" + counterUrl);
    return this._http.get(counterUrl).pipe(
      map((res) => res),
      catchError(this.errorHandler)
    );
  }
  getTableByRestaurant() {
    let servUrl = this.configService.getConfig().baseUrl;
    let counterUrl = servUrl + "tableCtrl/getTableMstByRestaurant";
    console.log("counterUrl==" + counterUrl);
    return this._http.get(counterUrl).pipe(
      map((res) => res),
      catchError(this.errorHandler)
    );
  }
  getTableList() {
    let servUrl = this.configService.getConfig().baseUrl;
    var residd = localStorage.getItem("isCurrentRestaurantId");
    let counterUrl =
      servUrl + "tableCtrl/getTableMstByRestaurant?restaurantId=" + residd;
    console.log("counterUrl==" + counterUrl);
    return this._http.get(counterUrl).pipe(
      map((res) => res),
      catchError(this.errorHandler)
    );
  }
  deleteBooking(bookingId) {
    let servUrl = this.configService.getConfig().baseUrl;
    let counterUrl =
      servUrl + "bookingCtrl/deleteBookingAllocation?bookingId=" + bookingId;
    console.log("counterUrl==" + counterUrl);
    return this._http.post(counterUrl, {}).pipe(
      map((res) => res),
      catchError(this.errorHandler)
    );
  }
  addBookngDetals(bookingData) {
    let servUrl = this.configService.getConfig().baseUrl;
    let counterUrl = servUrl + "bookingCtrl/addBooking";
    console.log("counterUrl==" + counterUrl);
    return this._http
      .post(counterUrl, {
        restaurantId: bookingData.restaurantId,
        tableId: bookingData.tableId,
        guestName: bookingData.guestName,
        guestPhoneNo: bookingData.guestPhoneNo,
        hotelRoomNum: bookingData.hotelRoomNum,
        bookingStartDate: bookingData.bookingStartDate,
        bookingEndDate: bookingData.bookingEndDate,
        bookingStartTime: bookingData.bookingStartTime,
        bookingEndTime: bookingData.bookingEndTime,
        bookingStartTime1: bookingData.bookingStartTime1,
        bookingEndTime1: bookingData.bookingEndTime1,
        bookingStatusId: "R",
      })
      .pipe(
        map((res) => res),
        catchError(this.errorHandler)
      );
  }
  editBookngDetails(bookingData) {
    let servUrl = this.configService.getConfig().baseUrl;
    let counterUrl = servUrl + "bookingCtrl/addBooking";
    console.log("counterUrl==" + counterUrl);
    return this._http
      .post(counterUrl, {
        restaurantId: bookingData.restaurantId,
        tableId: bookingData.tableId,
        guestName: bookingData.guestName,
        guestPhoneNo: bookingData.guestPhoneNo,
        hotelRoomNum: bookingData.hotelRoomNum,
        bookingStartDate: bookingData.bookingStartDate,
        bookingEndDate: bookingData.bookingEndDate,
        bookingStartTime: bookingData.bookingStartTime,
        bookingEndTime: bookingData.bookingEndTime,
        bookingStartTime1: bookingData.bookingStartTime1,
        bookingEndTime1: bookingData.bookingEndTime1,
        bookingStatusId: "R",
        bookingAllocId: bookingData.bookingAllocationId,
        guestId: bookingData.guestId,
      })
      .pipe(
        map((res) => res),
        catchError(this.errorHandler)
      );
  }
}
