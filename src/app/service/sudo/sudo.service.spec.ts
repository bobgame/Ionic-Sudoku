import { TestBed } from '@angular/core/testing';

import { SudoService } from './sudo.service';

describe('SudoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SudoService = TestBed.get(SudoService);
    expect(service).toBeTruthy();
  });
});
