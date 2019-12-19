import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RealTimeLineComponent } from './real-time-line.component';

describe('RealTimeLineComponent', () => {
  let component: RealTimeLineComponent;
  let fixture: ComponentFixture<RealTimeLineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RealTimeLineComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RealTimeLineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
