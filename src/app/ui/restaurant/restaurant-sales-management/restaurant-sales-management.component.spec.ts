import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RestaurantSalesManagementComponent } from './restaurant-sales-management.component';

describe('RestaurantSalesManagementComponent', () => {
  let component: RestaurantSalesManagementComponent;
  let fixture: ComponentFixture<RestaurantSalesManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RestaurantSalesManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RestaurantSalesManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
