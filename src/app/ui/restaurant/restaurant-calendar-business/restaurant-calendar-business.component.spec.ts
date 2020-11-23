import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RestaurantCalendarBusinessComponent } from './restaurant-calendar-business.component';

describe('RestaurantCalendarBusinessComponent', () => {
  let component: RestaurantCalendarBusinessComponent;
  let fixture: ComponentFixture<RestaurantCalendarBusinessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RestaurantCalendarBusinessComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RestaurantCalendarBusinessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
