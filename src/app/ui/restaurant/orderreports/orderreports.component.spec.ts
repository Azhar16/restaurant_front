import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderreportsComponent } from './orderreports.component';

describe('OrderreportsComponent', () => {
  let component: OrderreportsComponent;
  let fixture: ComponentFixture<OrderreportsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderreportsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderreportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
