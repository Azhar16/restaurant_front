import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RestaurantOrderManagementComponent } from './restaurant-order-management.component';

describe('RestaurantOrderManagementComponent', () => {
  let component: RestaurantOrderManagementComponent;
  let fixture: ComponentFixture<RestaurantOrderManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RestaurantOrderManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RestaurantOrderManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
