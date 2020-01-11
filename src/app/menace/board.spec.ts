import { Board, SquareState, Result } from './menace';

describe('Board class', () => {
  describe('Win detection', () => {
    it('should detect forward diagonals', () => {
      const board =  new Board();
      board.state = [
        SquareState.Menace, SquareState.Free, SquareState.Free,
        SquareState.Free, SquareState.Menace, SquareState.Free,
        SquareState.Free, SquareState.Free, SquareState.Menace,
      ];

      const result = board.checkResult();

      expect(result).toBe(Result.Menace);
    });

    it('should detect backward diagonals', () => {
      const board = new Board();
      board.state = [
        SquareState.Free, SquareState.Free, SquareState.Player,
        SquareState.Free, SquareState.Player, SquareState.Free,
        SquareState.Player, SquareState.Free, SquareState.Free,
      ];

      const result = board.checkResult();

      expect(result).toBe(Result.Player);
    });

    it('should detect horizontal line 1', () => {
      const board = new Board();
      board.state = [
        SquareState.Menace, SquareState.Menace, SquareState.Menace,
        SquareState.Free, SquareState.Free, SquareState.Free,
        SquareState.Free, SquareState.Free, SquareState.Free,
      ];

      const result = board.checkResult();

      expect(result).toBe(Result.Menace);
    });

    it('should detect horizontal line 2', () => {
      const board = new Board();
      board.state = [
        SquareState.Free, SquareState.Free, SquareState.Free,
        SquareState.Menace, SquareState.Menace, SquareState.Menace,
        SquareState.Free, SquareState.Free, SquareState.Free,
      ];

      const result = board.checkResult();

      expect(result).toBe(Result.Menace);
    });

    it('should detect horizontal line 3', () => {
      const board = new Board();
      board.state = [
        SquareState.Free, SquareState.Free, SquareState.Free,
        SquareState.Free, SquareState.Free, SquareState.Free,
        SquareState.Menace, SquareState.Menace, SquareState.Menace,
      ];

      const result = board.checkResult();

      expect(result).toBe(Result.Menace);
    });

    it('should detect vertical line 1', () => {
      const board = new Board();
      board.state = [
        SquareState.Player, SquareState.Free, SquareState.Free,
        SquareState.Player, SquareState.Free, SquareState.Free,
        SquareState.Player, SquareState.Free, SquareState.Free,
      ];

      const result = board.checkResult();

      expect(result).toBe(Result.Player);
    });

    it('should detect vertical line 2', () => {
      const board = new Board();
      board.state = [
        SquareState.Free, SquareState.Player, SquareState.Free,
        SquareState.Free, SquareState.Player, SquareState.Free,
        SquareState.Free, SquareState.Player, SquareState.Free,
      ];

      const result = board.checkResult();

      expect(result).toBe(Result.Player);
    });

    it('should detect vertical line 3', () => {
      const board = new Board();
      board.state = [
        SquareState.Free, SquareState.Free, SquareState.Player,
        SquareState.Free, SquareState.Free, SquareState.Player,
        SquareState.Free, SquareState.Free, SquareState.Player,
      ];

      const result = board.checkResult();

      expect(result).toBe(Result.Player);
    });

    it('should not detect a win on nonsense board', () => {
      const board = new Board();
      board.state = [
        SquareState.Free, SquareState.Menace, SquareState.Player,
        SquareState.Free, SquareState.Menace, SquareState.Free,
        SquareState.Menace, SquareState.Player, SquareState.Player,
      ];

      const result = board.checkResult();

      expect(result).toBeUndefined();
    });

    it('should detect a draw', () => {
      const board = new Board();
      board.state = [
        SquareState.Player, SquareState.Menace, SquareState.Player,
        SquareState.Player, SquareState.Menace, SquareState.Menace,
        SquareState.Menace, SquareState.Player, SquareState.Player,
      ];

      const result = board.checkResult();

      expect(result).toBe(Result.Draw);
    });
  });
});
