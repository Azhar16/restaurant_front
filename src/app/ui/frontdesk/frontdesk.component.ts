import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { BsModalService, ModalDirective } from 'ngx-bootstrap/modal';
import { Component, OnDestroy, OnInit, ViewChild, ModuleWithComponentFactories } from '@angular/core';
import { DayPilot, DayPilotSchedulerComponent } from 'daypilot-pro-angular';
import { OwlCarousel } from 'ngx-owl-carousel';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
//import { DaterangePickerComponent } from 'ng2-daterangepicker';

import moment from 'moment';
import * as $ from 'jquery';
import _ from 'lodash';
import { DataEventService } from '../../shared/data.event.service';
import { BookingOperationsService } from '../services/booking.operations.service';
import { DataService, CreateEventParams, MoveEventParams } from '../scheduler/data.service';
import { FrontDeskService } from '../services/front.desk.services';
import { IRoom, IRatePlan, IReservationData } from './Frontdesk';
import { ReservationModel } from '../../shared/models/reservation.model';
import { RouteParameterService } from '../../shared/route.parameter.service';
import { UserResolver } from '../../shared/user.resolver.service';


@Component({
  selector: 'app-ui-frontdesk',
  templateUrl: './frontdesk.component.html',
  styleUrls: ['./frontdesk.component.scss']
})
export class FrontdeskComponent implements OnInit, OnDestroy {

  modalRef: BsModalRef;
  bsConfig: Partial<BsDatepickerConfig>;
  minDate: Date;
  selectedStartDate: Date;
  selectedEndDate: Date;
  bsRangeValue: Date[];

  roomList: IRoom[];
  ratePlanList: IRatePlan[];
  mappedRatePlanList: any;

  showPicker: boolean = false;
  dateTab: string = 'custom';
  countObservable: any;
  blockedRoomCountCellWidth: number;
  schedulerHeight: number;

  eventBookingOption: any;
  eventBookingData: any;
  bookingDetailsEditable: boolean;
  eventSubscription: Subscription;

  public daterange: any = {};
  public fdPageView: string = 'console';

  private cancelReservationData: any;
  public cancelRevObj = {
    "isChargeApplied": false,
    "text": null
  };


  reservationStatusReportType: string;
  detailReservationList: any = [];

  @ViewChild('checkInModal') checkInModal: ModalDirective;
  @ViewChild('checkOutModal') checkOutModal: ModalDirective;
  @ViewChild('cancelRevModal') cancelRevModal: ModalDirective;
  @ViewChild('owlElement') owlElement: OwlCarousel;

  @ViewChild('scheduler') scheduler: DayPilotSchedulerComponent;

  // see original project for full list of options
  // can also be setup using the config service to apply to multiple pickers
  public options: any = {
    locale: { format: 'YYYY-MM-DD' },
    alwaysShowCalendars: false,
  };

  public buttonCarouselOptions = {
    //loop: true,
    dots: false,
    //center: true,
    autoWidth: true,
    responsiveClass: true,
    responsive: {
      0: {
        items: 1,
        margin: 0
      },
      375: {
        items: 2,
        margin: 2
      },
      550: {
        items: 3,
        margin: 5
      },
      1000: {
        items: 4,
        margin: 10
      }
    }
  };

  constructor(
    private bookingOperationsService: BookingOperationsService,
    private dateData: DataEventService,
    private fdData: FrontDeskService,
    private modalService: BsModalService,
    private router: Router,
    private routeParamService: RouteParameterService,
    private _userResolver: UserResolver
  ) {
    //this.minDate = new Date();
    this.bsConfig = Object.assign({}, {
      containerClass: 'theme-blue',
      rangeInputFormat: 'DD-MMM-YYYY',
      //minDate: new Date(),
      showWeekNumbers: false
    });
    this.selectedStartDate = new Date();
    this.selectedEndDate = new Date();
    this.selectedEndDate.setDate(this.selectedStartDate.getDate() + 13);
    this.bsRangeValue = [this.selectedStartDate, this.selectedEndDate];
  }

  ngOnInit() {
    this.routeParamService.changeRoute({
      url: this.router.url,
      pageName: 'Frontdesk'
    });

    this.config.days = moment(this.selectedEndDate).diff(moment(this.selectedStartDate), 'days') + 1;
    this.showPicker = false;
    this.blockedRoomCountCellWidth = ($('.scheduler_default_scrollable').outerWidth() / this.config.days);
    this.dateTab = 'custom';
    this.countObservable = _.range(this.config.days);
    this.config.startDate = moment(this.selectedStartDate).format('YYYY-MM-DD');

    $(".room-blocked-head").css({
      width: $('.scheduler_default_corner_inner').outerWidth() + 'px'
    });

    let requestOption = {
      startDate: moment(this.selectedStartDate).format('YYYY-MM-DD'),
      endDate: moment(this.selectedEndDate).format('YYYY-MM-DD')
    };

    //console.log("in in it: ", requestOption);

    this.eventSubscription = this.dateData.currentEvent.subscribe(eventData => {
      //console.log("in frontdesk: ", eventData);
      switch (eventData) {
        case 'CheckedIn':
          this.fdPageView = 'reservationReports';
          this.reservationStatusReportType = eventData;
          break;
        case 'CheckedOut':
          this.fdPageView = 'reservationReports';
          this.reservationStatusReportType = eventData;
          break;
        case 'inhouse':
          this.fdPageView = 'reservationReports';
          this.reservationStatusReportType = eventData;
          break;
        case 'Bookings':
          this.fdPageView = 'reservationReports';
          this.reservationStatusReportType = eventData;
          break;
        case 'NoShow':
          this.fdPageView = 'reservationReports';
          this.reservationStatusReportType = eventData;
          break;
        case 'Cancellations':
          this.fdPageView = 'reservationReports';
          this.reservationStatusReportType = eventData;
          break;
        case 'TraiffChart':
          this.fdPageView = 'traiffChart';
          this.reservationStatusReportType = eventData;
          break;
        case 'GuestLookUp':
          this.fdPageView = 'guestLookUp';
          this.reservationStatusReportType = eventData;
          break;
      }
    });

    this.schedulerHeight = $(document).height() - ($("#main-navbar").outerHeight() + $("#sub-navbar").outerHeight() + $(".frontdesk-header").outerHeight() + $(".fixed-bottom").outerHeight() + 78);
  }

  events: any[] = [];
  config: any = {
    timeHeaders: [{ "groupBy": "Day", "format": "dd,dddd" }],
    scale: "Day",
    treeEnabled: true,
    minDate: { year: 2018, month: 10, day: 1 },
    maxDate: { year: 2099, month: 12, day: 31 },
    //days: DayPilot.Date.today().daysInYear(),
    days: 30,
    startDate: DayPilot.Date.today().firstDayOfMonth(),
    //scrollTo: DayPilot.Date.today().firstDayOfMonth(),
    theme: "scheduler_default",
    durationBarVisible: true,
    //cellWidth: 80,
    eventHeight: 45,
    headerHeightAutoFit: false,
    headerHeight: 40,
    heightSpec: "Fixed",
    treePreventParentUsage: true,
    cellWidthSpec: 'Auto',
    rowHeaderWidthAutoFit: true,
    //contextMenu: ,
    onBeforeTimeHeaderRender: args => {
      if (args.header.start.getDayOfWeek() === 0 || args.header.start.getDayOfWeek() === 6) {
        args.header.cssClass = "suncss";
      }
      let fromatArray = args.header.html.split(',');
      args.header.html = fromatArray[0] + '<br>' + ("" + fromatArray[1]).substring(0, 3).toUpperCase();
    },
    onBeforeRowHeaderRender: (args: any) => {
      args.row.backColor = (args.row.index % 2) ? "#F1F1F1" : "#F9F9F9";
      setTimeout(() => {
        $('.scheduler_default_tree_image_collapse, .scheduler_default_tree_image_expand').css({ 'top': '18px', 'left': '6px' });
      }, 10);
      if (args.row.level != 0) {
        args.row.cssClass = "roomStat";
      }
      //console.log("args on before render: ", args);
    },

    /*onBeforeResHeaderRender:args => {
      if (args.resource.level != 0) {
        console.log("inner resource: ", args.resource);
        args.resource.html += "<span></span>";
      }
    },*/
    onBeforeCellRender: args => {
      //      
    },
    onBeforeEventRender: args => {
      //args.data.top = '2px';
      //console.log("on before render event argument: ", args, moment(args['data'].start).diff(moment().format('YYYY-MM-DD 00:00:00.0'), 'days'));
      let contextMenu = new DayPilot.Menu({
        items: [
          {
            text: "Add Quick Reservation",
            image: "./assets/images/view-details-ico.png",
            disabled: this.menuDisabledStatus(args['data'], 'quickReservation'),
            onClick: eventArgs => {
              let roomDetail = this.getSelectedRoomDetails(eventArgs.source.data.resource);
              //console.log("add quick reservations: ", eventArgs, roomDetail);
              args['roomID'] = roomDetail.roomID;
              args['roomCode'] = roomDetail.roomCode;
              args['roomName'] = roomDetail.roomName;
              args['roomDesc'] = roomDetail.roomDesc;
              args['resource'] = eventArgs.source.data.resource;
              args['start'] = moment(eventArgs.source.data.start).format('DD-MMM-YYYY');
              args['end'] = moment(eventArgs.source.data.end).add(1, 'd').format('DD-MMM-YYYY');
              this.fdData.getMappedRoomRateList(roomDetail.roomID).subscribe(rateListRes => {
                this.mappedRatePlanList = rateListRes['RTRPMappings'];
               // this.create.show(args);
              });
            }
          },
          { text: "-" },   // separator
          {
            text: "Cancel Reservation",
            image: "./assets/images/cancel-checkin-ico.png",
            disabled: this.menuDisabledStatus(args['data'], 'cancelReservation'),
            onClick: eventArgs => {
              this.changeBookingStatus(args['data'].otherData, 'cancelReservation');
            }
          },
          {
            text: "Cancel Check In",
            image: "./assets/images/cancel-checkin-ico.png",
            disabled: this.menuDisabledStatus(args['data'], 'cancelCheckIn'),
            onClick: eventArgs => {
              this.changeBookingStatus(args['data'].otherData, 'cancelCheckIn');
            },
          },
          {
            text: "Check In",
            image: "./assets/images/checkin-ico.png",
            disabled: this.menuDisabledStatus(args['data'], 'checkIn'),
            onClick: eventArgs => {
              this.changeBookingStatus(args['data'].otherData, 'Checkin');
            },
            //moment(args['data'].start).diff(moment().format('YYYY-MM-DD 00:00:00.0'), 'days') > 0 ? true : false
          },
          {
            text: "Check Out",
            image: "./assets/images/checkout-ico.png",
            disabled: this.menuDisabledStatus(args['data'], 'checkOut'),
            onClick: eventArgs => {
              this.changeBookingStatus(args['data'].otherData, 'Checkout');
            }
          },
          {
            text: "Cancel Check Out",
            image: "./assets/images/checkout-cancel-ico.png",
            disabled: this.menuDisabledStatus(args['data'], 'cancelCheckOut'),
          },
          { text: "-" },   // separator
          {
            text: "Assign",
            image: "./assets/images/assign-ico.png",
            disabled: true,
          },
          {
            text: "Un Assign",
            image: "./assets/images/unassign-ico.png",
            disabled: true,
          },
          { text: "-" },   // separator
          {
            text: "Payments",
            image: "./assets/images/payment-ico.png",
            disabled: this.menuDisabledStatus(args['data'], 'payments'),
            onClick: args => {
              setTimeout(() => {
                let existsBooking = this.detailReservationList.find(bookingData => bookingData.bookingID == args.source.data.otherData.bookingID);
                //console.log("on args click: ", args, existsBooking);
                if (typeof existsBooking === 'undefined') {
                  /*this.detailReservationList.push({
                    'bookingID': args.source.data.otherData.bookingID,
                    'givenName': args.source.data.otherData.guestDetails.guestDetail[0].givenName + ' ' + args.source.data.otherData.guestDetails.guestDetail[0].surName,
                    'otherData': args.source.data.otherData
                  });*/
                  this.eventBookingData = args.source.data.otherData;
                } else {
                  this.eventBookingData = args.source.data.otherData;
                }
                this.fdPageView = 'paymentsDetails';
              }, 10);
            }
          },
          {
            text: "Split Reservation",
            image: "./assets/images/reservation-split-ico.png",
            disabled: true
          },
          {
            text: "View Details",
            image: "./assets/images/view-details-ico.png",
            disabled: this.menuDisabledStatus(args['data'], 'viewDetails'),
            onClick: args => {
              let existsBooking = this.detailReservationList.find(bookingData => bookingData.bookingID == args.source.data.otherData.bookingID);
              //console.log("on args click: ", args, existsBooking);
              if (typeof existsBooking === 'undefined') {
                this.detailReservationList.push({
                  'bookingID': args.source.data.otherData.bookingID,
                  'givenName': args.source.data.otherData.guestDetails.guestDetail[0].givenName + ' ' + args.source.data.otherData.guestDetails.guestDetail[0].surName,
                });
              }
              this.showBookingSection(args.source.data.otherData.bookingID, true);
            }
          },
          { text: "-" },   // separator
          {
            text: "Group Check In",
            image: "./assets/images/group-checkin-ico.png",
            disabled: true,
          },
          {
            text: "Group Check Out",
            image: "./assets/images/group-checkout-ico.png",
            disabled: true,
          },
          {
            text: "Messages/Task",
            image: "./assets/images/message-ico.png",
          }
        ]
      });

      args.e.contextMenu = contextMenu;
    },
    onAfterRender: args => {
      this.blockedRoomCountCellWidth = $('.scheduler_default_matrix').outerWidth() / this.config.days;
      $(".scheduler_default_corner").append("<div class='inner_date'>Dates</div>");
      $(".room-blocked-head").css({
        width: $('.scheduler_default_corner_inner').outerWidth() + 'px'
      });
      this.config.height = this.schedulerHeight; // $(document).height() - ($("#main-navbar").outerHeight() + $("#sub-navbar").outerHeight() + $(".frontdesk-header").outerHeight() + $(".room-blocked-row").outerHeight() + 40);
    },
    onTimeRangeSelected: args => {
      let roomDetail = this.getSelectedRoomDetails(args.resource);
      //console.log("roomDetail: ", args, roomDetail);
      args['roomID'] = roomDetail.roomID;
      args['roomCode'] = roomDetail.roomCode;
      args['roomName'] = roomDetail.roomName;
      args['roomDesc'] = roomDetail.roomDesc;
      args['ruid'] = roomDetail.ruid;
      args['roomNumber'] = roomDetail.roomNumber;
      args['roomStatus'] = roomDetail.roomStatus;
      args['availableToAssign'] = roomDetail.availableToAssign;
      this.fdData.getMappedRoomRateList(roomDetail.roomID).subscribe(rateListRes => {
        this.mappedRatePlanList = rateListRes['RTRPMappings'];
       // this.create.show(args);
      });
    },
    onEventResized: args => {
      console.log("at event resized: ", args);
    },
    onEventMove: args => {
      args.preventDefault();
      let oldRoomObject = this.getSelectedRoomDetails(args.e.data.resource);
      let newRoomObject = this.getSelectedRoomDetails(args.newResource);
      //console.log("on event move: ", oldRoomObject, newRoomObject);
      if (oldRoomObject.roomCode == newRoomObject.roomCode) {
        let moveEventOption = {
          "bookingID": args.e.id(),
          "roomNumber": args.newResource,
          "action": "Assign"
        }
        this.fdData.assignOrCheckinReservation(moveEventOption).subscribe(result => {
          this.scheduler.control.message(result['successList'][0]['message']);
          if (result['successList'][0]['status'].toLowerCase() == 'failed') {
            return false;
          } else {
            let revEvent = this.events.find(revData => revData.id == moveEventOption.bookingID);
            revEvent.resource = moveEventOption.roomNumber;
            revEvent.otherData.assignedRoomNumber = moveEventOption.roomNumber;
            let requestOption = {
              startDate: moment(this.scheduler.control.visibleStart()['value']).format('YYYY-MM-DD'),
              endDate: moment(this.scheduler.control.visibleEnd()['value']).format('YYYY-MM-DD')
            }
            this.getReservationDetailList(requestOption);
            return true;
          }
        });
      } else {
        this.scheduler.control.message('Room Type Move Not possible');
      }
    }
  };

  menuDisabledStatus(argsData, menuType): boolean {
    //console.log("argsData, menuType: ", argsData, menuType);
    let returnType: boolean = true;
    switch (menuType) {
      case 'quickReservation':
        returnType = argsData['otherData']['bookingStatus'] == "CheckedOut" ? false : true;
        break;
      case 'cancelReservation':
        returnType = argsData['otherData']['bookingStatus'] == "New" ? false : true;
        break;
      case 'cancelCheckIn':
        returnType = argsData['otherData']['bookingStatus'] == "CheckedIn" ? false : true;
        break;
      case 'checkIn':
        returnType = moment(argsData.start).diff(moment().format('YYYY-MM-DD 00:00:00.0'), 'days') <= 0 && argsData['otherData']['bookingStatus'] == "New" ? false : true
        break;
      case 'checkOut':
        returnType = argsData['otherData']['bookingStatus'] == "CheckedIn" ? false : true;
        break;
      case 'cancelCheckOut':
        returnType = argsData['otherData']['bookingStatus'] == "CheckedOut" ? false : true;
        break;
      case 'payments':
        returnType = false;
        break;
      case 'viewDetails':
        returnType = false;
        break;
    }
    return returnType;
  }

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

  ngAfterViewInit(): void {
    this.config.resources = [];
    //this.config.height = 650;

    let from = this.scheduler.control.visibleStart();
    let to = this.scheduler.control.visibleEnd();

    let requestOption = {
      startDate: moment(from['value']).format('YYYY-MM-DD'),
      endDate: moment(to['value']).format('YYYY-MM-DD')
    }

    this.fdData.getRoomRateDetails().subscribe(roomRateResponse => {

      //console.log("in room rate details response: ", roomRateResponse);

      this.roomList = roomRateResponse[0];
      this.ratePlanList = roomRateResponse[1];
      let roomListSize = this.roomList.length;
      for (let roomResIndex = 0; roomResIndex < roomListSize; roomResIndex++) {
        let childRoomList = [];
        let roomUnitSize = this.roomList[roomResIndex].roomDetails.length
        for (let roomNumbIndex = 0; roomNumbIndex < roomUnitSize; roomNumbIndex++) {
          childRoomList.push({
            id: this.roomList[roomResIndex].roomDetails[roomNumbIndex].roomNumber,
            name: this.roomList[roomResIndex].roomDetails[roomNumbIndex].roomNumber,
            roomStatus: this.roomList[roomResIndex].roomDetails[roomNumbIndex].roomStatus,
            availableToAssign: this.roomList[roomResIndex].roomDetails[roomNumbIndex].availableToAssign
          });
        }

        let topResource = {
          name: this.roomList[roomResIndex].roomName,
          id: this.roomList[roomResIndex].roomCode,
          resourceType: 'room',
          expanded: this.config.resources.length > 0 ? false : true,
          children: childRoomList
        };

        this.config.resources.push(topResource);
      }


    });


    this.getReservationDetailList(requestOption);

  }

  getEventColor(bookingStatus: string, colorType: string) {
    let eventColorList = {
      'CheckedIn': {
        'backColor': '#f286ea',
        'borderColor': '#c855bf',
        'fontColor': '#fff'
      },
      'New': {
        'backColor': '#ffa5a7',
        'borderColor': '#f75b5f',
        'fontColor': '#fff'
      },
      'Modify': {
        'backColor': '#97ed6d',
        'borderColor': '#5cb431',
        'fontColor': '#fff'
      },
      'CheckedOut': {
        'backColor': '#7ebae0',
        'borderColor': '#5c99bf',
        'fontColor': '#fff'
      }
    };

    return eventColorList[bookingStatus][colorType];
  }

  getReservationDetailList(requestOption: any) {

    //console.log("response-->: ", requestOption);

    this.fdData.getReservationDetails(requestOption).subscribe(res => {

      this.events = [];
      let eventList = res['reservations'].reservation;
      // ...res['deprts'].departure
      //console.log("event list: ", eventList);


      for (let eventIndex = 0; eventIndex < eventList.length; eventIndex++) {
        //console.log('in loop: ', eventList[eventIndex].bookingStatus);
        this.events.push({
          id: eventList[eventIndex].bookingID,
          resource: eventList[eventIndex].assignedRoomNumber,
          start: eventList[eventIndex].arrivalDate,
          end: eventList[eventIndex].departureDate,
          text: eventList[eventIndex].guestDetails.guestDetail[0].namePrefix + ' ' + eventList[eventIndex].guestDetails.guestDetail[0].givenName + ' ' + eventList[eventIndex].guestDetails.guestDetail[0].surName,
          backColor: this.getEventColor(eventList[eventIndex].bookingStatus, 'backColor'),
          borderColor: this.getEventColor(eventList[eventIndex].bookingStatus, 'borderColor'),
          fontColor: this.getEventColor(eventList[eventIndex].bookingStatus, 'fontColor'),
          otherData: eventList[eventIndex]
        })
      }

    });
  }

  /*   This method wil call on schedular date with view change   */
  viewChange(args: any) {
    //console.log("in view change: ", args, this.scheduler.control.visibleStart(), this.scheduler.control.visibleEnd());

    // quit if the date range hasn't changed
    if (!args.visibleRangeChanged) {
      return;
    }

    let from = this.scheduler.control.visibleStart();
    let to = this.scheduler.control.visibleEnd();

  }

  /*   This method wil call on date range calender setting   */
  onCalenderValueChange() {
    //console.log("dt change: ", this.bsRangeValue);
    this.selectedStartDate = this.bsRangeValue[0];
    this.selectedEndDate = this.bsRangeValue[1];

    // schedular config needs to be set allways irrespective of tabs 
    // date change in other tab and return to console it should load data according to date selection
    this.config.startDate = moment(this.selectedStartDate).format('YYYY-MM-DD');
    this.config.days = moment(this.selectedEndDate).diff(moment(this.selectedStartDate), 'days') + 1;

    if (this.fdPageView == 'console') {
      this.blockedRoomCountCellWidth = ($('.scheduler_default_scrollable').outerWidth() / this.config.days);
      this.dateTab = 'custom';
      this.countObservable = _.range(this.config.days);
      let requestOption = {
        startDate: moment(this.selectedStartDate).format('YYYY-MM-DD'),
        endDate: moment(this.selectedEndDate).format('YYYY-MM-DD')
      }
      this.getReservationDetailList(requestOption);
    }

  }

  /*datePickerRangeSet(dt){
    console.log("on datepicker change: ", dt);
    console.log("dt change: ", this.bsRangeValue);
  }*/

  /* ***** This method will change the booking status ******* */
  public changeBookingStatus(eventArgs: any, expectedStatus: string) {

    let self = this;
    //console.log("in change booking status: ", eventArgs, expectedStatus);

    this.eventBookingOption = {
      "bookingID": eventArgs.bookingID,
      "roomTypeName": this.roomList.find(roomItem => roomItem.roomCode == eventArgs.roomtype).roomName,
      "roomNumber": eventArgs.assignedRoomNumber
    }
    //this.eventBookingOption["roomTypeName"] = ;
    if (expectedStatus == 'Checkin') {
      this.eventBookingOption["action"] = 'Checkin';

      this.fdData.assignOrCheckinReservation(this.eventBookingOption).subscribe(result => {
        this.scheduler.control.message(result['successList'][0]['message']);
        if (result['successList'][0]['status'].toLowerCase() == 'success') {
          //checkInModal
          self.modalRef = self.modalService.show(
            self.checkInModal,
            Object.assign({}, { class: 'gray modal-dialog-centered modal-lg' })
          );
          let requestOption = {
            startDate: moment(this.scheduler.control.visibleStart()['value']).format('YYYY-MM-DD'),
            endDate: moment(this.scheduler.control.visibleEnd()['value']).format('YYYY-MM-DD')
          }
          this.getReservationDetailList(requestOption);
        }
      });

    } else if (expectedStatus == 'Checkout') {

      this.eventBookingOption["roomNumber"] = eventArgs.assignedRoomNumber;
      this.fdData.checkOutReservation(this.eventBookingOption).subscribe(result => {

        this.scheduler.control.message(result['successList'][0]['message']);

        if (result['successList'][0]['status'].toLowerCase() == 'success') {
          //checkOutModal
          self.modalRef = self.modalService.show(
            self.checkOutModal,
            Object.assign({}, { class: 'gray modal-dialog-centered modal-lg' })
          );
          let requestOption = {
            startDate: moment(this.scheduler.control.visibleStart()['value']).format('YYYY-MM-DD'),
            endDate: moment(this.scheduler.control.visibleEnd()['value']).format('YYYY-MM-DD')
          }
          this.getReservationDetailList(requestOption);
        }

      });
    } else if (expectedStatus == 'cancelCheckIn') {

      let requestOption = {
        startDate: moment(this.scheduler.control.visibleStart()['value']).format('YYYY-MM-DD'),
        endDate: moment(this.scheduler.control.visibleEnd()['value']).format('YYYY-MM-DD')
      }
      this.getReservationDetailList(requestOption);

    } else if (expectedStatus == 'cancelReservation') {
      this.cancelReservationData = eventArgs;
      self.modalRef = self.modalService.show(
        self.cancelRevModal,
        Object.assign({}, { class: 'gray modal-dialog-centered' })
      );
    }
  }

  submitCancelReservation() {
    let completeBookingData = {
      resGlobalInfo: {
        "hotelReservationIDs": {
          "hotelReservationId": [
            {
              "resIDValue": this.cancelReservationData.bookingID,
              "resIDType": "15",
              "resIDSource": this.cancelReservationData.roomtype
            }
          ]
        }
      },
      requestorID: { "id": "BMPMS", "type": "15" },
      uniqueID: this.cancelReservationData.channelRefNum,
      hotelCode: this._userResolver.getHotelID(),
      start: this.cancelReservationData.arrivalDate,
      end: this.cancelReservationData.departureDate,
      adultCount: this.cancelReservationData.adult,
      childCount: this.cancelReservationData.child,
      assignedRoomNumber: this.cancelReservationData.assignedRoomNumber,
      roomCount: 1,
      roomType: this.cancelReservationData.roomtype,
      rateType: this.cancelReservationData.ratePlan,
      marketCode: this.cancelReservationData.marketCode,
      bookingSource: this.cancelReservationData.bkSource,
      arrivalBy: "",
      arrivalTime: "",
      arrivalTransportNo: "",
      departureBy: "",
      departureTime: "",
      departureTransportNo: "",
      guestInfo: this.cancelReservationData.guestDetails.guestDetail,
      roomDesc: "",
      los: this.cancelReservationData.los,
      taxAmount: "",
      taxDetails: {
        "code": "",
        "percent": "",
        "type": ""
      },
      totalPrice: this.cancelReservationData.totalAmountAfterTax,
      tpaextensions: null,
      cardType: "",
      cardHolderName: "",
      cardCode: "",
      cardNumber: "",
      expireDate: "",
      seriesCode: "",
      priceRateData: [
        {
          "base": {
            "amountAfterTax": "",
            "amountBeforeTax": "",
            "currencyCode": ""
          },
          "effectiveDate": "",
          "expireDate": "",
          "rateTimeUnit": "",
          "unitMultiplier": ""
        }
      ],
      createDateTime: this.cancelReservationData.bookingDate,
      creatorID: null,
      lastModifierID: this._userResolver.getUserData().userName
    };

    completeBookingData['cancellation'] = this.cancelRevObj;
    const cancelReservationRequestObject = new ReservationModel(completeBookingData, 'cancel');
    //cancelReservationRequestObject.getRequestObject();
    console.log("before cancel reservation submit: ", JSON.stringify(cancelReservationRequestObject.getRequestObject()));
    this.fdData.createReservation(cancelReservationRequestObject.getRequestObject()).subscribe(res => {
      console.log("after cancel reservation submit: ", res);
      this.scheduler.control.message("Reservation cancelled successfully.");

      let requestOption = {
        startDate: moment(this.scheduler.control.visibleStart()['value']).format('YYYY-MM-DD'),
        endDate: moment(this.scheduler.control.visibleEnd()['value']).format('YYYY-MM-DD')
      }
      this.getReservationDetailList(requestOption);
    })
  }

  /*   This method will call on console tab change or from other tab to land on console screen */
  public setSchedularDateRange(type?: any) {
    this.fdPageView = 'console';
    if (type == '1') {
      this.dateTab = '1';
      this.config.startDate = moment().format('YYYY-MM-DD');
      this.config.days = 1;
      this.showPicker = false;
      this.selectedStartDate = moment().toDate();
      this.selectedEndDate = moment().toDate();
      this.bsRangeValue = [this.selectedStartDate, this.selectedEndDate];
    } else if (type == '3') {
      this.dateTab = '3';
      this.config.startDate = moment().format('YYYY-MM-DD');
      this.config.days = 3;
      this.showPicker = false;
      this.selectedStartDate = moment().toDate();
      this.selectedEndDate = moment().add('2', 'days').toDate();
      this.bsRangeValue = [this.selectedStartDate, this.selectedEndDate];
    } else if (type == '7') {
      this.dateTab = '7';
      this.config.startDate = moment().format('YYYY-MM-DD');
      this.config.days = 7;
      this.showPicker = false;
      this.selectedStartDate = moment().toDate();
      this.selectedEndDate = moment().add('6', 'days').toDate();
      this.bsRangeValue = [this.selectedStartDate, this.selectedEndDate];
    } else if (type == '15') {
      this.dateTab = '15';
      this.config.startDate = moment().format('YYYY-MM-DD');
      this.config.days = 15;
      this.showPicker = false;
      this.selectedStartDate = moment().toDate();
      this.selectedEndDate = moment().add('14', 'days').toDate();
      this.bsRangeValue = [this.selectedStartDate, this.selectedEndDate];
    } else if (type == 'month') {
      this.dateTab = 'month';
      this.config.startDate = moment().format("YYYY-MM-DD");
      this.config.days = moment().daysInMonth();
      this.showPicker = false;
      this.selectedStartDate = moment().toDate();
      this.selectedEndDate = moment().add((this.config.days - 1), 'days').toDate();
      this.bsRangeValue = [this.selectedStartDate, this.selectedEndDate];
    } else if (type == 'custom') {
      this.showPicker = true;
    } else {
      this.showPicker = false;
    }

    this.countObservable = _.range(this.config.days);

    let requestOption = {
      startDate: this.config.startDate,
      endDate: moment().add(this.config.days, 'd').format('YYYY-MM-DD')
    }

    this.routeParamService.changeRoute({
      url: this.router.url,
      pageName: 'Frontdesk'
    });

    this.getReservationDetailList(requestOption);

  }

  /*   This method will call on date select for quick reservation to get selected room details   */
  getSelectedRoomDetails(roomNumber: any) {
    //console.log("in getSelectedRoomDetails: ", roomUnitID);
    let selectedRoomObj: any;
    let roomListLength = this.roomList.length;
    for (let roomIndex = 0; roomIndex < roomListLength; roomIndex++) {
      let roomUnitItem = this.roomList[roomIndex].roomDetails.find(roomUnitItem => roomUnitItem.roomNumber == roomNumber);
      if (typeof roomUnitItem !== 'undefined') {
        selectedRoomObj = this.roomList[roomIndex];
        selectedRoomObj['ruid'] = roomUnitItem.ruid;
        selectedRoomObj['roomNumber'] = roomUnitItem.roomNumber;
        selectedRoomObj['roomStatus'] = roomUnitItem.roomStatus;
        selectedRoomObj['availableToAssign'] = roomUnitItem.availableToAssign;
        break;
      }
    }
    /*this.roomList.map(roomObj => {
      let roomUnitItem = roomObj.roomDetails.find(roomUnitItem => roomUnitItem.roomNumber == roomNumber);
      if (typeof roomUnitItem !== 'undefined') {
        selectedRoomObj = roomObj;
        selectedRoomObj['ruid'] = roomUnitItem.ruid;
        selectedRoomObj['roomNumber'] = roomUnitItem.roomNumber;
        selectedRoomObj['roomStatus'] = roomUnitItem.roomStatus;
        selectedRoomObj['availableToAssign'] = roomUnitItem.availableToAssign;
      }
    });*/
    return selectedRoomObj;
  }

  createClosed(eventData: any) {
    //console.log("event data: ", eventData);
    if (eventData) {
      eventData['backColor'] = this.getEventColor(eventData['otherData'].bookingStatus, 'backColor');
      eventData['borderColor'] = this.getEventColor(eventData['otherData'].bookingStatus, 'borderColor');
      eventData['fontColor'] = this.getEventColor(eventData['otherData'].bookingStatus, 'fontColor');
      this.events.push(eventData);
      this.scheduler.control.message("Reservation created successfully.");

      let requestOption = {
        startDate: moment(this.scheduler.control.visibleStart()['value']).format('YYYY-MM-DD'),
        endDate: moment(this.scheduler.control.visibleEnd()['value']).format('YYYY-MM-DD')
      }
      this.getReservationDetailList(requestOption);
    }
    this.scheduler.control.clearSelection();
  }

  showBookingSection(bookingId: any, dateModification: boolean) {
    if (typeof this.owlElement !== 'undefined')
      this.owlElement.reInit();

    this.bookingOperationsService.getBookingDetails(bookingId).subscribe(bookingRes => {
      this.eventBookingData = bookingRes;
      console.log("on view details open: ", this.eventBookingData);

      this.eventBookingData['bookingID'] = bookingId;
      if (dateModification) {
        this.eventBookingData.arrivalDate = moment(this.eventBookingData.arrivalDate, 'YYYY-MM-DD HH:mm:ss.S').format('DD-MMM-YYYY');
        this.eventBookingData.departureDate = moment(this.eventBookingData.departureDate, 'YYYY-MM-DD HH:mm:ss.S').format('DD-MMM-YYYY');
      }
      this.fdPageView = 'bookingDetails';
      this.bookingDetailsEditable = true;
      const roomTypeId = this.roomList.find(roomItem => roomItem.roomCode == this.eventBookingData.hotelReservations.hotelReservation[0].roomStays.roomStay[0].roomRates.roomRate[0].roomTypeCode)['roomID'];
      //this.mappedRatePlanList = [];
      this.fdData.getMappedRoomRateList(roomTypeId).subscribe(rateListRes => {
        this.mappedRatePlanList = rateListRes['RTRPMappings'];
      });
    });
  }

  removeCaroselItem(carouselItem: any) {
    this.detailReservationList = _.reject(this.detailReservationList, (item) => item.bookingID === carouselItem.bookingID);
    if (this.detailReservationList.length === 0) {
      this.setSchedularDateRange();
    }
  }

  carouselPrev() {
    this.owlElement.previous([200]);
  }

  carouselNext() {
    this.owlElement.next([200]);
  }

  closeCheckInOut(type: string) {
    console.log("in close check in-out: ", type);
    this.modalRef.hide();
  }

  ngOnDestroy() {
    this.eventSubscription.unsubscribe();
  }

}
