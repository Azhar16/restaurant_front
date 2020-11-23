import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RestaurantRecipeComponent } from './restaurant-recipe.component';

describe('RestaurantRecipeComponent', () => {
  let component: RestaurantRecipeComponent;
  let fixture: ComponentFixture<RestaurantRecipeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RestaurantRecipeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RestaurantRecipeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
