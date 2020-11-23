import { Component, OnInit } from "@angular/core";
import { ConfigService } from "./config.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent implements OnInit {
  title = "pms-avatar";

  constructor(private configService: ConfigService) {}

  ngOnInit() {
    console.log(this.configService.getConfig());
  }
}
