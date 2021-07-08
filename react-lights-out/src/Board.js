import React, { useState } from "react";
import Cell from "./Cell";
import "./Board.css";

/** Game board of Lights out.
 *
 * Properties:
 *
 * - nrows: number of rows of board
 * - ncols: number of cols of board
 * - chanceLightStartsOn: float, chance any cell is lit at start of game
 *
 * State:
 *
 * - board: array-of-arrays of true/false
 *
 *    For this board:
 *       .  .  .
 *       O  O  .     (where . is off, and O is on)
 *       .  .  .
 *
 *    This would be: [[f, f, f], [t, t, f], [f, f, f]]
 *
 *  This should render an HTML table of individual <Cell /> components.
 *
 *  This doesn't handle any clicks --- clicks are on individual cells
 *
 **/

function Board({ nrows = 8, ncols = 8, chanceLightStartsOn = 0.5 }) {
	const [board, setBoard] = useState(createBoard());

	/** create a board nrows high/ncols wide, each cell randomly lit or unlit */
	function createBoard() {
		const initialBoard = [];
		const _randomIsOnOrOff = () => {
			return Math.random() <= chanceLightStartsOn;
		};
		for (let rows = 0; rows < nrows; rows++) {
			const row = [];
			for (let cols = 0; cols < ncols; cols++) {
				row.push(_randomIsOnOrOff());
			}
			initialBoard.push(row);
		}
		return initialBoard;
	}

	function hasWon() {
		for (let row = 0; row < nrows; row++) {
			for (let col = 0; col < ncols; col++) {
				if (board[row][col]) return false;
			}
		}
		return true;
	}

	function flipCellsAround(coord) {
		setBoard((oldBoard) => {
			const [y, x] = coord.split("-").map(Number);

			const flipCell = (y, x, boardCopy) => {
				// if this coord is actually on board, flip it

				if (x >= 0 && x < ncols && y >= 0 && y < nrows) {
					boardCopy[y][x] = !boardCopy[y][x];
				}
			};

			const boardCopy = oldBoard.map((row) => row.map((col) => col));

			const cascade = (y, x, boardCopy) => {
				flipCell(y, x, boardCopy);
				flipCell(y - 1, x, boardCopy);
				flipCell(y, x + 1, boardCopy);
				flipCell(y, x - 1, boardCopy);
			};

			cascade(y, x, boardCopy);

			return boardCopy;
		});
	}

	// if the game is won, just show a winning msg & render nothing else
	if (hasWon()) return alert("you've won!");

	return (
		<div className="board">
			{board.map((row, y) => (
				<tr>
					{row.map((col, x) => (
						<Cell flipCellsAroundMe={(evt) => flipCellsAround(`${y}-${x}`)} isLit={col} />
					))}
				</tr>
			))}
		</div>
	);
}

export default Board;
