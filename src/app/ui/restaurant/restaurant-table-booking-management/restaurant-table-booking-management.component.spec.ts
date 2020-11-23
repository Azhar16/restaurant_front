import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RestaurantTableBookingManagementComponent } from './restaurant-table-booking-management.component';

describe('RestaurantTableBookingManagementComponent', () => {
  let component: RestaurantTableBookingManagementComponent;
  let fixture: ComponentFixture<RestaurantTableBookingManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RestaurantTableBookingManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RestaurantTableBookingManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
