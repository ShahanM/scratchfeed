import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedstatsComponent } from './feedstats.component';

describe('FeedstatsComponent', () => {
  let component: FeedstatsComponent;
  let fixture: ComponentFixture<FeedstatsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FeedstatsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FeedstatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
