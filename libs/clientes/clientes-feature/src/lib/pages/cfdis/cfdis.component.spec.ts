import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CfdisComponent } from './cfdis.component';

describe('CfdisComponent', () => {
  let component: CfdisComponent;
  let fixture: ComponentFixture<CfdisComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CfdisComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CfdisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
