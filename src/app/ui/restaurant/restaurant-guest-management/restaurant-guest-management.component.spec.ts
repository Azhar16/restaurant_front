import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RestaurantGuestManagementComponent } from './restaurant-guest-management.component';

describe('RestaurantGuestManagementComponent', () => {
  let component: RestaurantGuestManagementComponent;
  let fixture: ComponentFixture<RestaurantGuestManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RestaurantGuestManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RestaurantGuestManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
