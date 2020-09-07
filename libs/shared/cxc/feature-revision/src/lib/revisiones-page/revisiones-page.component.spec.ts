import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RevisionesPageComponent } from './revisiones-page.component';

describe('RevisionesPageComponent', () => {
  let component: RevisionesPageComponent;
  let fixture: ComponentFixture<RevisionesPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RevisionesPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RevisionesPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
