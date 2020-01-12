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

  state: SquareState[] = new Array(9);
  whoseTurn = SquareState.Player;
  resultEvents = new EventEmitter<Result>();

  constructor() {
    this.reset();
  }

  checkResult(): Result | undefined {
    const winningLines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6]
    ];
    let winner: Result;

    winningLines.forEach((line: number[]) => {
      if (winner) {
        // break out of for loop early if we already found a winner
        return;
      }

      const isWinningLine = line
        .map((fieldIndex: number) => {
          return this.state[fieldIndex];
        })
        .every((current: SquareState) => {
          return current !== SquareState.Free &&
            current === this.state[line[0]];
        });

      if (isWinningLine) {
        winner = this.squareStateToResult(this.state[line[0]]);
      }
    });

    if (winner) {
      return winner;
    }

    if (this.getPossibleMoves().length === 0) {
      return Result.Draw;
    }

    return undefined;
  }

  reset() {
    this.state.fill(SquareState.Free);
    this.whoseTurn = SquareState.Player;
  }

  getNumberRepresentation(): number {
    return this
      .state
      .map((fieldState: SquareState, index: number) => {
        return [
          SquareState.Free, SquareState.Player, SquareState.Menace
        ].indexOf(fieldState) * Math.pow(3, index);
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
  currentGameRecord: Map<number, any[]> = new Map([]);

  constructor(private board: Board) {
    this.init();
  }

  private init() {
    this.board.resultEvents.subscribe((result: Result) => {
      const successForMenace = [Result.Menace, Result.Draw].includes(result);

      if (!successForMenace) {
        this.currentGameRecord.forEach((permutationInfo: any[], boardNumber: number) => {

        });
      }
    });
  }

  takeTurn() {
    console.group('MENACE\'S TURN');
    const boardNumber = this.board.getNumberRepresentation();
    console.log('board number:', boardNumber);
    const permutationInfo = permutationMappings[`${boardNumber}`];
    console.log(
      'which is a permutation of reference board number:',
      permutationInfo[0],
      'with index mapping:',
      permutationInfo[1]
    );
    const beadList = this.getBeadsForReferenceBoard(permutationInfo);
    console.log('bead list for reference board:', beadList);

    // Pick move at random
    const randomMove = this.pickRandomMoveFromBeadList(beadList);
    console.log('randomMove:', randomMove);
    const translatedIndex = permutationInfo[1].indexOf(randomMove);
    console.log('translatedIndex:', translatedIndex);
    const fieldCoords = convertIndexToFieldCoordinates(translatedIndex);
    console.log('field coords for random move:', fieldCoords);

    this.board.recordMove(fieldCoords.row, fieldCoords.col);
    this.currentGameRecord.set(randomMove, permutationInfo);
    console.groupEnd();
  }

  private getBeadsForReferenceBoard(permutationInfo: any[]): BeadDescriptor[] {
    if (!this.beadMap.has(permutationInfo[0])) {
      const beadDescriptorList: BeadDescriptor[] = this
        .board
        .getPossibleMoves()
        .map((physicalIndex: number) => {
          return {
            field: permutationInfo[1][physicalIndex],
            numberOfBeads: 3,
          };
        });

      this.beadMap.set(permutationInfo[0], beadDescriptorList);
    }

    return this.beadMap.get(permutationInfo[0]);
  }

  private pickRandomMoveFromBeadList(beadList: BeadDescriptor[]): number {
    const allMoves = [];

    beadList.forEach((descriptor: BeadDescriptor) => {
      for (let i = 0; i < descriptor.numberOfBeads; i++) {
        allMoves.push(descriptor.field);
      }
    });

    if (allMoves.length > 0) {
      return allMoves[Math.floor(Math.random() * beadList.length)];
    }

    return -1;
  }

}
