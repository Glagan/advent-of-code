import { readFile } from "fs/promises";

(async () => {
	const file = (await readFile("input")).toString();
	const input = file.split("\n");

	// * Parse
	// N up S down W left E right
	const map = input.map((l) => Array.from(l));
	const byIndex = {};
	const elves = map.flatMap((l, y) => {
		let elves = [];
		let x = -1;
		while ((x = l.indexOf("#", x + 1)) >= 0) {
			const elf = { y, x };
			if (!byIndex[y]) {
				byIndex[y] = {};
			}
			byIndex[y][x] = elf;
			elves.push(elf);
		}
		return elves;
	});
	// console.log(map.map((l) => l.join("")).join("\n"));
	console.log(elves);

	// * Process
	let directionIndex = 0;
	const isAlone = (elf) => {
		const { y, x } = elf;
		return (
			!byIndex[y - 1]?.[x - 1] &&
			!byIndex[y - 1]?.[x] &&
			!byIndex[y - 1]?.[x + 1] &&
			!byIndex[y]?.[x - 1] &&
			!byIndex[y]?.[x + 1] &&
			!byIndex[y + 1]?.[x - 1] &&
			!byIndex[y + 1]?.[x] &&
			!byIndex[y + 1]?.[x + 1]
		);
	};
	const directions = [
		({ y, x }) => {
			if (!byIndex[y - 1]?.[x - 1] && !byIndex[y - 1]?.[x] && !byIndex[y - 1]?.[x + 1]) {
				return { x, y: y - 1 };
			}
			return null;
		},
		({ y, x }) => {
			if (!byIndex[y + 1]?.[x - 1] && !byIndex[y + 1]?.[x] && !byIndex[y + 1]?.[x + 1]) {
				return { x, y: y + 1 };
			}
			return null;
		},
		({ y, x }) => {
			if (!byIndex[y - 1]?.[x - 1] && !byIndex[y]?.[x - 1] && !byIndex[y + 1]?.[x - 1]) {
				return { x: x - 1, y };
			}
			return null;
		},
		({ y, x }) => {
			if (!byIndex[y - 1]?.[x + 1] && !byIndex[y]?.[x + 1] && !byIndex[y + 1]?.[x + 1]) {
				return { x: x + 1, y };
			}
			return null;
		},
	];
	const proposeMove = (elf) => {
		let elfDirection = directionIndex;
		for (let d = 0; d < 4; d++) {
			const move = directions[elfDirection](elf);
			if (move) {
				return move;
			}
			elfDirection = (elfDirection + 1) % 4;
		}
		return null;
	};
	const live = () => {
		// Generate first half round
		const moves = [];
		for (const elf of elves) {
			if (isAlone(elf)) {
				moves.push(null);
			} else {
				moves.push(proposeMove(elf));
			}
		}
		// Remove moves to the same position
		for (let i = 0; i < moves.length; i++) {
			const move = moves[i];
			if (move) {
				let duplicate = false;
				for (let j = i + 1; j < moves.length; j++) {
					const otherMove = moves[j];
					if (otherMove && move.x === otherMove.x && move.y === otherMove.y) {
						moves[j] = null;
						duplicate = true;
					}
				}
				if (duplicate) {
					moves[i] = null;
				}
			}
		}
		// Move
		for (let i = 0; i < moves.length; i++) {
			const move = moves[i];
			if (move) {
				if (!byIndex[move.y]) {
					byIndex[move.y] = {};
				}
				byIndex[elves[i].y][elves[i].x] = false;
				byIndex[move.y][move.x] = elves[i];
				elves[i].y = move.y;
				elves[i].x = move.x;
			}
		}
		directionIndex = (directionIndex + 1) % 4;
		// no moves ?
		if (moves.every((m) => m === null)) {
			return true;
		}
		return false;
	};
	let round = 1;
	for (; round < Infinity; round++) {
		if (live()) {
			break;
		}
	}

	// * Answer
	console.log("Answer:", round, "expect", 20);
})();
