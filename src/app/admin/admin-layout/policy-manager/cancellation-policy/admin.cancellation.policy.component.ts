import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { PerfectScrollbarConfigInterface, PerfectScrollbarComponent } from 'ngx-perfect-scrollbar';

import { AdminCancellationPolicyService } from './admin.cancellation.policy.service';
import { ConfirmPopupComponent } from '../../../../shared/components/confirm.popup.component';
import { ICancellationPolicy } from './CancellationPolicy';

@Component({
    selector: 'app-admin-layout-cancellation-policy',
    templateUrl: './admin.cancellation.policy.component.html'
})
export class AdminCancellationPolicyComponent implements OnInit {
    modalRef: BsModalRef;
    alertMessageDetails = {
        response: false,
        type: null,
        message: null
    };

    public config: PerfectScrollbarConfigInterface = {};
    public scrollBarContainerHeight: number;

    public cancellationPolicyList: ICancellationPolicy[];
    public addCanPolicyItem: ICancellationPolicy;
    public showAddCancellationRow: boolean;

    constructor(
        private modalService: BsModalService,
        private _adminData: AdminCancellationPolicyService
    ) { }

    ngOnInit() {
        let headerBuffer = 60;
        this.scrollBarContainerHeight = $(document).height() - ($("#main-navbar").outerHeight() + $("#sub-navbar").outerHeight() + $("#footerButtonContainer").outerHeight() + $("#pageHeading").outerHeight() + headerBuffer + 155);
        //console.log("in ng on in it: ", $(document).height(), $("#main-navbar").outerHeight(), $("#sub-navbar").outerHeight(), $("#footerButtonContainer").outerHeight(), $("#pageHeading").outerHeight(), headerBuffer, this.scrollBarContainerHeight);      
        this.showAddCancellationRow = false;
        this.getCancellationPolicyList();
    }

    public getCancellationPolicyList() {
      this._adminData.getDataList('Config/Policy/getCancelPolicies/', 'cancelPolicies').subscribe(cancellationPolicyRes => {        
        this.cancellationPolicyList = cancellationPolicyRes.map(item => {
          item.offsetTimeUnit = item.offsetTimeUnit == 'Day' ? true : false;
          return item;
        });
      });
    }

    public displayAddCancellationPolicy() {
      this.showAddCancellationRow = !this.showAddCancellationRow;
      this.addCanPolicyItem = {
        policyCode: null,
        policyDesc: null,
        offsetTimeUnit: true,
        offsetUnitMultiplier: null,
        offsetDropTime: 'Before Arrival',
        penaltyType: null,
        penalityAmount: null
      }
    }

    public saveCancellationPolicy() {
      this.addCanPolicyItem.offsetTimeUnit = this.addCanPolicyItem.offsetTimeUnit ? 'Day' : 'Hour'
      let addCancellationPolicyObj = {
          "cancelPolicies": [
              this.addCanPolicyItem
          ]
      }
      this._adminData.addData('Config/Policy/createCancelPolicy/', addCancellationPolicyObj).subscribe(res => {
          console.log("cancellation policy add response: ", res);
          this.alertMessageDetails.response = true;
          if (res['successList'][0]['status'].toLowerCase() == 'success') {
              this.showAddCancellationRow = false;
              this.addCanPolicyItem = null;
              this.alertMessageDetails.type = 'success';
              this.alertMessageDetails.message = res['successList'][0]['message'];
              this.getCancellationPolicyList();
          } else {
              this.alertMessageDetails.type = 'danger';
              this.alertMessageDetails.message = "Cancellation policy creation failed! Please try again.";
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
            'Config/Policy/removeCancelPolicy/',
            {             
              dataID: this.cancellationPolicyList[indx].cancelPolicyId
            }
          ).subscribe(res => {
            this.alertMessageDetails.response = true;
            if (res['successList'][0]['status'].toLowerCase() == 'success') {
              this.cancellationPolicyList.splice(indx, 1);
              this.alertMessageDetails.type = 'success';
              this.alertMessageDetails.message = res['successList'][0]['message'];
            } else {
              this.alertMessageDetails.type = 'danger';
              this.alertMessageDetails.message = "Cancellation policy details not deleted! Please try again.";
            }
  
            setTimeout(() => {
              this.alertMessageDetails.response = false;
            }, 5000);
          });
        } else {
          console.log('dont go for delete: ', );
        }
      });
    }

    public editCancellationPolicy (cancellationPolicyItem: ICancellationPolicy) {
      delete cancellationPolicyItem.editable;
      cancellationPolicyItem.offsetTimeUnit = cancellationPolicyItem.offsetTimeUnit == 'true' ? 'Day' : 'Hour';
      let updateCancelPolicyItem = {
        "cancelPolicies": [cancellationPolicyItem]
      }
      this._adminData.updateData('Config/Policy/updateCancelPolicy/', updateCancelPolicyItem).subscribe(updateRes => {
        console.log("after update response: ", updateRes);
      });
      

    }
}