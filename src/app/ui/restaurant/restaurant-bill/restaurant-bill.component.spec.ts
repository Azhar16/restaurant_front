import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RestaurantBillComponent } from './restaurant-bill.component';

describe('RestaurantBillComponent', () => {
  let component: RestaurantBillComponent;
  let fixture: ComponentFixture<RestaurantBillComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RestaurantBillComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RestaurantBillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
