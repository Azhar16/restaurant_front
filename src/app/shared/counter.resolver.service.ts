import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { catchError, mergeMap } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { UserResolver } from '../shared/user.resolver.service';

@Injectable({
    providedIn: 'root'
})
export class CounterResolverService implements Resolve<any> {

    userHotelID: String;

    constructor(private _http: HttpClient, private _userResolver: UserResolver,) {
        this.userHotelID = this._userResolver.getHotelID();
     }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
        
        return this.getCounterList();

        //let servUrl = environment.apiUrl;
        //let counterListUrl = servUrl + 'Accounts/Billings/getCounters/' + this.userHotelID;
        // return this._http.post(counterListUrl, {})
        // .pipe(catchError(error => {
        //     return EMPTY
        // }), mergeMap(something => {
        //     if (something) {
        //         return of(something)
        //     } else {
        //         return EMPTY;
        //     }
        // })
        // )
    }

    getCounterList() {
        let servUrl = environment.apiUrl;
        let counterListUrl = servUrl + 'Accounts/Billings/getCounters/' + this.userHotelID;

        return this._http.post(counterListUrl, {})
        .pipe(catchError(error => {
            return EMPTY
        }), mergeMap(something => {
            if (something) {
                return of(something)
            } else {
                return EMPTY;
            }
        })
        )
    }

}