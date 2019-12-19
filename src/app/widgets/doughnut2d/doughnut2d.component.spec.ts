import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Doughnut2dComponent } from './doughnut2d.component';

describe('Doughnut2dComponent', () => {
  let component: Doughnut2dComponent;
  let fixture: ComponentFixture<Doughnut2dComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Doughnut2dComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Doughnut2dComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
