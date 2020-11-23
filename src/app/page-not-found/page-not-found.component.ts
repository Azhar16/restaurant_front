import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-page-not-found',
  templateUrl: './page-not-found.component.html'
})
export class PageNotFoundComponent implements OnInit {
  public href: string = "";
  public isDisplayAdmin: boolean = false;

  constructor(private router: Router) { }

  ngOnInit() {
    this.href = this.router.url;
    this.isDisplayAdmin = !this.href.match(/admin/g) ? false : true;

  }

  pageReferer(hrefType: string) {
    if (hrefType == 'admin')
      this.router.navigate(['/admin']);
    else if (hrefType == 'dashboard')
      this.router.navigate(['/ui/dashboard']);
  }

}
