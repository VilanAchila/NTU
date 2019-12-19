import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChillerPlantComponent } from './chiller-plant.component';

describe('ChillerPlantComponent', () => {
  let component: ChillerPlantComponent;
  let fixture: ComponentFixture<ChillerPlantComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChillerPlantComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChillerPlantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
