import { AlertModule } from "ngx-bootstrap/alert";
import { BsDatepickerModule } from "ngx-bootstrap/datepicker";
import { BsDropdownModule } from "ngx-bootstrap/dropdown";
import { CarouselModule } from "ngx-bootstrap/carousel";
import { CommonModule } from "@angular/common";
import { DayPilotModule } from "daypilot-pro-angular";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgModule } from "@angular/core";
import { OwlModule } from "ngx-owl-carousel";
import {
  PerfectScrollbarModule,
  PerfectScrollbarConfigInterface,
  PERFECT_SCROLLBAR_CONFIG,
} from "ngx-perfect-scrollbar";
import { PopoverModule } from "ngx-bootstrap/popover";
import { ProgressbarModule } from "ngx-bootstrap/progressbar";
import { PaginationModule } from "ngx-bootstrap/pagination";
import { TabsModule } from "ngx-bootstrap/tabs";

import { ClickElsewhereDirective } from "../shared/directives/click.elsewhere.directive";
import { DataService } from "./scheduler/data.service";
import { DataEventService } from "../shared/data.event.service";
import { FooterComponent } from "./footer/footer.component";
import { FrontDeskService } from "./services/front.desk.services";
import { HeaderComponent } from "./header/header.component";
import { HousekeepingService } from "./services/housekeeping.services";
import { LayoutComponent } from "./layout/layout.component";
import {
  SchedulerComponent,
  schedulerSupportComponent,
} from "./scheduler/scheduler.component";
import { SharedModule } from "../shared/shared.module";
import { UiRoutingModule, uiRoutingComponent } from "./ui.routing.module";
import { ConfirmationPopoverModule } from "angular-confirmation-popover";

import { NgMultiSelectDropDownModule } from "ng-multiselect-dropdown";

import { NgxSpinnerModule } from "ngx-spinner";
import { Ng4LoadingSpinnerModule } from "ng4-loading-spinner";

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  wheelPropagation: true,
  wheelSpeed: 15,
};

@NgModule({
  imports: [
    AlertModule.forRoot(),
    BsDatepickerModule.forRoot(),
    BsDropdownModule.forRoot(),
    CarouselModule.forRoot(),
    CommonModule,
    DayPilotModule,
    FormsModule,
    OwlModule,
    PerfectScrollbarModule,
    PopoverModule.forRoot(),
    ProgressbarModule.forRoot(),
    PaginationModule.forRoot(),
    NgMultiSelectDropDownModule.forRoot(),
    ReactiveFormsModule,
    SharedModule,
    TabsModule.forRoot(),
    NgxSpinnerModule,
    Ng4LoadingSpinnerModule.forRoot(),
    UiRoutingModule,
    ConfirmationPopoverModule.forRoot({
      confirmButtonType: "danger",
    }),
  ],
  declarations: [
    ClickElsewhereDirective,
    FooterComponent,
    HeaderComponent,
    LayoutComponent,
    SchedulerComponent,
    schedulerSupportComponent,
    uiRoutingComponent,
  ],
  exports: [LayoutComponent, SchedulerComponent],
  providers: [
    DataService,
    DataEventService,
    FrontDeskService,
    HousekeepingService,
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG,
    },
  ],
})
export class UiModule {}
