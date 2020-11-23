import { Injectable } from '@angular/core';
import { DayPilot } from 'daypilot-pro-angular';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class DataService {

  resources: any[] = [
    {
      name: 'Standard Room', id: 'STD', expanded: true, children: [
        { name: '101', id: 'R101' },
        { name: '102', id: 'R102' }
      ]
    },
    {
      name: 'Delux Room', id: 'DLR', expanded: true, children: [
        { name: '201', id: 'R201' },
        { name: '202', id: 'R202' }
      ]
    },
    {
      name: 'Super Delux Room', id: 'SDR', expanded: true, children: [
        { name: '301', id: 'R301' },
        { name: '302', id: 'R302' }
      ]
    }
  ];

  thisMonth: DayPilot.Date = DayPilot.Date.today();

  events: any[] = [
    {
      id: '1',
      resource: 'R102',
      start: this.thisMonth.addDays(3),
      end: this.thisMonth.addDays(8),
      text: 'Mr. Rabin Deb',
      color: '#e69138'
    },
    {
      id: '2',
      resource: 'R301',
      start: this.thisMonth.addDays(2),
      end: this.thisMonth.addDays(5),
      text: 'Mr. John Doe',
      color: '#6aa84f'
    },
    {
      id: '3',
      resource: 'R301',
      start: this.thisMonth.addDays(15),
      end: this.thisMonth.addDays(18),
      text: 'Miss. Tina Dey',
      color: '#3c78d8'
    }
  ];

  constructor(private http: HttpClient) {
  }

  getEvents(from: DayPilot.Date, to: DayPilot.Date): Observable<any[]> {

    // simulating an HTTP request
    return new Observable(observer => {
      setTimeout(() => {
        observer.next(this.events);
      }, 200);
    });

    // return this.http.get("/api/events?from=" + from.toString() + "&to=" + to.toString());
  }

  getResources(): Observable<any[]> {

    // simulating an HTTP request
    return new Observable(observer => {
      setTimeout(() => {
        observer.next(this.resources);
      }, 200);
    });

    // return this.http.get("/api/resources");
  }

  createEvent(data: CreateEventParams): Observable<EventData> {
    console.log("in create event: ", data);
    let newRev: EventData = {
      id: Math.floor((Math.random() * 100) + 1),
      start: data.start,
      end: data.end,
      text: data.text,
      resource: data.resource
    };

    this.events.push(newRev);

    return Observable.create(observer => {
      observer.next(newRev);
      observer.complete();
    });
  }

  moveEvent(data: any): Observable<EventData> {
    return this.http.post("/api/events/move", data) as Observable<any>;
  }

  updateEvent(data: DayPilot.Event): Observable<any> {
    console.log("Updating event: " + data.text());
    console.log(data);
    return new Observable(observer => {
      setTimeout(() => {
        observer.next({result: "OK"});
      }, 200);
    });
  }

}

export interface MoveEventParams {
  id: string | number;
  start: string;
  end: string;
  resource: string | number;
}

export interface EventData {
  id: string | number;
  start: string;
  end: string;
  text: string;
  resource: string | number;
}

export interface CreateEventParams {
  start: string;
  end: string;
  text: string;
  resource: string | number;
}

export interface UpdateEventParams {
  id: string | number;
  start: string;
  end: string;
  text: string;
  resource: string | number;
}





