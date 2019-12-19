import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MeterTreeComponent } from './meter-tree.component';

describe('MeterTreeComponent', () => {
  let component: MeterTreeComponent;
  let fixture: ComponentFixture<MeterTreeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MeterTreeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MeterTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
