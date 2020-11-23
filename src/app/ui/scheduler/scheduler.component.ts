import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { DayPilot, DayPilotSchedulerComponent } from 'daypilot-pro-angular';
//import { QuickReservationComponent } from "./quick-reservation/quick.reservation.component";
import { EditComponent } from "./edit.component";
import { DataService, MoveEventParams } from './data.service';import { log } from 'util';
import { FormArray } from '@angular/forms';
 { }

export const schedulerSupportComponent = [ EditComponent];

@Component({
    selector: 'scheduler-component',
    template: `<daypilot-scheduler [config]="config" [events]="events" (viewChange)="viewChange($event)" #scheduler></daypilot-scheduler>
    
    `,
    //<edit-dialog #edit (close)="editClosed($event)"></edit-dialog>
    styles: [`
    .modal.visible {
        display: block !important;
    }`]
})
export class SchedulerComponent {

    @ViewChild('scheduler') scheduler: DayPilotSchedulerComponent;
    //@ViewChild("create") create: QuickReservationComponent;
    @ViewChild("edit") edit: EditComponent;

    events: any[] = [];
    config: any = {
        timeHeaders: [{ "groupBy": "Day", "format": "dd,dddd" }],
        scale: "Day",
        treeEnabled: true,
        eventHeight: 45,
        days: 30,
        startDate: DayPilot.Date.today().firstDayOfMonth(),
        theme: "scheduler_green",
        durationBarVisible: true,
        cellWidth: 80,  
        headerHeightAutoFit: false,
        headerHeight: 40,  
        contextMenu: new DayPilot.Menu({
            items: [{
                text:"Edit Reservation", 
                image: "./assets/images/guest-lookup-ico.png",
                onClick: args => { 
                    console.log("in click function");                    
                    } 
                }
          ]
        }), 
        onBeforeTimeHeaderRender: args => {
            let fromatArray = args.header.html.split(',');
            args.header.html = fromatArray[0] + '<br>' + (""+fromatArray[1]).substring(0,3).toUpperCase();
        },     
        onBeforeEventRender: args => {
            args.data.backColor = args.data.color;
        }, 
       // onTimeRangeSelected: args => {
            //this.create.show(args);
            /*let name = prompt("New reservation:", "Guest Name");
            this.scheduler.control.clearSelection();
            if (!name) {
                return;
            }
            let params: CreateEventParams = {
                start: args.start.toString(),
                end: args.end.toString(),
                text: name,
                resource: args.resource
            };
            this.ds.createEvent(params).subscribe(result => {
                this.events.push();
                this.scheduler.control.message("Event created");
            });*/
        //},
        onEventResized: args => {
            console.log("at event resized: ", args);

        },
        onEventClicked: args => {
            this.edit.show(args.e);
        },
        onEventMove: args => {
            let params: MoveEventParams = {
                id: args.e.id(),
                start: args.newStart.toString(),
                end: args.newEnd.toString(),
                resource: args.newResource
            };
            this.ds.moveEvent(params).subscribe(result => {
                this.scheduler.control.message("Event moved");
            });
        }
    };

    get durationBarNotSupported(): boolean {
        return this.themes.find(item => item.value === this.config.theme).noDurationBarSupport;
    }

    themes: any[] = [
        { name: "Default", value: "scheduler_default" },
        { name: "Green", value: "scheduler_green" },
        { name: "Traditional", value: "scheduler_traditional" },
        { name: "Transparent", value: "scheduler_transparent" },
        { name: "White", value: "scheduler_white" },
        { name: "Theme 8", value: "scheduler_8", noDurationBarSupport: true }
    ];

    constructor(private ds: DataService) {
    }

    ngAfterViewInit(): void {
        this.ds.getResources().subscribe(result => this.config.resources = result);

        const from = this.scheduler.control.visibleStart();
        const to = this.scheduler.control.visibleEnd();
        this.ds.getEvents(from, to).subscribe(result => {
            this.events = result;
            console.log("after getting events: ", result);

        });
    }

    viewChange(args) {
        console.log("in view change: ", args, this.scheduler.control.visibleStart(), this.scheduler.control.visibleEnd());

        // quit if the date range hasn't changed
        if (!args.visibleRangeChanged) {
            return;
        }

        let from = this.scheduler.control.visibleStart();
        let to = this.scheduler.control.visibleEnd();
    }

    createClosed(args) {
        if (args.result) {
          this.events.push(args.result);
          this.scheduler.control.message("Created.");
        }
        this.scheduler.control.clearSelection();
      }


}