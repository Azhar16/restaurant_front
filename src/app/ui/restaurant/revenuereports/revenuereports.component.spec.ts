import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RevenuereportsComponent } from './revenuereports.component';

describe('RevenuereportsComponent', () => {
  let component: RevenuereportsComponent;
  let fixture: ComponentFixture<RevenuereportsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RevenuereportsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RevenuereportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
