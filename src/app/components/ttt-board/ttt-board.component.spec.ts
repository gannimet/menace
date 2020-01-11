import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MockPipe } from 'ng-mocks';
import { TttBoardComponent } from './ttt-board.component';
import { ResultPipe } from '../../pipes/result.pipe';

describe('TttBoardComponent', () => {
  let component: TttBoardComponent;
  let fixture: ComponentFixture<TttBoardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        TttBoardComponent,
        MockPipe(ResultPipe),
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TttBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
