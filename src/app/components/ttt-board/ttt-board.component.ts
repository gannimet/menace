import { Component, OnInit, NgZone } from '@angular/core';
import { Board, SquareState, convertFieldCoordinatesToIndex, Menace, Result } from '../../menace/menace';

@Component({
  selector: 'app-ttt-board',
  templateUrl: './ttt-board.component.html',
  styleUrls: ['./ttt-board.component.scss']
})
export class TttBoardComponent implements OnInit {

  board = new Board();
  menace = new Menace(this.board);
  SquareState = SquareState;
  convertFieldCoordinatesToIndex = convertFieldCoordinatesToIndex;
  result: Result;

  constructor() { }

  ngOnInit() {
    this.board.resultEvents.subscribe((result: Result) => {
      this.result = result;
    });
  }

  cellClicked(row: number, col: number) {
    if (this.board.whoseTurn !== SquareState.Player && !this.result) {
      return;
    }

    this.board.recordMove(row, col);

    if (!this.result) {
      setTimeout(() => {
        this.menace.takeTurn();
      }, 0);
    }
  }

  nextGame() {
    if (!this.result) {
      return;
    }

    this.board.reset();
    this.result = undefined;
  }

}
