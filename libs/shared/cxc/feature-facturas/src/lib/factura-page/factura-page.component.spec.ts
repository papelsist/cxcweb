import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FacturaPageComponent } from './factura-page.component';

describe('FacturaPageComponent', () => {
  let component: FacturaPageComponent;
  let fixture: ComponentFixture<FacturaPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FacturaPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FacturaPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
