import { Component, OnInit } from '@angular/core';
import * as _ from "lodash";

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  currentFullYear: number;
  constructor() { }

  ngOnInit() {
    /*let testLoadAsh = _.partition([1, 2, 3, 4], n => n % 2);
    console.log("loadash: ", testLoadAsh);*/
    this.currentFullYear = new Date().getFullYear();
  }

}
