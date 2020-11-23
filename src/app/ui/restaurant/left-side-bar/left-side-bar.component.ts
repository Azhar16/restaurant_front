import { AfterViewInit, Component, OnInit } from '@angular/core';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';

import { DataEventService } from '../../../shared/data.event.service';

@Component({
  selector: 'app-left-side-bar',
  templateUrl: './left-side-bar.component.html',
  styleUrls: ['./left-side-bar.component.scss']
})
export class LeftSideBarComponent implements OnInit, AfterViewInit {

  public config: PerfectScrollbarConfigInterface = {};
  public scrollBarContainerHeight: number;

  constructor(private _des: DataEventService) { }

  ngOnInit() {
    let buffer = 10;
    this.scrollBarContainerHeight = $(document).height() - ($("#main-navbar").outerHeight() + $("#sub-navbar").outerHeight() + $("#uiFooter").outerHeight() + buffer);
  }

  ngAfterViewInit() {
    let buffer = 10;
    this.scrollBarContainerHeight = $(document).height() - ($("#main-navbar").outerHeight() + $("#sub-navbar").outerHeight() + $("#uiFooter").outerHeight() + buffer);
    $(".components").click(function (event) {      
      $(".collapse.show").each(function(key, value){
        $(value).siblings("a").not(event.target).trigger('click');
      });
    });
  }

  public closeSideSidebar() {
    $('#sidebar').removeClass('active');
    $('.overlay').removeClass('active');
  }

  public showRestaurantDetails(reportType: string) {
    this._des.newEvent(reportType);
    $('#sidebar').removeClass('active');
    $('.overlay').removeClass('active');
  }

}
