import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RestaurantTableManagementComponent } from './restaurant-table-management.component';

describe('RestaurantTableManagementComponent', () => {
  let component: RestaurantTableManagementComponent;
  let fixture: ComponentFixture<RestaurantTableManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RestaurantTableManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RestaurantTableManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
