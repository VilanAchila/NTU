import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WaterDashboardComponent } from './water-dashboard.component';

describe('WaterDashboardComponent', () => {
  let component: WaterDashboardComponent;
  let fixture: ComponentFixture<WaterDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WaterDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WaterDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
