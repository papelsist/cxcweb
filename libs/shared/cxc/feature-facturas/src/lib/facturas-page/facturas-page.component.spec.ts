import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FacturasPageComponent } from './facturas-page.component';

describe('FacturasPageComponent', () => {
  let component: FacturasPageComponent;
  let fixture: ComponentFixture<FacturasPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FacturasPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FacturasPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
