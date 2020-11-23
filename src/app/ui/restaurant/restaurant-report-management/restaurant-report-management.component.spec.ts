import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RestaurantReportManagementComponent } from './restaurant-report-management.component';

describe('RestaurantReportManagementComponent', () => {
  let component: RestaurantReportManagementComponent;
  let fixture: ComponentFixture<RestaurantReportManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RestaurantReportManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RestaurantReportManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
