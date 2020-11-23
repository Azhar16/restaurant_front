import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { PerfectScrollbarConfigInterface, PerfectScrollbarComponent } from 'ngx-perfect-scrollbar';

import { AdminRoomTaxService } from './admin.room.taxes.service';
import { ConfirmPopupComponent } from '../../../../shared/components/confirm.popup.component';
import { ITax } from './Taxes';

@Component({
  selector: 'app-admin-layout-room-taxes',
  templateUrl: './admin.room.taxes.component.html'
})
export class AdminRoomTaxesComponent implements OnInit {

  modalRef: BsModalRef;
  alertMessageDetails = {
    response: false,
    type: null,
    message: null
  };

  public config: PerfectScrollbarConfigInterface = {};
  public scrollBarContainerHeight: number;

  public taxList: ITax[];
  public showAddTax: boolean = false;
  public newTaxObject: ITax;

  public newTaxCode: string;
  public newTaxDescription: string;
  public newTaxAmount: number;
  public newapplicationLabel: string;
  public newTaxPercent: boolean = false;

  @ViewChild(PerfectScrollbarComponent) componentRef?: PerfectScrollbarComponent;

  constructor(
    private modalService: BsModalService,
    private _adminData: AdminRoomTaxService
  ) { }

  ngOnInit() {
    let headerBuffer = 65;
    this.scrollBarContainerHeight = $(document).height() - ($("#main-navbar").outerHeight() + $("#sub-navbar").outerHeight() + $("#footerButtonContainer").outerHeight() + $("#pageHeading").outerHeight() + headerBuffer + 120);
    this.getTaxesList();
  }

  public getTaxesList() {
    this._adminData.getDataList('Config/Taxes/getTaxes/', 'taxes').subscribe(taxRes => {
      this.taxList = taxRes;
    });
  }

  public toggleCreateTax() {
    this.showAddTax = !this.showAddTax;
    this.newTaxObject = {
      applicationLevel: null,
      percent: true,
      taxAmount: null,
      taxCode: null,
      taxDescription: null,
    }
    this.componentRef.directiveRef.scrollToBottom(-45, 300);
  }

  public createTax() {

    let createTaxObject = {
      'taxes': [
        this.newTaxObject
      ]
    };

    this._adminData.addData('Config/Taxes/saveTax/', createTaxObject).subscribe(res => {
      this.alertMessageDetails.response = true;

      if (res['message'].toLowerCase() == 'success') {
        this.newTaxCode = '';
        this.newTaxDescription = '';
        this.newTaxAmount = null;
        this.newapplicationLabel = '';
        this.newTaxPercent = false;
        this.showAddTax = false;
        this.getTaxesList();
        this.alertMessageDetails.type = 'success';
        this.alertMessageDetails.message = "New tax created successfully";
        this.getTaxesList();
      } else {
        this.alertMessageDetails.type = 'danger';
        this.alertMessageDetails.message = "Tax details creation failed! Please try again.";
      }

      setTimeout(() => {
        this.alertMessageDetails.response = false;
      }, 5000);
    })
  }

  public editTax(indx: number) {
    let updateTaxObject = {
      "taxes": [
        this.taxList[indx]
      ]
    };

    this._adminData.updateData('Config/Taxes/updateTax/', updateTaxObject).subscribe(res => {
      this.alertMessageDetails.response = true;

      if (res['message'].toLowerCase() == 'success') {
        this.alertMessageDetails.type = 'success';
        this.alertMessageDetails.message = "Tax updated successfully";
      } else {
        this.alertMessageDetails.type = 'danger';
        this.alertMessageDetails.message = "Tax details not updated! Please try again.";
      }

      setTimeout(() => {
        this.alertMessageDetails.response = false;
      }, 5000);
    });
  }

  public openConfirmModal(indx: number) {
    this.modalRef = this.modalService.show(ConfirmPopupComponent);
    this.modalRef.content.title = 'Are you sure to delete?';
    this.modalRef.content.event.subscribe(data => {
      this.modalRef.hide();
      if (data.confirm == true) {
        this._adminData.removeData(
          'Config/Taxes/removeTax/',
          {
            dataID: this.taxList[indx].taxId
          }
        ).subscribe(res => {
          this.alertMessageDetails.response = true;
//          {"successList":[{"status":"Success","message":"Tax deleted Successfully for taxID: 2211","rowsUpdated":1,"bookingId":0,"folioId":0}]}
          if (res['successList'][0]['status'].toLowerCase() == 'success') {
            this.taxList.splice(indx, 1);
            this.alertMessageDetails.type = 'success';
            this.alertMessageDetails.message = res['successList'][0]['message'];
            this.getTaxesList();
          } else {
            this.alertMessageDetails.type = 'danger';
            this.alertMessageDetails.message = "Tax details not deleted! Please try again.";
          }

          setTimeout(() => {
            this.alertMessageDetails.response = false;
          }, 5000);
        });
      } else {
        console.log('dont go for delete: ', this.taxList[indx]);
      }
    });
  }
}