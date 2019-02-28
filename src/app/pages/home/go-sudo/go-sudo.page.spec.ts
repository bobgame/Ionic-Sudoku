import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GoSudoPage } from './go-sudo.page';

describe('GoSudoPage', () => {
  let component: GoSudoPage;
  let fixture: ComponentFixture<GoSudoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [GoSudoPage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GoSudoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
