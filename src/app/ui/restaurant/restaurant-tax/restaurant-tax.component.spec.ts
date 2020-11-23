import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RestaurantTaxComponent } from './restaurant-tax.component';

describe('RestaurantTaxComponent', () => {
  let component: RestaurantTaxComponent;
  let fixture: ComponentFixture<RestaurantTaxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RestaurantTaxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RestaurantTaxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
