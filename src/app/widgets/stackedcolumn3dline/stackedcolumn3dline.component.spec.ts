import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Stackedcolumn3dlineComponent } from './stackedcolumn3dline.component';

describe('Stackedcolumn3dlineComponent', () => {
  let component: Stackedcolumn3dlineComponent;
  let fixture: ComponentFixture<Stackedcolumn3dlineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Stackedcolumn3dlineComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Stackedcolumn3dlineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
