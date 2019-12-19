import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertsDashboardComponent } from './alerts-dashboard.component';

describe('AlertsComponent', () => {
  let component: AlertsDashboardComponent;
  let fixture: ComponentFixture<AlertsDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlertsDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlertsDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
