import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SiteWaterDashboardComponent } from './site-water-dashboard.component';

describe('SiteWaterDashboardComponent', () => {
  let component: SiteWaterDashboardComponent;
  let fixture: ComponentFixture<SiteWaterDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SiteWaterDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SiteWaterDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
