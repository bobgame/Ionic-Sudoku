import { TestBed } from '@angular/core/testing';

import { SoduService } from './sodu.service';

describe('SoduService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SoduService = TestBed.get(SoduService);
    expect(service).toBeTruthy();
  });
});
