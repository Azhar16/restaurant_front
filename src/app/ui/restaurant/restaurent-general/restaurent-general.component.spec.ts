import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RestaurentGeneralComponent } from './restaurent-general.component';

describe('RestaurentGeneralComponent', () => {
  let component: RestaurentGeneralComponent;
  let fixture: ComponentFixture<RestaurentGeneralComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RestaurentGeneralComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RestaurentGeneralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
