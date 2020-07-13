import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DevolucionesGridComponent } from './devoluciones-grid.component';

describe('DevolucionesGridComponent', () => {
  let component: DevolucionesGridComponent;
  let fixture: ComponentFixture<DevolucionesGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DevolucionesGridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DevolucionesGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
