import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RestaurantCloseCounterComponent } from './restaurant-close-counter.component';

describe('RestaurantCloseCounterComponent', () => {
  let component: RestaurantCloseCounterComponent;
  let fixture: ComponentFixture<RestaurantCloseCounterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RestaurantCloseCounterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RestaurantCloseCounterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
