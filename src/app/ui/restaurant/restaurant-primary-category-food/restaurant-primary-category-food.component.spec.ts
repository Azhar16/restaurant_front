import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RestaurantPrimaryCategoryFoodComponent } from './restaurant-primary-category-food.component';

describe('RestaurantPrimaryCategoryFoodComponent', () => {
  let component: RestaurantPrimaryCategoryFoodComponent;
  let fixture: ComponentFixture<RestaurantPrimaryCategoryFoodComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RestaurantPrimaryCategoryFoodComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RestaurantPrimaryCategoryFoodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
