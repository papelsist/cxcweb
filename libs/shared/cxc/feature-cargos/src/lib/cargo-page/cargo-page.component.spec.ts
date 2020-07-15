import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CargoPageComponent } from './cargo-page.component';

describe('CargoPageComponent', () => {
  let component: CargoPageComponent;
  let fixture: ComponentFixture<CargoPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CargoPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CargoPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
