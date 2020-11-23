import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface IRoute{
    url: string,
        pageName: string
}

@Injectable()
export class RouteParameterService {

    constructor() { }

    private appRoute = new BehaviorSubject({});

    currentRouteData = this.appRoute.asObservable();

    changeRoute(curRoute: IRoute){
        this.appRoute.next(curRoute);
    }
}  