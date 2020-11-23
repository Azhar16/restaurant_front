import { BrowserModule } from "@angular/platform-browser";
import { CookieService } from "ngx-cookie-service";
import { FormsModule } from "@angular/forms";
import { HashLocationStrategy, LocationStrategy } from "@angular/common";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
//import { LoadingIndicatorModule } from '@btapai/ng-loading-indicator';
import { NgModule, APP_INITIALIZER } from "@angular/core";
import { RouterModule } from "@angular/router";

import { AdminModule } from "./admin/admin.module";
import { AppComponent } from "./app.component";
import { AppRoutingModule, appRoutingComponent } from "./app.routing.module";
import { ConfirmPopupComponent } from "./shared/components/confirm.popup.component";
import { DropdownDirective } from "./shared/dropdown.directive";
import { JwtInterceptor } from "./services/jwt.interceptor";
import { LoginComponent } from "./login/login.component";
import { PageNotFoundComponent } from "./page-not-found/page-not-found.component";
import { RouteParameterService } from "./shared/route.parameter.service";
import { UiModule } from "./ui/ui.module";
import { AlertModule } from "./shared";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { ConfirmationPopoverModule } from "angular-confirmation-popover";
import { ConfigService } from "./config.service";
import { NgMultiSelectDropDownModule } from "ng-multiselect-dropdown";
//import { NgxSpinnerModule } from "ngx-spinner";
import { Ng4LoadingSpinnerModule } from "ng4-loading-spinner";

const appConfig = (config: ConfigService) => {
  return () => {
    return config.loadConfig();
  };
};

@NgModule({
  declarations: [
    AppComponent,
    ConfirmPopupComponent,
    DropdownDirective,
    LoginComponent,
    PageNotFoundComponent,
    appRoutingComponent,
  ],
  imports: [
    AdminModule,
    AppRoutingModule,
    BrowserModule,
    HttpClientModule,
    FormsModule,
    AlertModule,
    BrowserAnimationsModule,
    NgMultiSelectDropDownModule.forRoot(),
    Ng4LoadingSpinnerModule.forRoot(),
    // NgxSpinnerModule,
    //LoadingIndicatorModule.forRoot(), // place it into the imports array
    RouterModule.forRoot(
      [
        {
          path: "**",
          component: PageNotFoundComponent,
        },
      ],
      {
        useHash: true,
      }
    ),
    ConfirmationPopoverModule.forRoot({
      confirmButtonType: "danger",
    }),
    UiModule,
  ],
  providers: [
    CookieService,
    HttpClientModule,
    RouteParameterService,
    ConfigService,
    {
      provide: APP_INITIALIZER,
      useFactory: appConfig,
      deps: [ConfigService],
      multi: true,
    },
    {
      provide: LocationStrategy,
      useClass: HashLocationStrategy,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true,
    },
  ],
  entryComponents: [ConfirmPopupComponent],
  bootstrap: [AppComponent],
  exports: [AppRoutingModule],
})
export class AppModule {}
