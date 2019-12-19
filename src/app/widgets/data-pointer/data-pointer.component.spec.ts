import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DataPointerComponent } from './data-pointer.component';

describe('DataPointerComponent', () => {
  let component: DataPointerComponent;
  let fixture: ComponentFixture<DataPointerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DataPointerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataPointerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
