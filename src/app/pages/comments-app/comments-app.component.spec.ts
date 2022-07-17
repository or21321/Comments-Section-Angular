import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommentsAppComponent } from './comments-app.component';

describe('CommentsAppComponent', () => {
  let component: CommentsAppComponent;
  let fixture: ComponentFixture<CommentsAppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommentsAppComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommentsAppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
