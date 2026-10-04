import type { GameState, Cell, CellStatus } from './types';

export function createGame(cellRowNumber: number, cellColNumber: number, mineCount: number): GameState {
    const cells = (): Cell[][] => {
        const cellArray: Cell[][] = Array.from({ length: cellRowNumber }, () => Array(cellColNumber));
        for (let r = 0; r < cellRowNumber; r++) {
            for (let c = 0; c < cellColNumber; c++) {
                const cell: Cell =
                {
                    row: r,
                    col: c,
                    status: 'hidden',
                    isMine: false,
                    neighborMines: 0
                };
                cellArray[r][c] = cell;
            }
        }
        return cellArray;
    }
    const gameState: GameState = {
        status: 'ready',
        board: cells(),
        remainingFlags: mineCount,
        mineCount: mineCount
    }
    return gameState;
}

export function toggleFlag(gameState: GameState, targetRow: number, targetCol: number): GameState {
    const targetCell: Cell = gameState.board[targetRow][targetCol];
    let newStatus: CellStatus;
    let flagDiff: number;
    switch (targetCell.status) {
        case 'hidden':
            newStatus = 'flagged';
            flagDiff = -1;
            break;
        case 'flagged':
            newStatus = 'hidden';
            flagDiff = +1;
            break;
        case 'revealed':
            return gameState;
    }
    const newBoard: Cell[][] = gameState.board.map((rowCells, r) => r !== targetRow ? rowCells : rowCells.map((cell, c) => c !== targetCol ? cell : { ...cell, status: newStatus }));
    return {
        ...gameState,
        board: newBoard,
        remainingFlags: gameState.remainingFlags + flagDiff
    }
}

export function placeMines(gameState: GameState, targetRow: number, targetCol: number): GameState {
    const rowSize: number = gameState.board.length;
    const colSize: number = gameState.board[0].length;
    let mineSetTargetCol: number;
    let mineSetTargetRow: number;
    const minePositionArray: number[][] = [];
    for (let m = 0; m < gameState.mineCount; m++) {
        mineSetTargetRow = Math.floor(Math.random() * (rowSize));
        mineSetTargetCol = Math.floor(Math.random() * (colSize));
        let isNearFirstClick: boolean = Math.abs(mineSetTargetRow - targetRow) <= 1 && Math.abs(mineSetTargetCol - targetCol) <= 1;
        let isAlreadyChosen: boolean = minePositionArray.some((innerArray) => innerArray[0] === mineSetTargetRow && innerArray[1] === mineSetTargetCol);
        while (isNearFirstClick || isAlreadyChosen) {
            mineSetTargetRow = Math.floor(Math.random() * (rowSize));
            mineSetTargetCol = Math.floor(Math.random() * (colSize));
            isNearFirstClick = Math.abs(mineSetTargetRow - targetRow) <= 1 && Math.abs(mineSetTargetCol - targetCol) <= 1;
            isAlreadyChosen = minePositionArray.some((innerArray) => innerArray[0] === mineSetTargetRow && innerArray[1] === mineSetTargetCol);
        }
        minePositionArray.push([mineSetTargetRow, mineSetTargetCol]);
    }
    // 爆弾設置後
    const newBoard: Cell[][] = gameState.board.map((rowCells) => rowCells.map((cell) => minePositionArray.some((innerArray) => cell.row === innerArray[0] && cell.col === innerArray[1]) ? { ...cell, isMine: true } : cell));

    // セルを全て検索し、爆弾が設置されていなかったら周辺のマスを検索し爆弾の数を各セルのneighborMinesにセットする。
    const boardWithMine: Cell[][] = newBoard.map((rowCells, r) => rowCells.map((cell, c) => cell.isMine ? cell : { ...cell, neighborMines: calcNeighborMines(newBoard, r, c) }));

    return {
        ...gameState,
        board: boardWithMine
    };
}

// 対象セルの周辺の爆弾の数を計算する。
function calcNeighborMines(board: Cell[][], targetRow: number, targetCol: number): number {
    let calcNeighborMinesCount: number = 0;
    if (!board[targetRow][targetCol].isMine) {
        for (let r = 0; r < board.length; r++) {
            for (let c = 0; c < board[0].length; c++) {
                if (Math.abs(r - targetRow) <= 1 && Math.abs(c - targetCol) <= 1 && board[r][c].isMine) {
                    calcNeighborMinesCount++;
                }
            }
        }
    }
    return calcNeighborMinesCount;
}

export function openCell(gameState: GameState, targetRow: number, targetCol: number): GameState {
    const targetCell: Cell = gameState.board[targetRow][targetCol];
    // 既に開かれている、もしくはフラグが立っている場合はそのまま返す
    if (targetCell.status === 'revealed' || targetCell.status === 'flagged') {
        return {
            ...gameState
        };
    }
    // 爆弾だったらlostを設定して返す
    if (targetCell.isMine) {
        return {
            ...gameState,
            status: 'lost'
        };

        // 爆弾でなかった場合
    } else {
        let newBoard: Cell[][] = gameState.board.map((rowCells) => rowCells.map((cell) => cell.row === targetRow && cell.col === targetCol ? { ...cell, status: 'revealed' } : cell));
        let newGameState: GameState = { ...gameState, board: newBoard };
        if (targetCell.neighborMines === 0) {
            for (let r = 0; r < gameState.board.length; r++) {
                for (let c = 0; c < gameState.board[0].length; c++) {
                    if ((Math.abs(r - targetRow) <= 1 && Math.abs(c - targetCol) <= 1) && !(r === targetRow && c === targetCol)) {
                        newGameState = openCell(newGameState, r, c);
                    }
                }
            }
        }
        if (newGameState.board.flat().filter((cell) => !cell.isMine).every(cell => cell.status === 'revealed')) {
            return {
                ...newGameState,
                status: 'won'
            }
        }
        return {
            ...newGameState
        };
    }

}