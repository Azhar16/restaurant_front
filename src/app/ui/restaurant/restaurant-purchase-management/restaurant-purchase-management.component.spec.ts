import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RestaurantPurchaseManagementComponent } from './restaurant-purchase-management.component';

describe('RestaurantPurchaseManagementComponent', () => {
  let component: RestaurantPurchaseManagementComponent;
  let fixture: ComponentFixture<RestaurantPurchaseManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RestaurantPurchaseManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RestaurantPurchaseManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
