import { Component, OnInit } from '@angular/core';
import { Board, SquareState, convertFieldCoordinatesToIndex, Menace } from '../../menace/menace';

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

  constructor() { }

  ngOnInit() {}

  cellClicked(row: number, col: number) {
    if (this.board.whoseTurn !== SquareState.Player) {
      return;
    }

    this.board.recordMove(row, col);

    setTimeout(() => {
      this.menace.takeTurn();
    }, 2000);
  }

}
