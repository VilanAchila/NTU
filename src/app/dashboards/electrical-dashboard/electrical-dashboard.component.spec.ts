import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ElectricalDashboardComponent } from './electrical-dashboard.component';

describe('ElectricalDashboardComponent', () => {
  let component: ElectricalDashboardComponent;
  let fixture: ComponentFixture<ElectricalDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ElectricalDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ElectricalDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
