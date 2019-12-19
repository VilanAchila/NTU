import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupedTrendComponent } from './grouped-trend.component';

describe('GroupedTrendComponent', () => {
  let component: GroupedTrendComponent;
  let fixture: ComponentFixture<GroupedTrendComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupedTrendComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupedTrendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
