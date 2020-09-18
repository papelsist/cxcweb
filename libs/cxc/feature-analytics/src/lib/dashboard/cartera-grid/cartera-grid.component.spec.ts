import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CarteraGridComponent } from './cartera-grid.component';

describe('CarteraGridComponent', () => {
  let component: CarteraGridComponent;
  let fixture: ComponentFixture<CarteraGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CarteraGridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CarteraGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
