import { AfterViewInit, AfterViewChecked, ChangeDetectorRef, Component } from '@angular/core';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';

import * as $ from 'jquery';

@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin.layout.component.html'
})
export class AdminLayoutComponent implements AfterViewInit, AfterViewChecked {

  public paramDetails: any;
  public config: PerfectScrollbarConfigInterface = {};
  public scrollBarContainerHeight: number;

  constructor(private cdr: ChangeDetectorRef) {
    this.paramDetails = {
      url: '',
      pageName: ''
    };

    $('body').css({
      'background-color': '#FFF'
    });
  }

  /*ngOnInit() {    
    let buffer = 130;
    this.scrollBarContainerHeight = $(document).height() - ($("#main-navbar").outerHeight() + $("#sub-navbar").outerHeight() + buffer);    
  }*/

  ngAfterViewInit() {

    $(".main-li-menu").click(function (event) {
      $(".collapse.show").not(event.target).removeClass("show");
      $('.main-li-menu').attr('aria-expanded', 'false');
    });
  }

  ngAfterViewChecked() {
    let buffer = 130;
    this.scrollBarContainerHeight = $(document).height() - ($("#main-navbar").outerHeight() + $("#sub-navbar").outerHeight() + buffer);
    //console.log("$(document).height(): ", $(document).height(), $("#main-navbar").outerHeight(), $("#sub-navbar").outerHeight())
    this.cdr.detectChanges();
  }

}