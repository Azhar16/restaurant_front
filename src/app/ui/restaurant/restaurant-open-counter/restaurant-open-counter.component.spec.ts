import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RestaurantOpenCounterComponent } from './restaurant-open-counter.component';

describe('RestaurantOpenCounterComponent', () => {
  let component: RestaurantOpenCounterComponent;
  let fixture: ComponentFixture<RestaurantOpenCounterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RestaurantOpenCounterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RestaurantOpenCounterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
