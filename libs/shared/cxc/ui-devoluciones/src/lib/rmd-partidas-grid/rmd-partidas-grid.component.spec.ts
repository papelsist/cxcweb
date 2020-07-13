import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RmdPartidasGridComponent } from './rmd-partidas-grid.component';

describe('RmdPartidasGridComponent', () => {
  let component: RmdPartidasGridComponent;
  let fixture: ComponentFixture<RmdPartidasGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RmdPartidasGridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RmdPartidasGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
