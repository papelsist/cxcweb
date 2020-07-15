import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateCargoComponent } from './create-cargo.component';

describe('CreateCargoComponent', () => {
  let component: CreateCargoComponent;
  let fixture: ComponentFixture<CreateCargoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateCargoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateCargoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
