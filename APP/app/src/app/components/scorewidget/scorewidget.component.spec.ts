import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScorewidgetComponent } from './scorewidget.component';

describe('ScorewidgetComponent', () => {
  let component: ScorewidgetComponent;
  let fixture: ComponentFixture<ScorewidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScorewidgetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ScorewidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
