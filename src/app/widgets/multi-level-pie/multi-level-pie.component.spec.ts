import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiLevelPieComponent } from './multi-level-pie.component';

describe('MultiLevelPieComponent', () => {
  let component: MultiLevelPieComponent;
  let fixture: ComponentFixture<MultiLevelPieComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MultiLevelPieComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MultiLevelPieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
