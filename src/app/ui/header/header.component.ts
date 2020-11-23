import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { Component, Input, OnInit, OnChanges, TemplateRef, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../../services/auth/auth.service';
import { UserResolver } from '../../shared/user.resolver.service';

import * as $ from 'jquery';
import _ from 'underscore';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit, OnChanges {

  now: number;
  subHeaderPaddingLeft: number;
  userData: any;
  private hotelId: number;
  public modalRef: BsModalRef;
  public allowedModuleList: any;

  @Input()
  paramDetails: any;

  /** *********** For night audit customization ******* **/
  public nightAuditPercent: number;

  constructor(
    private _auth: AuthService,
    //private _des: DataEventService,
    private modalService: BsModalService,
    private _router: Router,
    private _userResolver: UserResolver
  ) {
    //this.userData 
    this.now = Date.now();
    setInterval(() => {
      this.now = Date.now();
    }, 10000);
  }

  ngOnInit() {
    this.allowedModuleList = {
      DSB: 'Dashboard'
    }
    this.userData = this._userResolver.getUserData();
    this.hotelId = this._userResolver.getHotelID();
    const storedModules = this.userData.modulesAllowed.modules;

    if (this.userData.is_super_user) {
      this.allowedModuleList['ADM'] = 'Admin';
      this.allowedModuleList['NAT'] = 'Night Audit';
      this.allowedModuleList['OPC'] = 'Open Counter';
      this.allowedModuleList['CCC'] = 'Close Counter';
    } else {
      if (_.findWhere(storedModules, { moduleCode: 'ADM' })) {
        this.allowedModuleList['ADM'] = 'Admin';
      }
      if (_.findWhere(storedModules, { moduleCode: 'NAT' })) {
        this.allowedModuleList['NAT'] = 'Night Audit';
      }
      if (_.findWhere(storedModules, { moduleCode: 'OPC' })) {
        this.allowedModuleList['OPC'] = 'Open Counter';
      }
      if (_.findWhere(storedModules, { moduleCode: 'CCC' })) {
        this.allowedModuleList['CCC'] = 'Close Counter';
      }
    }
    console.log("user data -> -> : ", storedModules, 'stored module', this.userData, this._userResolver.getAllowedModuleList());
  }

  ngAfterViewInit(): void {

    $('#sidebarCollapse').on('click', function (event) {
      event.stopImmediatePropagation();
      event.stopPropagation();
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

    var $myGroup = $('.list-unstyled');
    $myGroup.on('show.bs.collapse', '.collapse', function () {
      $myGroup.find('.collapse.show').removeClass('show');
    });

  }

  ngOnChanges(changes: SimpleChanges) {
    //console.log("in home component change: ", this.paramDetails);
    setTimeout(() => {
      let excessWidth = $("#sub-navbar").outerWidth() - $("#sub-menu1").outerWidth();
      this.subHeaderPaddingLeft = (excessWidth / 2) - $(".nav-item").outerWidth();
    }, 0);
  }

  closeSideSidebar() {
    $('#sidebar').removeClass('active');
    $('.overlay').removeClass('active');
  }

  /*showFrontDeskPage(pageType: any) {
    this._des.newEvent(pageType);
    $('#sidebar').removeClass('active');
    $('.overlay').removeClass('active');
  }*/

  openNightAudit(template: TemplateRef<any>) {

    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, { class: 'gray night-audit-modal modal-dialog-centered' })
    );

    this.nightAuditPercent = 0;
  }

  hideNightAuditModal() {
    this.modalRef.hide();
  }

  cancelNightAudit() {
    console.log("in night audit cancel");
  }


  logout() {
    console.log("in logout");
    this._auth.getLogoutUser(this.userData.userName, this.hotelId).subscribe(res => {
      console.log("after logout response: ", res);
    });
    this._auth.removeLoginCredentialsInCookie();
    setTimeout(() => {
      this._auth.removeToken();
      this._router.navigate(['/login']);
    }, 100);
  }

}
