import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GoSoduComponent } from './go-sodu.component';

describe('GoSoduComponent', () => {
  let component: GoSoduComponent;
  let fixture: ComponentFixture<GoSoduComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GoSoduComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GoSoduComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
