import { useState } from "react";
import { createGame, openCell, placeMines, toggleFlag } from "./game";
import type { Cell, GameState } from "./types";
import { Header } from "./Header";


export const App = () => {
    const [gameState, setGameState] = useState<GameState>(createGame(9, 9, 10));
    const handleClick = (cell: Cell) => {
        if (gameState.status === 'ready') {
            setGameState(openCell(placeMines(gameState, cell.row, cell.col), cell.row, cell.col));

        } else if (gameState.status === 'playing') {
            setGameState(openCell(gameState, cell.row, cell.col));
        }
    }
    const handleContextMenu = (e: React.MouseEvent, cell: Cell) => {
        e.preventDefault();
        if (gameState.status === 'ready') {
            return;
        } else if (gameState.status === 'playing') {
            setGameState(toggleFlag(gameState, cell.row, cell.col));
        }
    }
    const displayCellInner = (cell: Cell) => {
        switch (cell.status) {
            case 'revealed':
                return cell.isMine ? '💣' : cell.neighborMines != 0 ? cell.neighborMines : '';
            case 'flagged':
                return '🚩';
        }
    }
    return (
        <div>
            <Header mineCount={gameState.mineCount} remainingFlags={gameState.remainingFlags} gameStatus={gameState.status} onReset={() => { setGameState(createGame(9, 9, 10)) }} />
            <div id="board">
                {
                    gameState.board.map((row) => row.map((cell) =>
                        <div className={`cell ${cell.status !== 'revealed' ? '' : cell.isMine ? 'mine' : 'revealed'} `} key={`${cell.row}- ${cell.col}`} onClick={() => handleClick(cell)} onContextMenu={(e) => handleContextMenu(e, cell)}>
                            {
                                displayCellInner(cell)
                            }
                        </div>))
                }
            </div>
        </div >
    );
};