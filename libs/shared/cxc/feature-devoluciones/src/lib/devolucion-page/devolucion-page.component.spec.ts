import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DevolucionPageComponent } from './devolucion-page.component';

describe('DevolucionPageComponent', () => {
  let component: DevolucionPageComponent;
  let fixture: ComponentFixture<DevolucionPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DevolucionPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DevolucionPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
