import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Trend3dComponent } from './trend3d.component';

describe('Trend3dComponent', () => {
  let component: Trend3dComponent;
  let fixture: ComponentFixture<Trend3dComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Trend3dComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Trend3dComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
