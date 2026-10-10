import type { GameStatus } from "./types";

interface HeaderProps {
    mineCount: number;
    remainingFlags: number;
    gameStatus: GameStatus;
    onReset: () => void;
}

export function Header(props: HeaderProps) {
    return (
        <header className="header" >
            <span id="mine-count">爆弾の数:{props.mineCount}</span>
            <span id="flag-count">残旗数:{props.remainingFlags}</span>
            <button id="reset-button" onClick={() => { props.onReset() }}>リセット</button>
            <span id="game-status">{props.gameStatus}</span>
        </header>
    )
}