import { Component, DoCheck, EventEmitter, Input, IterableDiffers, OnInit, Output } from '@angular/core';
import { PerfectScrollbarConfigInterface, PerfectScrollbarComponent, PerfectScrollbarDirective } from 'ngx-perfect-scrollbar';

import { AdminUserService } from '../admin.user.service';

import _ from 'underscore';

@Component({
    selector: 'app-admin-user-permission',
    templateUrl: './admin.user.permission.component.html'
})
export class AdminUserPermissionComponent implements OnInit, DoCheck {

    @Input() selectedUser: any;
    @Input() userMappedModuleList: any;
    @Output() submitMappedPermission = new EventEmitter();

    private iterableDiffer: any;
    public userModuleList: any = null;
    public adminModuleList: any = null;
    public config: PerfectScrollbarConfigInterface = {};
    public scrollBarContainerHeight: number;

    constructor(
        private adminUserService: AdminUserService,
        private _iterableDiffers: IterableDiffers
    ) {
        this.iterableDiffer = this._iterableDiffers.find([]).create(null);
     }

    ngOnInit() {        
        this.adminUserService.getDataList('Config/UserManagement/getModules/', 'modules', false).subscribe( moduleList => {
            const headerBuffer = 60;
            this.scrollBarContainerHeight = $('.modal-dialog').outerHeight() - ($('.modal-header').outerHeight() + $('.modal-footer').outerHeight() + headerBuffer);

            this.userModuleList = moduleList.map( (moduleItem: any) => {
                moduleItem['mapped'] = false;
                return moduleItem;
            });
            this.prepareMappedData();
        });
    }

    ngDoCheck() {        
        let changes = this.iterableDiffer.diff(this.userMappedModuleList);
        if (changes) {
            console.log('Changes detected!');
            this.prepareMappedData();
        }
    }

    prepareMappedData() {
        if(this.userModuleList != null){
            // console.log("userMappedModuleList: ", this.userMappedModuleList);
            this.userModuleList.map( moduleItem => {
                moduleItem['mapped'] = typeof this.userMappedModuleList[moduleItem.moduleCode] !== 'undefined' ? true : false;
            });
            this.adminModuleList = this.userModuleList.find(moduleItem => moduleItem.moduleName.toLowerCase() == 'admin').subModule;
            
            this.adminModuleList.map( item => {
                item['mapped'] = typeof this.userMappedModuleList[item.subModuleCode] !== 'undefined' ? true : false;
            });
        }
         //console.log("user module list mapped data: ", this.userModuleList, this.adminModuleList);
    }

    mappedListSubmit() {
        
        let mappedModuleReq = {
            "userId": this.selectedUser.userId,
            "empId": this.selectedUser.empID,
            "module": _.where(this.userModuleList, {"mapped": true})
        };
        let adminMappedModule = _.where(this.adminModuleList, {"mapped": true});
        // console.log('adminMappedModule: ', adminMappedModule);
        if(adminMappedModule.length > 0) {
            let adminModuleObj = this.userModuleList.find( item => item.moduleName == 'Admin');
            adminModuleObj.subModule = adminMappedModule;
            
            let adminModuleIndex = mappedModuleReq.module.findIndex( item => item.moduleName == 'Admin');
            if(adminModuleIndex >= 0) {
                mappedModuleReq.module[adminModuleIndex] = adminModuleObj;
            } else {
                mappedModuleReq.module.push(adminModuleObj);
            }

        } else {            
            let adminModuleIndex = mappedModuleReq.module.findIndex( item => item.moduleName == 'Admin');
            if(adminModuleIndex >= 0) {
                mappedModuleReq.module.splice(adminModuleIndex, 1);
            }
            // mappedModuleReq.module = this.userModuleList;
        }

         //console.log('on mapped: ', {'mappedModuleReq': mappedModuleReq});
           
        this.submitMappedPermission.emit({'mappedModuleReq': mappedModuleReq});
    }
}