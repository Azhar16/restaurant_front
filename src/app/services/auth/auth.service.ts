import { CookieService } from "ngx-cookie-service";
import { catchError, map } from "rxjs/operators";
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { throwError } from "rxjs";

import { environment } from "../../../environments/environment";
import { UserResolver } from "../../shared/user.resolver.service";
import { ConfigService } from "../../config.service";

@Injectable({
  providedIn: "root"
})
export class AuthService {
  cookieKeyUser: string = "U$517";
  cookieKeyPass: string = "P@$$";

  private userHotelID: number;

  constructor(
    private cookieService: CookieService,
    private _http: HttpClient,
    private _userResolver: UserResolver,
    public configService: ConfigService
  ) {
    //this.userHotelID = this._userResolver.getHotelID();
  }

  getUserDetails(username: string, password: string) {
    // post these details to API server return user info if correct
    let servUrl = this.configService.getConfig().baseUrl;
    servUrl += "login";
    return this._http
      .post(
        servUrl,
        {
          username: username,
          //"email": username,
          password: password
        },
        {
          responseType: "json",
          observe: "response"
        }
      )
      .pipe(
        map(res => {
          //console.log("response header: ", res);
          return res;
        }),
        catchError(this.errorHandler)
      );
  }

  fetchUserDetails() {
    let servUrl = this.configService.getConfig().baseUrl;
    let userDataUrl = servUrl + "getLoginData/1";

    return this._http.post(userDataUrl, {}).pipe(
      map(res => {
        return res;
      }),
      catchError(this.errorHandler)
    );
  }

  errorHandler(errorRes: Response) {
    // console.log("error: ", errorRes, errorRes.status);
    // if(errorRes.headers.status)
    return throwError(errorRes);
  }

  public isAuthenticated(): boolean {
    return this.getToken() !== null;
  }

  storeToken(token: string) {
    localStorage.setItem("token", token);
  }

  getToken() {
    return localStorage.getItem("token");
  }

  removeToken() {
    return localStorage.removeItem("token");
  }

  setAllowedModules(allowedModuleList: any) {
    localStorage.setItem("allowedModules", JSON.stringify(allowedModuleList));
  }

  setSuperUser(superUserFlag: boolean) {
    localStorage.setItem("isSuperUser", JSON.stringify(superUserFlag));
  }

  getAllowedModules() {
    return JSON.parse(localStorage.getItem("allowedModules"));
  }

  isAccessableModule(routeModule: any): boolean {
    const allowedModules = JSON.parse(localStorage.getItem("allowedModules"));
    const isSuperUser = JSON.parse(localStorage.getItem("isSuperUser"));

    if (isSuperUser) {
      return true;
    } else {
      // console.log("in isAccessable module: ", allowedModules, routeModule);//, allowedModules.find(moduleObj =>  moduleObj.moduleID == routeModule.moduleID && moduleObj.moduleName == routeModule.moduleName));//this.allowedModules.find(moduleObj => { moduleObj.moduleID == routeModule.moduleID && moduleObj.moduleName == routeModule.moduleName }));
      if (typeof allowedModules !== "undefined" && allowedModules !== null) {
        const existsModule = allowedModules.find(
          moduleObj =>
            moduleObj.moduleID == routeModule.moduleID &&
            moduleObj.moduleName == routeModule.moduleName
        );
        // console.log('existsModule: ', existsModule, routeModule.subModuleCode);
        if (routeModule.subModuleCode) {
          const existsSubModule = existsModule.subModule.find(
            subModuleObj =>
              subModuleObj.subModuleCode === routeModule.subModuleCode
          );
          // console.log("in sub module if", existsSubModule);
          return typeof existsSubModule !== "undefined" ? true : false;
        } else {
          return typeof existsModule !== "undefined" ? true : false;
        }
      } else {
        return false;
      }
    }
  }

  fetchLoginCredentials(): any {
    const cookieExists: boolean =
      this.cookieService.check(this.cookieKeyUser) &&
      this.cookieService.check(this.cookieKeyPass);
    if (cookieExists) {
      return {
        keyHead: this.cookieService.get(this.cookieKeyUser),
        keyValue: this.cookieService.get(this.cookieKeyPass)
      };
    } else {
      return false;
    }
  }

  saveLoginCredentialsInCookie(base64User: string, base64Pass: string) {
    let expDate = new Date();
    expDate.setDate(expDate.getDate() + 1);

    this.cookieService.set(this.cookieKeyUser, base64User, expDate);
    this.cookieService.set(this.cookieKeyPass, base64Pass, expDate);
  }

  getLogoutUser(username: string, hotelId: number) {
    // post these details to API server return user info if correct
    let servUrl = this.configService.getConfig().baseUrl;
    servUrl += "logout/" + hotelId;
    return this._http
      .post(
        servUrl,
        {
          userName: username
        },
        {
          responseType: "json",
          observe: "response"
        }
      )
      .pipe(
        map(res => {
          //this._userResolver.removeUser();
          localStorage.removeItem("allowedModules");
          localStorage.removeItem("isSuperUser");
          this._userResolver.removeUser();
          return res;
        }),
        catchError(this.errorHandler)
      );
  }

  removeLoginCredentialsInCookie() {
    this.cookieService.delete(this.cookieKeyUser);
    this.cookieService.delete(this.cookieKeyPass);
  }
}
