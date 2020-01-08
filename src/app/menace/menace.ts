import permutationMappings from '../../assets/permutation-mappings.json';
import { EventEmitter } from '@angular/core';

export enum SquareState {
  Menace = 'X',
  Player = 'O',
  Free = ' ',
}

export const convertIndexToFieldCoordinates = (index: number): {
  row: number, col: number
} => {
  return {
    row: Math.floor(index / 3),
    col: index % 3,
  };
};

export const convertFieldCoordinatesToIndex = (row: number, col: number): number => {
  return row * 3 + col;
};

export interface BeadDescriptor {
  field: number;
  numberOfBeads: number;
}

export enum Result {
  Menace = 'Menace',
  Player = 'Player',
  Draw = 'Draw',
}

export class Board {

  state: SquareState[];
  whoseTurn = SquareState.Player;
  resultEvents = new EventEmitter<Result>();

  constructor() {
    this.reset();
  }

  checkResult(): Result | undefined {
    if (this.state[0] !== SquareState.Free) {
      if (this.state[0] === this.state[1] && this.state[0] === this.state[2]) {
        return this.squareStateToResult(this.state[0]);
      }

      if (this.state[0] === this.state[3] && this.state[0] === this.state[6]) {
        return this.squareStateToResult(this.state[0]);
      }

      if (this.state[0] === this.state[4] && this.state[0] === this.state[8]) {
        return this.squareStateToResult(this.state[0]);
      }
    }

    if (this.state[8] !== SquareState.Free) {
      if (this.state[8] === this.state[5] && this.state[8] === this.state[2]) {
        return this.squareStateToResult(this.state[8]);
      }

      if (this.state[8] === this.state[7] && this.state[8] === this.state[6]) {
        return this.squareStateToResult(this.state[8]);
      }
    }

    if (this.getPossibleMoves().length === 0) {
      return Result.Draw;
    }

    return undefined;
  }

  reset() {
    this.state = [
      SquareState.Free, SquareState.Free, SquareState.Free,
      SquareState.Free, SquareState.Free, SquareState.Free,
      SquareState.Free, SquareState.Free, SquareState.Free,
    ];
  }

  getNumberRepresentation(): number {
    return this
      .state
      .map((fieldState: SquareState, index: number) => {
        return [
          SquareState.Free, SquareState.Player, SquareState.Menace
        ].indexOf(fieldState) * Math.pow(3, 8 - index);
      })
      .reduce((previous: number, current: number) => {
        return previous + current;
      });
  }

  recordMove(row: number, col: number): boolean {
    if (this.checkResult()) {
      return false;
    }

    if (row < 0 || row > 2 || col < 0 || col > 2) {
      return false;
    }

    const index = convertFieldCoordinatesToIndex(row, col);

    if (this.state[index] !== SquareState.Free) {
      return false;
    }

    // Prerequisites are met to actually record the move
    this.state[index] = this.whoseTurn;

    if (this.whoseTurn === SquareState.Menace) {
      this.whoseTurn = SquareState.Player;
    } else {
      this.whoseTurn = SquareState.Menace;
    }

    // Check whether the game is decided
    const result = this.checkResult();
    if (result) {
      console.log('Game resulted in:', result);
      this.resultEvents.emit(result);
    }

    return true;
  }

  print() {
    let result = '';

    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        result += ` ${this.state[row * 3 + col]} `;

        if (col < 2) {
          result += '|';
        }
      }

      result += '\n';

      if (row < 2) {
        result += '-'.repeat(11) + '\n';
      }
    }

    console.log(result);
  }

  getPossibleMoves(): number[] {
    return this
      .state
      .map((state: SquareState, index: number): number => {
        if (state === SquareState.Free) {
          return index;
        }

        return -1;
      })
      .filter((index: number) => {
        return index > -1;
      });
  }

  private squareStateToResult(state: SquareState): Result | undefined {
    if (state === SquareState.Menace) {
      return Result.Menace;
    }

    if (state === SquareState.Player) {
      return Result.Player;
    }
  }

}

export class Menace {

  beadMap: Map<number, BeadDescriptor[]> = new Map([]);

  constructor(private board: Board) {}

  takeTurn() {
    console.group('MENACE\'S TURN');
    const boardNumber = this.board.getNumberRepresentation();
    console.log('board number:', boardNumber);
    const permutationInfo = permutationMappings[`${boardNumber}`];
    const referenceBoardNumber = permutationInfo[0];
    console.log('reference board number:', referenceBoardNumber, 'with index mapping:', permutationInfo[1]);
    const beadList = this.getBeadsForBoardNumber(referenceBoardNumber);
    console.log('bead list for reference board:', beadList);

    // Pick bead at random
    const randomMove = beadList[Math.floor(Math.random() * beadList.length)]; // TODO: consider weighted random picking
    console.log('randomMove:', randomMove);
    const fieldCoords = convertIndexToFieldCoordinates(randomMove.field);
    console.log('field coords for random move:', fieldCoords);

    this.board.recordMove(fieldCoords.row, fieldCoords.col);
    console.groupEnd();
  }

  private getBeadsForBoardNumber(referenceNumber: number): BeadDescriptor[] {
    if (!this.beadMap.has(referenceNumber)) {
      const beadDescriptorList: BeadDescriptor[] = this.board.getPossibleMoves().map((freeIndex: number) => {
        return {
          field: freeIndex,
          numberOfBeads: 3,
        };
      });

      this.beadMap.set(referenceNumber, beadDescriptorList);
    }

    return this.beadMap.get(referenceNumber);
  }

}
