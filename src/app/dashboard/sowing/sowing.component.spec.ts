import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SowingComponent } from './sowing.component';

describe('SowingComponent', () => {
  let component: SowingComponent;
  let fixture: ComponentFixture<SowingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SowingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SowingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
