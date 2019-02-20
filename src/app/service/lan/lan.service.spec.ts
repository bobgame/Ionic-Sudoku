import { TestBed } from '@angular/core/testing';

import { LanService } from './lan.service';

describe('LanService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LanService = TestBed.get(LanService);
    expect(service).toBeTruthy();
  });
});
