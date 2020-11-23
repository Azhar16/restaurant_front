import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { throwError, forkJoin, Observable, of } from "rxjs";
import { map, catchError } from "rxjs/operators";

import { environment } from "../../../../environments/environment";
import { UserResolver } from "../../../shared/user.resolver.service";

import { ConfigService } from "../../../config.service";

@Injectable({
  providedIn: "root"
})
export class GuestManagementService {
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

  getGuestList() {
    let servUrl = this.configService.getConfig().baseUrl;
    let counterUrl = servUrl + "guestCtrl/getAllGuestDetails";
    console.log("counterUrl==" + counterUrl);
    return this._http.get(counterUrl).pipe(
      map(res => res),
      catchError(this.errorHandler)
    );
  }
  getGuestEvent() {
    let servUrl = this.configService.getConfig().baseUrl;
    let counterUrl = servUrl + "userCtrl/getAllEvent";
    console.log("counterUrl==" + counterUrl);
    return this._http.get(counterUrl).pipe(
      map(res => res),
      catchError(this.errorHandler)
    );
  }
  addGuest(guestData) {
    let servUrl = this.configService.getConfig().baseUrl;
    let counterUrl = servUrl + "guestCtrl/addGuestDetails";
    console.log("counterUrl==" + counterUrl);
    return this._http
      .post(counterUrl, {
        title: guestData.title,
        guestName: guestData.guestName,
        guestNumber: guestData.guestNumber,
        guestEmail: guestData.guestEmailid,
        birthdate: guestData.gdate,
        eventId: guestData.gEvent,
        restaurantId: localStorage.getItem("isCurrentRestaurantId")
      })
      .pipe(
        map(res => res),
        catchError(this.errorHandler)
      );
  }
  editGuest(guestData) {
    let servUrl = this.configService.getConfig().baseUrl;
    let counterUrl = servUrl + "guestCtrl/addGuestDetails";
    console.log("counterUrl==" + counterUrl);
    return this._http
      .post(counterUrl, {
        title: guestData.title,
        guestName: guestData.guestName,
        guestNumber: guestData.guestNumber,
        guestEmail: guestData.guestEmailid,
        birthdate: guestData.gdate,
        eventId: guestData.gEvent,
        restaurantId: localStorage.getItem("isCurrentRestaurantId"),
        guestId: guestData.guestId
      })
      .pipe(
        map(res => res),
        catchError(this.errorHandler)
      );
  }
  deleteGuest(guestId) {
    let servUrl = this.configService.getConfig().baseUrl;
    let counterUrl =
      servUrl + "guestCtrl/deleteGuestDetails?guestId=" + guestId;
    console.log("counterUrl==" + counterUrl);
    return this._http.post(counterUrl, {}).pipe(
      map(res => res),
      catchError(this.errorHandler)
    );
  }
}
