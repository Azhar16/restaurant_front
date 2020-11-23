import { Component, OnInit, HostListener } from '@angular/core';
import { RouteParameterService } from '../../shared/route.parameter.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html'
})
export class LayoutComponent implements OnInit {

  paramDetails: any;

  constructor(private routeParamService: RouteParameterService) {
    this.paramDetails = {
      url: '',
      pageName: ''
    };
  }

  ngOnInit() { }

  ngAfterViewInit(): void {
    this.routeParamService.currentRouteData.subscribe(routeData => {
      this.paramDetails = routeData;
      if (this.paramDetails.pageName == 'Dashboard') {
        $('body').css({
          'background-color': '#EEE'
        });
      } else {
        $('body').css({
          'background-color': '#FFF'
        });
      }
    });
  }

  @HostListener('click') openDropdown(eventData: Event) {

    this.routeParamService.currentRouteData.subscribe(routeData => {
      this.paramDetails = routeData;

      if (this.paramDetails.pageName == 'Dashboard') {

        $('body').css({
          'background-color': '#EEE'
        });

      } else {

        $('body').css({
          'background-color': '#FFF'
        });

      }
    });
  }
}
