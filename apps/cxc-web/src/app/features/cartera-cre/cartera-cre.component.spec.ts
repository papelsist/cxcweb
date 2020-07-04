import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CarteraCreComponent } from './cartera-cre.component';

describe('CarteraCreComponent', () => {
  let component: CarteraCreComponent;
  let fixture: ComponentFixture<CarteraCreComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CarteraCreComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CarteraCreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
