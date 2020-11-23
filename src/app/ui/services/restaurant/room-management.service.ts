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
export class RoomManagementService {
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

  getCategoryList(catid) {
    let servUrl = this.configService.getConfig().baseUrl;
    let counterUrl =
      servUrl + "categoryCtrl/getAllCategoryByType?categoryType=" + catid;
    console.log("counterUrl==" + counterUrl);
    return this._http.get(counterUrl).pipe(
      map((res) => res),
      catchError(this.errorHandler)
    );
  }
  getAllItemByCategory(categoryId) {
    let servUrl = this.configService.getConfig().baseUrl;
    let counterUrl =
      servUrl + "categoryCtrl/getAllItemByCategory?categoryId=" + categoryId;
    console.log("counterUrl==" + counterUrl);
    return this._http.get(counterUrl).pipe(
      map((res) => res),
      catchError(this.errorHandler)
    );
  }
  getAllTaxType() {
    let servUrl = this.configService.getConfig().baseUrl;
    let counterUrl = servUrl + "purchaseCtrl/getAllTaxType";
    console.log("counterUrl==" + counterUrl);
    return this._http.get(counterUrl).pipe(
      map((res) => res),
      catchError(this.errorHandler)
    );
  }
  getAllPaymentMode() {
    let servUrl = this.configService.getConfig().baseUrl;
    let counterUrl = servUrl + "purchaseCtrl/getAllPaymentMode";
    console.log("counterUrl==" + counterUrl);
    return this._http.get(counterUrl).pipe(
      map((res) => res),
      catchError(this.errorHandler)
    );
  }
  addRoomOrder(roomData) {
    console.log("roomData", roomData);
    let servUrl = this.configService.getConfig().baseUrl;
    let counterUrl = servUrl + "bookingCtrl/addOrderBooking";
    console.log("counterUrl==" + counterUrl);
    return this._http
      .post(counterUrl, {
        counterId: roomData.counterId,
        restaurantId: roomData.restaurantId,
        tableId: roomData.tableId,
        noOfPerson: roomData.persons,
        waiterName: roomData.waiter,
        isDiscount: roomData.isDiscount,
        paymentModeId: roomData.paymentModeId,
        netAmount: roomData.netAmount,
        discountAmount: roomData.discountAmount,
        discountType: roomData.discountType,
        currencyId: roomData.currencyId,
        taxAmount: roomData.taxId,
        totalAmount: roomData.totalAmount,
        typeValue: roomData.typeValue,
        orderType: "Modify",
        orderDetails: roomData.orderDetails,
        orderTypeId: 1,
        tableBookingId: roomData.tableBookingId,
        comment: roomData.comment,
      })
      .pipe(
        map((res) => res),
        catchError(this.errorHandler)
      );
  }
  getTableInfo(invoiceId) {
    let servUrl = this.configService.getConfig().baseUrl;
    let counterUrl =
      servUrl +
      "bookingCtrl/getTableTransactionInformation?invoiceId=" +
      invoiceId;
    console.log("counterUrl==" + counterUrl);
    return this._http.get(counterUrl).pipe(
      map((res) => res),
      catchError(this.errorHandler)
    );
  }

  getTableBackStatus(restaurantId, tableId, tableBookingId, tableStatus) {
    let servUrl = this.configService.getConfig().baseUrl;
    let counterUrl =
      servUrl +
      "tableCtrl/changeTableStatusByBackBtn?restaurantId=" +
      restaurantId +
      "&tableId=" +
      tableId +
      "&tableBookingId=" +
      tableBookingId +
      "&tableStatus=" +
      tableStatus;
    console.log("counterUrl==" + counterUrl);
    return this._http.post(counterUrl, {}).pipe(
      map((res) => res),
      catchError(this.errorHandler)
    );
  }
  getCategoryMaster() {
    let servUrl = this.configService.getConfig().baseUrl;
    let counterUrl = servUrl + "categoryCtrl/getAllCategoryTypeMst";
    console.log("counterUrl==" + counterUrl);
    return this._http.get(counterUrl).pipe(
      map((res) => res),
      catchError(this.errorHandler)
    );
  }
}
