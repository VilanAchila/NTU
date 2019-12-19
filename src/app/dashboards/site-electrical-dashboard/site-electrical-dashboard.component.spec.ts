import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SiteElectricalDashboardComponent } from './site-electrical-dashboard.component';

describe('SiteElectricalDashboardComponent', () => {
  let component: SiteElectricalDashboardComponent;
  let fixture: ComponentFixture<SiteElectricalDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SiteElectricalDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SiteElectricalDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
