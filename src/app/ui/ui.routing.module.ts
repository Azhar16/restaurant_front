import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { CommonModule } from "@angular/common";

import { AuthGuard } from "../shared/guards/auth.guard";
import { CounterResolverService } from "../shared/counter.resolver.service";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { LayoutComponent } from "./layout/layout.component";
import { OthersComponent } from "./others/others.component";
import { FrontdeskComponent } from "./frontdesk/frontdesk.component";
import {
  RestaurantComponent,
  resturentChildComponents,
} from "./restaurant/restaurant.component";
import { RoleGuard } from "../shared/guards/role.guard";

import { UserResolver } from "../shared/user.resolver.service";


export const uiRoutingComponent = [
  DashboardComponent,
  RestaurantComponent,
  resturentChildComponents,
  OthersComponent,
  FrontdeskComponent,
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: "ui",
        component: LayoutComponent,
        resolve: {
          user: UserResolver,
        },
        children: [
          {
            /* leading slash should not be given in the path */
            path: "",
            redirectTo:
              "/ui/dashboard" /* in redirectTo the leading slash is required */,
            pathMatch: "full",
            canActivate: [AuthGuard],
          },
          {
            path: "dashboard",
            component: DashboardComponent,
            canActivate: [AuthGuard],
          },
          {
            path: "restaurant",
            component: RestaurantComponent,
            canActivate: [AuthGuard && RoleGuard],
            data: {
              moduleID: 5,
              moduleName: "Restaurent",
              moduleCode: "RST",
            },
          },
          {
            path: "others",
            component: OthersComponent,
            canActivate: [AuthGuard && RoleGuard],
            data: {
              moduleID: 5,
              moduleName: "Others",
            },
          },
        ],
      },
    ]),
  ],
  exports: [CommonModule, RouterModule],
})
export class UiRoutingModule {}
