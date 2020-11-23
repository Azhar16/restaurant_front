import { BehaviorSubject } from 'rxjs';
import { Injectable, EventEmitter } from '@angular/core';
//import { NgbDate } from '@ng-bootstrap/ng-bootstrap';

@Injectable()
export class DataEventService {
    fromDate:any;
    toDate: any;

    constructor() {}

    private startDate = new BehaviorSubject(this.fromDate);
    private endDate = new BehaviorSubject(this.toDate);
    
    currentStartDate = this.startDate.asObservable();
    currentEndDate = this.endDate.asObservable();
    
    changeStartDate(frmDate) {
        this.startDate.next(frmDate);
    }
    
    changeEndDate(endDate) {
        this.endDate.next(endDate);
    }


    private componentEmitter = new EventEmitter<any>();

    newEvent(pageType){        
        this.componentEmitter.emit(pageType);
    }

    currentEvent = this.componentEmitter.asObservable();





}