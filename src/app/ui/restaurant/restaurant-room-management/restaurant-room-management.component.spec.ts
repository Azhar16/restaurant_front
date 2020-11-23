import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RestaurantRoomManagementComponent } from './restaurant-room-management.component';

describe('RestaurantRoomManagementComponent', () => {
  let component: RestaurantRoomManagementComponent;
  let fixture: ComponentFixture<RestaurantRoomManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RestaurantRoomManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RestaurantRoomManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
