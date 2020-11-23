import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RestaurantGuestReviewManagementComponent } from './restaurant-guest-review-management.component';

describe('RestaurantGuestReviewManagementComponent', () => {
  let component: RestaurantGuestReviewManagementComponent;
  let fixture: ComponentFixture<RestaurantGuestReviewManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RestaurantGuestReviewManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RestaurantGuestReviewManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
