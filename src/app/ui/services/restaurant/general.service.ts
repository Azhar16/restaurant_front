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
export class GeneralService {
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

  getCurrencyList() {
    let servUrl = this.configService.getConfig().baseUrl;
    let counterUrl = servUrl + "restaurantCtrl/getAllCurrency";
    console.log("counterUrl==" + counterUrl);
    return this._http.get(counterUrl).pipe(
      map((res) => res),
      catchError(this.errorHandler)
    );
  }
  getCurrencyConverterList() {
    let servUrl = this.configService.getConfig().baseUrl;
    let counterUrl = servUrl + "restaurantCtrl/getAllCurrencyConverter";
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
  addRestaurantGeneralinfo(RestaurantGeneralData) {
    let servUrl = this.configService.getConfig().baseUrl;
    let counterUrl = servUrl + "restaurantCtrl/addRestaurantInfo";
    console.log("counterUrl==" + counterUrl);
    return this._http
      .post(counterUrl, {
        name: RestaurantGeneralData.name,
        address: RestaurantGeneralData.address,
        city: RestaurantGeneralData.city,
        state: RestaurantGeneralData.state,
        country: RestaurantGeneralData.country,
        zipCode: RestaurantGeneralData.zipCode,
        mobileNO: RestaurantGeneralData.mobleno,
        phoneNO: RestaurantGeneralData.phoneNO,
        website: RestaurantGeneralData.website,
        email: RestaurantGeneralData.email,
        gstNo: RestaurantGeneralData.gstNo,
      })
      .pipe(
        map((res) => res),
        catchError(this.errorHandler)
      );
  }
  editRestaurantGeneralinfo(RestaurantGeneralData) {
    let servUrl = this.configService.getConfig().baseUrl;
    let counterUrl = servUrl + "restaurantCtrl/addRestaurantInfo";
    console.log("counterUrl==" + counterUrl);
    return this._http
      .post(counterUrl, {
        name: RestaurantGeneralData.name,
        address: RestaurantGeneralData.address,
        city: RestaurantGeneralData.city,
        state: RestaurantGeneralData.state,
        country: RestaurantGeneralData.country,
        zipCode: RestaurantGeneralData.zipCode,
        mobileNO: RestaurantGeneralData.mobleno,
        phoneNO: RestaurantGeneralData.phoneNO,
        website: RestaurantGeneralData.website,
        email: RestaurantGeneralData.email,
        gstNo: RestaurantGeneralData.gstNo,
        restaurantId: RestaurantGeneralData.restaurantId,
      })
      .pipe(
        map((res) => res),
        catchError(this.errorHandler)
      );
  }
  addRestaurantBasicinfo(RestaurantAdvanceData) {
    console.log("RestaurantAdvanceData", RestaurantAdvanceData);
    let servUrl = this.configService.getConfig().baseUrl;
    let counterUrl = servUrl + "restaurantCtrl/addRestaurantInfoBasicSetting";
    console.log("counterUrl==" + counterUrl);
    return this._http
      .post(counterUrl, {
        restaurantName: RestaurantAdvanceData.restaurantName,
        finYearFrom: RestaurantAdvanceData.finYearFrom,
        finYearTo: RestaurantAdvanceData.finYearTo,
        counterStartTime1: RestaurantAdvanceData.counterTimingFrom1,
        counterEndTime1: RestaurantAdvanceData.counterTimingTo1,
        currency: RestaurantAdvanceData.currency,
        noOfRestaurant: RestaurantAdvanceData.noOfRestaurant,
        noOfBanquet: RestaurantAdvanceData.noOfBanquet,
        defaultLanguage: RestaurantAdvanceData.defaultLanguage,
        dateFormat: RestaurantAdvanceData.dateFormat,
        timeZone: RestaurantAdvanceData.timeZone,
        decimalPlace: RestaurantAdvanceData.decimalPlace,
        timeFormat: RestaurantAdvanceData.timeFormat,
        counterStartTime2: RestaurantAdvanceData.counterTimingFrom2,
        counterStartTime3: RestaurantAdvanceData.counterTimingFrom3,
        counterEndTime2: RestaurantAdvanceData.counterTimingTo2,
        counterEndTime3: RestaurantAdvanceData.counterTimingTo3,
      })
      .pipe(
        map((res) => res),
        catchError(this.errorHandler)
      );
  }
  editRestaurantBasicinfo(RestaurantAdvanceData) {
    console.log("RestaurantAdvanceData", RestaurantAdvanceData);
    let servUrl = this.configService.getConfig().baseUrl;
    let counterUrl = servUrl + "restaurantCtrl/addRestaurantInfoBasicSetting";
    console.log("counterUrl==" + counterUrl);
    return this._http
      .post(counterUrl, {
        restaurantName: RestaurantAdvanceData.restaurantName,
        finYearFrom: RestaurantAdvanceData.finYearFrom,
        finYearTo: RestaurantAdvanceData.finYearTo,
        counterTimingFrom1: RestaurantAdvanceData.counterTimingFrom1,
        counterTimingTo1: RestaurantAdvanceData.counterTimingTo1,
        currency: RestaurantAdvanceData.currency,
        noOfRestaurant: RestaurantAdvanceData.noOfRestaurant,
        noOfBanquet: RestaurantAdvanceData.noOfBanquet,
        defaultLanguage: RestaurantAdvanceData.defaultLanguage,
        dateFormat: RestaurantAdvanceData.dateFormat,
        timeZone: RestaurantAdvanceData.timeZone,
        decimalPlace: RestaurantAdvanceData.decimalPlace,
        timeFormat: RestaurantAdvanceData.timeFormat,
        counterTimingFrom2: RestaurantAdvanceData.counterTimingFrom2,
        counterTimingFrom3: RestaurantAdvanceData.counterTimingFrom3,
        counterTimingTo2: RestaurantAdvanceData.counterTimingTo2,
        counterTimingTo3: RestaurantAdvanceData.counterTimingTo3,
        restaurantMastId: RestaurantAdvanceData.restaurantMastId,
        basicSettingsId: RestaurantAdvanceData.basicSettingsId,
      })
      .pipe(
        map((res) => res),
        catchError(this.errorHandler)
      );
  }
  addRestaurantAdvanceinfo(RestaurantData) {
    //console.log("RestaurantAdvanceData",RestaurantAdvanceData);
    let servUrl = this.configService.getConfig().baseUrl;
    let counterUrl = servUrl + "restaurantCtrl/addRestaurantInfoAdvance";
    console.log("counterUrl==" + counterUrl);
    return this._http
      .post(counterUrl, {
        restName: RestaurantData.restName,
        restaurantName: RestaurantData.restaurantName,
        managerName: RestaurantData.managerName,
        noOfTable: RestaurantData.noOfTable,
        noOfStaff: RestaurantData.noOfStaff,
        phoneNo: RestaurantData.phoneNo,
        restBanType: "R",
      })
      .pipe(
        map((res) => res),
        catchError(this.errorHandler)
      );
  }

  addBanaquetAdvanceinfo(RestaurantData) {
    //console.log("RestaurantAdvanceData",RestaurantAdvanceData);
    let servUrl = this.configService.getConfig().baseUrl;
    let counterUrl = servUrl + "restaurantCtrl/addRestaurantInfoAdvance";
    console.log("counterUrl==" + counterUrl);
    return this._http
      .post(counterUrl, {
        restName: RestaurantData.restName,
        restaurantName: RestaurantData.restaurantName,
        managerName: RestaurantData.managerName,
        noOfTable: RestaurantData.noOfTable,
        noOfStaff: RestaurantData.noOfStaff,
        phoneNo: RestaurantData.phoneNo,
        restBanType: "B",
      })
      .pipe(
        map((res) => res),
        catchError(this.errorHandler)
      );
  }

  editRestaurantAdvanceinfo(RestaurantData) {
    //console.log("RestaurantAdvanceData",RestaurantAdvanceData);
    let servUrl = this.configService.getConfig().baseUrl;
    let counterUrl = servUrl + "restaurantCtrl/addRestaurantInfoAdvance";
    console.log("counterUrl==" + counterUrl);
    return this._http
      .post(counterUrl, {
        restName: RestaurantData.restName,
        restaurantName: RestaurantData.restaurantName,
        managerName: RestaurantData.managerName,
        noOfTable: RestaurantData.noOfTable,
        noOfStaff: RestaurantData.noOfStaff,
        phoneNo: RestaurantData.phoneNo,
        restBanType: "R",
        advanceId: RestaurantData.id,
        restaurantMastId: RestaurantData.restaurantId,
      })
      .pipe(
        map((res) => res),
        catchError(this.errorHandler)
      );
  }

  editBanaquetAdvanceinfo(RestaurantData) {
    //console.log("RestaurantAdvanceData",RestaurantAdvanceData);
    let servUrl = this.configService.getConfig().baseUrl;
    let counterUrl = servUrl + "restaurantCtrl/addRestaurantInfoAdvance";
    console.log("counterUrl==" + counterUrl);
    return this._http
      .post(counterUrl, {
        restName: RestaurantData.restName,
        restaurantName: RestaurantData.restaurantName,
        managerName: RestaurantData.managerName,
        noOfTable: RestaurantData.noOfTable,
        noOfStaff: RestaurantData.noOfStaff,
        phoneNo: RestaurantData.phoneNo,
        restBanType: "B",
        advanceId: RestaurantData.id,
        restaurantMastId: RestaurantData.restaurantId,
      })
      .pipe(
        map((res) => res),
        catchError(this.errorHandler)
      );
  }

  getRestaurantMastDetails() {
    let servUrl = this.configService.getConfig().baseUrl;
    let counterUrl = servUrl + "restaurantCtrl/getRestaurantMastDetails";
    console.log("counterUrl==" + counterUrl);
    return this._http.get(counterUrl).pipe(
      map((res) => res),
      catchError(this.errorHandler)
    );
  }
  getRestaurantBasicSettingDetails() {
    let servUrl = this.configService.getConfig().baseUrl;
    let counterUrl =
      servUrl + "restaurantCtrl/getRestaurantBasicSettingsDetails";
    console.log("counterUrl==" + counterUrl);
    return this._http.get(counterUrl).pipe(
      map((res) => res),
      catchError(this.errorHandler)
    );
  }
  getRestaurantAdvanceDetails(type) {
    let servUrl = this.configService.getConfig().baseUrl;
    let counterUrl =
      servUrl +
      "restaurantCtrl/getRestaurantAdvanceDetails?restBanType=" +
      type;
    console.log("counterUrl==" + counterUrl);
    return this._http.get(counterUrl).pipe(
      map((res) => res),
      catchError(this.errorHandler)
    );
  }
}
