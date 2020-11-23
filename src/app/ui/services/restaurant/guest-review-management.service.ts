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
export class GuestReviewManagementService {
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

  getGuestReviewList() {
    let servUrl = this.configService.getConfig().baseUrl;
    let counterUrl = servUrl + "guestCtrl/getAllGuestReview";
    console.log("counterUrl==" + counterUrl);
    return this._http.get(counterUrl).pipe(
      map((res) => res),
      catchError(this.errorHandler)
    );
  }
  getAllReviewType() {
    let servUrl = this.configService.getConfig().baseUrl;
    let counterUrl = servUrl + "guestCtrl/getAllReviewType";
    console.log("counterUrl==" + counterUrl);
    return this._http.get(counterUrl).pipe(
      map((res) => res),
      catchError(this.errorHandler)
    );
  }

  getMasterTable() {
    let servUrl = this.configService.getConfig().baseUrl;
    var resid = localStorage.getItem("isCurrentRestaurantId");
    let counterUrl =
      servUrl + "tableCtrl/getTableMstByRestaurant?restaurantId=" + resid;
    console.log("counterUrl==" + counterUrl);
    return this._http.get(counterUrl).pipe(
      map((res) => res),
      catchError(this.errorHandler)
    );
  }
  getMasterStaff() {
    let servUrl = this.configService.getConfig().baseUrl;
    let counterUrl = servUrl + "userCtrl/getStaffDtls";
    console.log("counterUrl==" + counterUrl);
    return this._http.get(counterUrl).pipe(
      map((res) => res),
      catchError(this.errorHandler)
    );
  }
  deleteGuestReview(guestId) {
    let servUrl = this.configService.getConfig().baseUrl;
    let counterUrl =
      servUrl + "guestCtrl/deleteGuestReviewDetails?guestReviewId=" + guestId;
    console.log("counterUrl==" + counterUrl);
    return this._http.post(counterUrl, {}).pipe(
      map((res) => res),
      catchError(this.errorHandler)
    );
  }
  addGuestReview(guestReviewData) {
    let servUrl = this.configService.getConfig().baseUrl;
    let counterUrl = servUrl + "guestCtrl/addGuestReview";
    console.log("counterUrl==" + counterUrl);
    return this._http
      .post(counterUrl, {
        tableId: guestReviewData.table,
        guestName: guestReviewData.guestName,
        guestNumber: guestReviewData.guestNumber,
        date: guestReviewData.gdate,
        guestEmail: guestReviewData.guestEmail,
        staffName: guestReviewData.staff,
        foodQualityId: guestReviewData.foodQuality,
        serviceId: guestReviewData.service,
        ambienceId: guestReviewData.ambience,
        rating: guestReviewData.rating,
        staffratingId: guestReviewData.staffRating,
        remarks: guestReviewData.comments,
        restaurantId: localStorage.getItem("isCurrentRestaurantId"),
      })
      .pipe(
        map((res) => res),
        catchError(this.errorHandler)
      );
  }
  editGuestReview(guestReviewData) {
    let servUrl = this.configService.getConfig().baseUrl;
    let counterUrl = servUrl + "guestCtrl/addGuestReview";
    console.log("counterUrl==" + counterUrl);
    return this._http
      .post(counterUrl, {
        tableId: guestReviewData.table,
        guestName: guestReviewData.guestName,
        guestNumber: guestReviewData.guestNumber,
        date: guestReviewData.gdate,
        guestEmail: guestReviewData.guestEmail,
        staffName: guestReviewData.staff,
        foodQualityId: guestReviewData.foodQuality,
        serviceId: guestReviewData.service,
        ambienceId: guestReviewData.ambience,
        rating: guestReviewData.rating,
        staffratingId: guestReviewData.staffRating,
        remarks: guestReviewData.comments,
        restaurantId: localStorage.getItem("isCurrentRestaurantId"),
        guestId: guestReviewData.guestId,
        guestReviewMapId: guestReviewData.guestReviewMapId,
      })
      .pipe(
        map((res) => res),
        catchError(this.errorHandler)
      );
  }
}
