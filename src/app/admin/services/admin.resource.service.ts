import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { throwError, Observable } from 'rxjs';

import { environment } from '../../../environments/environment';

export class AdminResourceService {

    url: string;

    constructor(
        private _http: HttpClient,
        public userHotelID: number
    ) {
        this.url = environment.apiUrl;
    }

    protected errorHandler(errorRes: Response) {
        console.log("error: ", errorRes, errorRes.status);
        return throwError(errorRes);
    }

    public getData(servicePath: string, options:object = {}): Observable<any> {
        return this._http
            .post(this.url + servicePath + this.userHotelID, options)
            .pipe(
                map(res => res),
                catchError(this.errorHandler)
            );
    }

    public getDataList(servicePath: string, responseObject: string, isMapEdit: boolean = true): Observable<any> {
        return this._http
            .post(this.url + servicePath + this.userHotelID, {})
            .pipe(
                map(res => {                    
                    return isMapEdit ? res[responseObject].map(
                        item => {
                            item['editable'] = false;
                            return item;
                        }
                    ) : res[responseObject]
                }),
                catchError(this.errorHandler)
            );
    }

    public addData(servicePath: string, requestObject: any): Observable<any> {
        return this._http
            .post(this.url + servicePath + this.userHotelID, requestObject)
            .pipe(
                map(res => res),
                catchError(this.errorHandler)
            );
    }

    public updateData(servicePath: string, options: any) {
        return this._http.post(this.url + servicePath + this.userHotelID, options).pipe(
            map(res => res),
            catchError(this.errorHandler)
        );
    }

    public removeData(servicePath: string, options: any): Observable<any> {
        return this._http.delete(this.url + servicePath + this.userHotelID + '/' + options.dataID).pipe(
            map(res => res),
            catchError(this.errorHandler)
        );
    }
}