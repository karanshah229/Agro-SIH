import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PestDetectionComponent } from './pest-detection.component';

describe('PestDetectionComponent', () => {
  let component: PestDetectionComponent;
  let fixture: ComponentFixture<PestDetectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PestDetectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PestDetectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
