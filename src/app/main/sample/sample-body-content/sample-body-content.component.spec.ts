import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SampleBodyContentComponent } from './sample-body-content.component';

describe('SampleBodyContentComponent', () => {
  let component: SampleBodyContentComponent;
  let fixture: ComponentFixture<SampleBodyContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SampleBodyContentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SampleBodyContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
