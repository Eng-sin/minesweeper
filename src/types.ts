export type GameStatus = 'ready' | 'playing' | 'won' | 'lost';
export type CellStatus = 'hidden' | 'flagged' | 'revealed';

export interface GameState {
    status: GameStatus;
    board: Cell[][];
    remainingFlags: number;
    mineCount: number;
}
export interface Cell {
    row: number;
    col: number;
    status: CellStatus;
    isMine: boolean;
    neighborMines: number;
}