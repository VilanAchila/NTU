import { TestBed } from '@angular/core/testing';

import { EquipmentBreakdownDataService } from './equipment-breakdown-data.service';

describe('EquipmentBreakdownDataService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EquipmentBreakdownDataService = TestBed.get(EquipmentBreakdownDataService);
    expect(service).toBeTruthy();
  });
});
