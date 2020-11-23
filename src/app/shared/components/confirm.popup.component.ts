import { Component, EventEmitter } from '@angular/core';

@Component({
    selector: 'app-popup-confirm',
    template: `<div class="modal-body text-center">
      <p>{{title}}</p>
      <button type="button" class="btn btn-normal" (click)="confirm()" >Yes</button>
      <button type="button" class="btn btn-normal" (click)="decline()" >No</button>
    </div>`
  })
  export class ConfirmPopupComponent{

    public event: EventEmitter<any> = new EventEmitter();
    title = '';
    //constructor(){}

    public confirm(){
        this.event.emit({confirm: true});
    }
    
    public decline(){
        this.event.emit({confirm: false});
    }
  }