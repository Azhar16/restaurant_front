import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { PerfectScrollbarConfigInterface, PerfectScrollbarComponent } from 'ngx-perfect-scrollbar';

import { AdminMealPlanService } from './admin.meal.plan.service';
import { ConfirmPopupComponent } from '../../../../shared/components/confirm.popup.component';
import { IMealPlan } from './MealPlan';

@Component({
    selector: 'app-admin-layout-meal-plan',
    templateUrl: './admin.meal.plan.component.html'
})
export class AdminMealPlanComponent implements OnInit {
    modalRef: BsModalRef;
    alertMessageDetails = {
        response: false,
        type: null,
        message: null
    };
    showAddMealPlan: boolean;
    mealPlanList: IMealPlan[];
    newMealPlanObj: IMealPlan;
    public config: PerfectScrollbarConfigInterface = {};
    public scrollBarContainerHeight: number;

    constructor(
        private modalService: BsModalService,
        private _adminData: AdminMealPlanService
    ) { }

    ngOnInit() {
        let headerBuffer = 60;
        this.scrollBarContainerHeight = $(document).height() - ($("#main-navbar").outerHeight() + $("#sub-navbar").outerHeight() + $("#footerButtonContainer").outerHeight() + $("#pageHeading").outerHeight() + headerBuffer + 155);
        //console.log("in ng on in it: ", $(document).height(), $("#main-navbar").outerHeight(), $("#sub-navbar").outerHeight(), $("#footerButtonContainer").outerHeight(), $("#pageHeading").outerHeight(), headerBuffer, this.scrollBarContainerHeight);      
        this.showAddMealPlan = false;
        this.getMealPlanList();
    }

    public getMealPlanList() {
        this._adminData.getDataList('Config/Policy/getMealPlans/', 'mealplans').subscribe(mealPlanRes => {
            this.mealPlanList = mealPlanRes;
        });
    }

    public showAddMealPlanRow() {
        // console.log("in show add row: ", this.showAddMealPlan);
        this.newMealPlanObj = {
            mealPlanCode: null,
            mealPlanDesc: null,
            mealCharges: null
        }
        this.showAddMealPlan = !this.showAddMealPlan;
    }

    public createMealPlan() {
        let addMealPlanObj = {
            "mealplans": [
                this.newMealPlanObj
            ]
        }
        this._adminData.addData('Config/Policy/createMealPlans/', addMealPlanObj).subscribe(res => {
            console.log("meal plan add response: ", res);
            this.alertMessageDetails.response = true;
            if (res['message'].toLowerCase() == 'success') {
                this.showAddMealPlan = false;
                this.newMealPlanObj = null;
                this.getMealPlanList();
                this.alertMessageDetails.type = 'success';
                this.alertMessageDetails.message = "New meal plan created successfully";
            } else {
                this.alertMessageDetails.type = 'danger';
                this.alertMessageDetails.message = "Meal plan details creation failed! Please try again.";
            }

            setTimeout(() => {
                this.alertMessageDetails.response = false;
            }, 5000);
        });
    }

    openConfirmModal(indx: number) {
        this.modalRef = this.modalService.show(ConfirmPopupComponent);
        this.modalRef.content.title = 'Are you sure to delete?';
        this.modalRef.content.event.subscribe(data => {
            this.modalRef.hide();
            if (data.confirm == true) {
                this._adminData.removeData(
                    'Config/Policy/removeMealPlan/',
                    {
                        dataID: this.mealPlanList[indx].mealPlanId
                    }
                ).subscribe(res => {
                    this.alertMessageDetails.response = true;
                    if (res['message'].toLowerCase() == 'success') {
                        this.mealPlanList.splice(indx, 1);
                        this.alertMessageDetails.type = 'success';
                        this.alertMessageDetails.message = "Meal plan deleted successfully";
                    } else {
                        this.alertMessageDetails.type = 'danger';
                        this.alertMessageDetails.message = "Meal plan details not deleted! Please try again.";
                    }

                    setTimeout(() => {
                        this.alertMessageDetails.response = false;
                    }, 5000);
                });
            } else {
                console.log('dont go for delete: ', this.mealPlanList[indx]);
            }
        });
    }
}