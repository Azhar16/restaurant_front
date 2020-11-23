import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Resolve } from "@angular/router";
import { Observable, of } from "rxjs";
import { catchError, map, tap } from "rxjs/operators";

import { environment } from "../../environments/environment";

import { ConfigService } from "../config.service";

@Injectable({
  providedIn: "root",
})
export class UserResolver implements Resolve<any> {
  constructor(private _http: HttpClient, public configService: ConfigService) {}

  private userDetails: any = undefined;

  resolve(): Observable<any> {
    if (this.userDetails && this.userDetails !== null) {
      return this.getSavedUserDetails();
    } else {
      return this.getUserDetailsFromApi();
    }
  }

  getUserData() {
    return this.userDetails;
  }

  getHotelID() {
    return this.userDetails.hotelID;
  }

  getAllowedModuleList() {
    return this.userDetails.modulesAllowed.modules;
  }

  public removeUser() {
    this.userDetails = null;
  }

  private getSavedUserDetails() {
    return of(this.userDetails);
  }

  public getUserDetailsFromApi() {
    console.log("Getting api user details");
    //  let servUrl = environment.apiUrl;
    let servUrl = this.configService.getConfig().baseUrl;

    console.log(
      "Getting api user details",
      servUrl + "bookingCtrl/getLoginData/1"
    );
    let userDataUrl = servUrl + "bookingCtrl/getLoginData/1";

    return this._http.post(userDataUrl, {}).pipe(
      tap((userDataFromApi) => {
        console.log("userDataFromApi: ", userDataFromApi);
        localStorage.setItem("isCurrentRestaurantId", "2");
        localStorage.setItem("isCurrentDateformat", "DD-MMM-YYYY");
        this.userDetails = userDataFromApi;
      }),
      map((userDataFromApi) => userDataFromApi),
      catchError((err) => Observable.throw(err.json().error))
    );
  }
}
