import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GoSoduPage } from './go-sodu.page';

describe('GoSoduPage', () => {
  let component: GoSoduPage;
  let fixture: ComponentFixture<GoSoduPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GoSoduPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GoSoduPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
