import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../../../services/auth/auth.service';
import { DataEventService } from '../../../shared/data.event.service';
import { UserResolver } from '../../../shared/user.resolver.service';

@Component({
  selector: 'app-admin-header',
  templateUrl: './admin.header.component.html',
  styleUrls: ['./admin.header.component.scss']
})
export class AdminHeaderComponent implements OnInit, OnChanges {

  now: number;
  subHeaderPaddingLeft: number;
  userData: any;

  @Input()
  paramDetails: any;

  constructor(private _auth: AuthService, private _des: DataEventService, private _router: Router, private _userResolver: UserResolver) {
    
    this.now = Date.now();
    setInterval(() => {
      this.now = Date.now();
    }, 10000);
  }

  ngOnInit() { 
    this.userData = this._userResolver.getUserData();
  }

  ngAfterViewInit(): void {

    $('#sidebarCollapse').on('click', function () {
      if ($('#sidebar').hasClass('active')) {
        $('#sidebar').removeClass('active');
        $('.overlay').removeClass('active');
      } else {
        $('#sidebar').addClass('active');
        $('.overlay').addClass('active');
        $('.collapse.in').toggleClass('in');
        $('a[aria-expanded=true]').attr('aria-expanded', 'false');
      }
    });

    $('#dismiss, .overlay, .side-link').on('click', function () {
      $('#sidebar').removeClass('active');
      $('.overlay').removeClass('active');
    });  


    setTimeout(() => {
      let excessWidth = $("#sub-navbar").outerWidth() - $("#sub-menu1").outerWidth();
      this.subHeaderPaddingLeft = (excessWidth / 2) - $(".nav-item").outerWidth();
    }, 0);
  }

  ngOnChanges(changes: SimpleChanges) {
    setTimeout(() => {
      let excessWidth = $("#sub-navbar").outerWidth() - $("#sub-menu1").outerWidth();
      this.subHeaderPaddingLeft = (excessWidth / 2) - $(".nav-item").outerWidth();
    }, 0);
  }

  showFrontDeskPage(pageType) {
    this._des.newEvent(pageType);
    $('#sidebar').removeClass('active');
    $('.overlay').removeClass('active');
  }

  logout() {
    this._auth.removeToken();
    this._auth.removeLoginCredentialsInCookie();
    this._router.navigate(['/login']);
  }

}
