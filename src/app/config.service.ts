import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class ConfigService {
  private appConfig: any;

  constructor(private _http: HttpClient) {}

  /*loadConfig(){
    return this._http.get('')
    .toPromise()
    .then(res=>{
      this.appConfig = res;
    });
  }
   getConfig(){
     return this.appConfig;
   }*/

  public loadConfig() {
    return this._http
      .get("./assets/settings.json")
      .toPromise()
      .then(url => {
        this.appConfig = url;
      });
  }

  getConfig() {
    return this.appConfig;
  }
}
