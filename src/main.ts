import { createGame, openCell, placeMines, toggleFlag } from "./game";
import type { GameState } from "./types";

let gameState: GameState;
function init(): void {
  let html: string = '';
  gameState = createGame(9, 9, 10);
  const neighborMinesText = '　';
  for (let r = 0; r < gameState.board.length; r++) {
    for (let c = 0; c < gameState.board[0].length; c++) {
      let classString: string = 'cell';
      let dataRow: number = gameState.board[r][c].row;
      let dataCol: number = gameState.board[r][c].col;
      html += `<div class=${classString} data-row=${dataRow} data-col=${dataCol}>${neighborMinesText}</div>`;
    }
  }
  document.getElementById('mine-count').innerHTML = `爆弾の数:${gameState.mineCount.toString()}`;
  document.getElementById('game-status').innerHTML = 'ready';
  document.getElementById('flag-count').innerHTML = `残旗数:${gameState.remainingFlags.toString()}`;
  document.getElementById('board').innerHTML = html;
}

function firstCellClick(event: any): void {
  const target = event;
  if (!target.classList.contains('cell') || !target.classList) {
    return;
  }
  const targetRow: number = Number(target.dataset.row);
  const targetCol: number = Number(target.dataset.col);
  gameState = placeMines(gameState, targetRow, targetCol);
  gameState = openCell(gameState, targetRow, targetCol);
  let html: string = '';
  for (let r = 0; r < gameState.board.length; r++) {
    for (let c = 0; c < gameState.board[0].length; c++) {
      let classString = 'cell';
      let dataMine: boolean = false;
      let dataRow: number = gameState.board[r][c].row;
      let dataCol: number = gameState.board[r][c].col;
      let neighborMinesText: string = '　';
      if (gameState.board[r][c].isMine) {
        dataMine = true;
      }
      if (gameState.board[r][c].status === 'revealed') {
        neighborMinesText = gameState.board[r][c].neighborMines.toString();
      }
      html += `<div class=${classString} data-row=${dataRow} data-col=${dataCol} data-mine=${dataMine}>${neighborMinesText}</div>`;
    }
  }
  document.getElementById('mine-count').innerHTML = `爆弾の数:${gameState.mineCount.toString()}`;
  document.getElementById('game-status').innerHTML = 'playing';
  document.getElementById('flag-count').innerHTML = `残旗数:${gameState.remainingFlags.toString()}`;
  document.getElementById('board').innerHTML = html;
}

function onwardsSecondClick(event: any): void {
  const target = event;
  const targetRow: number = Number(target.dataset.row);
  const targetCol: number = Number(target.dataset.col);
  gameState = openCell(gameState, targetRow, targetCol);
  if (gameState.status === 'won') {
    console.log('クリアしました');
    document.getElementById('game-status').innerHTML = 'clear';
    return;
  }
  if (gameState.status === 'lost') {
    let html: string = '';
    for (let r = 0; r < gameState.board.length; r++) {
      for (let c = 0; c < gameState.board[0].length; c++) {
        let classString = 'cell';
        let dataMine: boolean = false;
        let dataRow: number = gameState.board[r][c].row;
        let dataCol: number = gameState.board[r][c].col;
        let neighborMinesText: string = '　';
        if (gameState.board[r][c].status === 'revealed') {
          neighborMinesText = gameState.board[r][c].neighborMines.toString();
        }
        if (gameState.board[r][c].status === 'flagged') {
          neighborMinesText = '旗';
        }
        if (gameState.board[r][c].isMine) {
          dataMine = true;
          neighborMinesText = '爆弾';
        }
        html += `<div class=${classString} data-row=${dataRow} data-col=${dataCol} data-mine=${dataMine}>${neighborMinesText}</div>`;
      }
    }
    document.getElementById('game-status').innerHTML = 'failed';
    document.getElementById('board').innerHTML = html;
    console.log('ゲーム失敗');
    return;
  }
  let html: string = '';
  for (let r = 0; r < gameState.board.length; r++) {
    for (let c = 0; c < gameState.board[0].length; c++) {
      let classString = 'cell';
      let dataMine: boolean = false;
      let dataRow: number = gameState.board[r][c].row;
      let dataCol: number = gameState.board[r][c].col;
      let neighborMinesText: string = '　';
      if (gameState.board[r][c].isMine) {
        dataMine = true;
      }
      if (gameState.board[r][c].status === 'revealed') {
        neighborMinesText = gameState.board[r][c].neighborMines.toString();
      }
      if (gameState.board[r][c].status === 'flagged') {
        neighborMinesText = '旗';
      }
      html += `<div class=${classString} data-row=${dataRow} data-col=${dataCol} data-mine=${dataMine}>${neighborMinesText}</div>`;
    }
  }
  document.getElementById('mine-count').innerHTML = `爆弾の数:${gameState.mineCount.toString()}`;
  document.getElementById('game-status').innerHTML = 'playing';
  document.getElementById('flag-count').innerHTML = `残旗数:${gameState.remainingFlags.toString()}`;
  document.getElementById('board').innerHTML = html;
}

function toggleFlagEvent(event: any) {
  const target = event;
  const targetRow: number = Number(target.dataset.row);
  const targetCol: number = Number(target.dataset.col);
  gameState = toggleFlag(gameState, targetRow, targetCol);

  let html: string = '';
  for (let r = 0; r < gameState.board.length; r++) {
    for (let c = 0; c < gameState.board[0].length; c++) {
      let classString = 'cell';
      let dataMine: boolean = false;
      let dataRow: number = gameState.board[r][c].row;
      let dataCol: number = gameState.board[r][c].col;
      let neighborMinesText: string = '　';
      if (gameState.board[r][c].isMine) {
        dataMine = true;
      }
      if (gameState.board[r][c].status === 'revealed') {
        neighborMinesText = gameState.board[r][c].neighborMines.toString();
      }
      if (gameState.board[r][c].status === 'flagged') {
        neighborMinesText = '旗';
      }
      html += `<div class=${classString} data-row=${dataRow} data-col=${dataCol} data-mine=${dataMine}>${neighborMinesText}</div>`;
    }
  }
  document.getElementById('mine-count').innerHTML = `爆弾の数:${gameState.mineCount.toString()}`;
  document.getElementById('game-status').innerHTML = 'playing';
  document.getElementById('flag-count').innerHTML = `残旗数:${gameState.remainingFlags.toString()}`;
  document.getElementById('board').innerHTML = html;
}

// セルクリックイベント（左クリック）
document.getElementById('board').addEventListener('click', (event: MouseEvent) => {
  const target = event.target as HTMLElement;
  if (!target.classList.contains('cell') || !target.classList) {
    return;
  }
  if (gameState.status === 'ready') {
    firstCellClick(target);
  }
  if (gameState.status === 'playing') {
    onwardsSecondClick(target);
  }
});

// セルクリックイベント（右クリック）
document.getElementById('board').addEventListener('contextmenu', (event: MouseEvent) => {
  event.preventDefault();
  const target = event.target as HTMLElement;
  if (!target.classList.contains('cell') || !target.classList) {
    return;
  }
  if (gameState.status === 'ready') {
    return;
  }
  if (gameState.status === 'playing') {
    toggleFlagEvent(target);
  }
});

// リセットボタンクリック
document.getElementById('reset-button').addEventListener('click', (event: MouseEvent) => {
  init();
});

init();