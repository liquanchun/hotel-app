import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoleFunctionComponent } from './role-function.component';

describe('RoleFunctionComponent', () => {
  let component: RoleFunctionComponent;
  let fixture: ComponentFixture<RoleFunctionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoleFunctionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoleFunctionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
