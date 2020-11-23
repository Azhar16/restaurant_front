import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { PerfectScrollbarConfigInterface, PerfectScrollbarComponent } from 'ngx-perfect-scrollbar';


import { AdminRatePlanService } from './admin.rate.plans.service';
import { ConfirmPopupComponent } from '../../../../shared/components/confirm.popup.component';
import { ICancellationPolicy } from '../../policy-manager/cancellation-policy/CancellationPolicy';
import { IRatePlan } from './RatePlan';

@Component({
  selector: 'app-admin-layout-rate-plans',
  templateUrl: './admin.rate.plans.component.html',
  styles: [
    `:host >>> .popover {
      max-width:500px;
    }`
  ]
})
export class AdminRatePlansComponent implements OnInit {

  modalRef: BsModalRef;
  alertMessageDetails = {
    response: false,
    type: null,
    message: null
  };

  policyList: any;
  public ratePlanList: IRatePlan[];
  public cancellationPolicyList: ICancellationPolicy[];
  public mappedCancellationPolicyList: ICancellationPolicy[];
  public allCkbox: boolean;
  public allRatePlanCkbox: boolean;
  public addNewRatePlan: IRatePlan;
  public showNewRatePlanRow: boolean;
  public config: PerfectScrollbarConfigInterface = {};
  public scrollBarContainerHeight: number;

  @ViewChild(PerfectScrollbarComponent) componentRef?: PerfectScrollbarComponent;

  constructor(
    private modalService: BsModalService,
    private _adminData: AdminRatePlanService
  ) { }

  ngOnInit() {
    let headerBuffer = 60;
    this.scrollBarContainerHeight = $(document).height() - ($("#main-navbar").outerHeight() + $("#sub-navbar").outerHeight() + $("#footerButtonContainer").outerHeight() + $("#pageHeading").outerHeight() + headerBuffer + 155);
    //console.log("in ng on in it: ", $(document).height(), $("#main-navbar").outerHeight(), $("#sub-navbar").outerHeight(), $("#footerButtonContainer").outerHeight(), $("#pageHeading").outerHeight(), headerBuffer, this.scrollBarContainerHeight);      
    this.showNewRatePlanRow = false;
    this.addNewRatePlan = {
      "ratePlanCode": null,
      "ratePlanName": null,
      "rateplanType": null,
      "ratePlanDesc": null,
      "los": 0,
      "cancelPolicyID": "",
      "isBaseRate": 0,
      "weight": null,
      "weightIsPercent": true,
    }
    this._adminData.getDataList('Config/Policy/getCancelPolicies/', 'cancelPolicies').subscribe(cancellationPolicyRes => {        
      this.cancellationPolicyList = cancellationPolicyRes
      this.getRatePlanList();
    });
  }

  public getRatePlanList() {    
    this._adminData.getDataList('Rateplans/getRateplans/', 'ratePlans').subscribe(ratePlanListRes => {
      this.ratePlanList = ratePlanListRes;
    });
  }

  public editRatePlan(editRatePlanItem: IRatePlan) {
    delete editRatePlanItem.editable;
    let updateRatePlanObject = {
      'ratePlans': [editRatePlanItem]
    };

    this._adminData.updateData('Rateplans/updateRateplans/', updateRatePlanObject).subscribe(res => {
      this.alertMessageDetails.response = true;

      if (res['successList'][0]['status'].toLowerCase() == 'success') {
        this.alertMessageDetails.type = 'success';
        this.alertMessageDetails.message = res['successList'][0]['message'];
        this.getRatePlanList();
      } else {
        this.alertMessageDetails.type = 'danger';
        this.alertMessageDetails.message = "Rate plan details not updated! Please try again.";
      }

      setTimeout(() => {
        this.alertMessageDetails.response = false;
      }, 5000);
    });
  }

  public mapPolicies(ratePlanObj: IRatePlan) {
    console.log("on popover: ", ratePlanObj);

    this.mappedCancellationPolicyList = this.cancellationPolicyList.map(canPolicyItem => {
      canPolicyItem['applied'] = ratePlanObj.cancelPolicyID == canPolicyItem.cancelPolicyId ? true : false;
      return canPolicyItem;
    });
  }

  public selectCKBStatus(ckBoxType: any) {
    if (ckBoxType == 'all') {
      for (let i = 0; i < this.policyList.length; i++) {
        this.policyList[i].checked = this.allCkbox;
      }
    } else {
      this.allCkbox = this.policyList.every(policyItem => policyItem.checked);
    }
  }

  public selectRatePlanCKBStatus(ckBoxType: any) {
    if (ckBoxType == 'all') {
      for (let i = 0; i < this.ratePlanList.length; i++) {
        this.ratePlanList[i].checked = this.allRatePlanCkbox;
      }
    } else {
      this.allRatePlanCkbox = this.ratePlanList.every(ratePlanItem => ratePlanItem.checked);
    }
  }

  public addNewRatePlanDetails() {
    this.addNewRatePlan.rateplanType = this.addNewRatePlan.ratePlanCode;
    let newRatePlanRequestObj = {
      ratePlans: [ this.addNewRatePlan ]
    };

    //console.log("add rate plan: ", newRatePlanRequestObj);

    this._adminData.addData('Rateplans/createRateplans/', newRatePlanRequestObj).subscribe(res => {
      console.log("after add response: ", res);
      this.alertMessageDetails.response = true;
      if (res['successList'][0]['status'].toLowerCase() == 'success') {        
        this.showNewRatePlanRow = false;
        this.getRatePlanList();
        this.alertMessageDetails.type = 'success';
        this.alertMessageDetails.message = res['successList'][0]['message'];
        this.addNewRatePlan = {
          "ratePlanCode": null,
          "ratePlanName": null,
          "rateplanType": null,
          "ratePlanDesc": null,
          "los": 0,
          "cancelPolicyID": "",
          "isBaseRate": 0,
          "weight": null,
          "weightIsPercent": true,
        }
      } else {
        this.alertMessageDetails.type = 'danger';
        this.alertMessageDetails.message = "Rate plan details addition failed! Please try again.";
      }

      setTimeout(() => {
        this.alertMessageDetails.response = false;
      }, 5000);
    })
  }

  public openConfirmModal(indx: number) {
    this.modalRef = this.modalService.show(ConfirmPopupComponent);
    this.modalRef.content.title = 'Are you sure to delete?';
    this.modalRef.content.event.subscribe(data => {
      this.modalRef.hide();
      if (data.confirm == true) {
        this._adminData.removeData(
          'Rateplans/removeRateplans/',
          {
            dataID: this.ratePlanList[indx].ratePlanID
          }
        ).subscribe(res => {
          this.alertMessageDetails.response = true;
          if (res['successList'][0]['status'].toLowerCase() == 'success') {
            this.ratePlanList.splice(indx, 1);
            this.alertMessageDetails.type = 'success';
            this.alertMessageDetails.message = res['successList'][0]['message'];
            this.getRatePlanList();
          } else {
            this.alertMessageDetails.type = 'danger';
            this.alertMessageDetails.message = "Rate plan details not deleted! Please try again.";
          }

          setTimeout(() => {
            this.alertMessageDetails.response = false;
          }, 5000);
        });
      } else {
        console.log('dont go for delete: ', this.ratePlanList[indx]);
      }
    });
  }

}