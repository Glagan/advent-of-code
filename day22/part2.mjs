import { readFile } from "fs/promises";

const RIGHT = 0;
const DOWN = 1;
const LEFT = 2;
const TOP = 3;

(async () => {
	const file = (await readFile("input2")).toString();
	const input = file.split("\n");

	// * Parse
	const xLength = input.slice(0, -2).reduce((acc, line) => (line.length > acc ? line.length : acc), 0);
	const yLength = input.slice(0, -2).length;
	const squareLength = 4;
	const map = [];
	const square = [];
	const squareStart = {
		0: { x: 0, y: 0 },
		1: { x: 0, y: 0 },
		2: { x: 0, y: 0 },
		3: { x: 0, y: 0 },
		4: { x: 0, y: 0 },
		5: { x: 0, y: 0 },
	};
	const squareMapping = {
		0: {
			[RIGHT]: { square: 5, direction: LEFT },
			[DOWN]: { square: 3, direction: DOWN },
			[LEFT]: { square: 2, direction: DOWN },
			[TOP]: { square: 1, direction: DOWN },
		},
		1: {
			[RIGHT]: { square: 2, direction: RIGHT },
			[DOWN]: { square: 4, direction: TOP },
			[LEFT]: { square: 5, direction: TOP },
			[TOP]: { square: 0, direction: DOWN },
		},
		2: {
			[RIGHT]: { square: 3, direction: RIGHT },
			[DOWN]: { square: 4, direction: RIGHT },
			[LEFT]: { square: 1, direction: LEFT },
			[TOP]: { square: 0, direction: RIGHT },
		},
		3: {
			[RIGHT]: { square: 5, direction: DOWN },
			[DOWN]: { square: 4, direction: DOWN },
			[LEFT]: { square: 2, direction: LEFT },
			[TOP]: { square: 0, direction: TOP },
		},
		4: {
			[RIGHT]: { square: 5, direction: RIGHT },
			[DOWN]: { square: 1, direction: TOP },
			[LEFT]: { square: 2, direction: TOP },
			[TOP]: { square: 3, direction: TOP },
		},
		5: {
			[RIGHT]: { square: 0, direction: RIGHT },
			[DOWN]: { square: 1, direction: RIGHT },
			[LEFT]: { square: 4, direction: LEFT },
			[TOP]: { square: 3, direction: LEFT },
		},
	};
	let position = false;
	for (let y = 0; y < yLength; y++) {
		map.push(new Array(xLength).fill(" "));
		square.push(new Array(xLength).fill(" "));
	}
	const completedSquares = [0, 0, 0, 0, 0, 0];
	const mapLines = input.slice(0, -2);
	for (let y = 0; y < mapLines.length; y++) {
		let currentSquare = completedSquares.findIndex((v) => v < squareLength ** 2);
		const line = Array.from(mapLines[y]);
		const lineCompletedSquares = [0, 0, 0, 0, 0, 0];
		for (let x = 0; x < line.length; x++) {
			const tile = line[x];
			if (tile !== " ") {
				map[y][x] = tile;
				square[y][x] = currentSquare;
				if (completedSquares[currentSquare] === 0) {
					squareStart[currentSquare] = { x, y };
				}
				completedSquares[currentSquare] += 1;
				lineCompletedSquares[currentSquare] += 1;
				if (lineCompletedSquares[currentSquare] === squareLength) {
					currentSquare += 1;
				}
			}
			if (!position && tile === ".") {
				position = { x, y, square: 0 };
			}
		}
	}
	const actions = [];
	const rawActions = Array.from(input[input.length - 1]);
	let buffer = "";
	for (const rawAction of rawActions) {
		if (rawAction === "R" || rawAction == "L") {
			actions.push(Number(buffer));
			buffer = "";
			actions.push(rawAction);
		} else {
			buffer += rawAction;
		}
	}
	if (buffer.length > 0) {
		actions.push(Number(buffer));
	}
	console.log(
		// map.map((l) => l.join("")).reduce((acc, l) => `${acc}${l}\n`, ""),
		// square,
		actions.join(", "),
		position,
		squareStart
	);
	console.log(square.map((l) => l.join("")).reduce((acc, l) => `${acc}${l}\n`, ""));

	// * Utility
	let explored = JSON.parse(JSON.stringify(map));
	const directions = [">", "v", "<", "^"];
	const direction = {
		value: 0,
		rotate(direction) {
			if (direction == "R") {
				this.value = (this.value + 1) % 4;
			} else {
				this.value = this.value === 0 ? 3 : this.value - 1;
			}
		},
	};
	// Rotate x and y and set it to the correct position on the new square from the previous connection
	const positionOnNewSquare = (squareStart, fromDirection, toDirection, x, y) => {
		if (fromDirection === TOP) {
			if (toDirection === TOP) {
				return { x: squareStart.x + x, y: squareStart.y + (squareLength - 1) };
			} else if (toDirection === RIGHT) {
				return { x: squareStart.x, y: squareStart.y + x };
			} else if (toDirection === LEFT) {
				return { x: squareStart.x + (squareLength - 1), y: squareStart.y + (squareLength - 1 - x) };
			} else if (toDirection === DOWN) {
				return { x: squareStart.x + (squareLength - 1 - x), y: squareStart.y };
			}
		} else if (fromDirection === RIGHT) {
			if (toDirection === TOP) {
				return { x: 0, y: 0 };
			} else if (toDirection === RIGHT) {
				return { x: squareStart.x, y: squareStart.y + y };
			} else if (toDirection === LEFT) {
				return { x: squareStart.x + (squareLength - 1), y: squareStart.y + y };
			} else if (toDirection === DOWN) {
				return { x: squareStart.x + (squareLength - 1 - y), y: squareStart.y };
			}
		} else if (fromDirection === LEFT) {
			if (toDirection === TOP) {
				return { x: squareStart.x + (squareLength - 1 - y), y: squareStart.y + squareLength - 1 };
			} else if (toDirection === RIGHT) {
				return { x: 0, y: 0 };
			} else if (toDirection === LEFT) {
				return { x: squareStart.x + (squareLength - 1), y: squareStart.y + y };
			} else if (toDirection === DOWN) {
				return { x: squareStart.x + y, y: squareStart.y };
			}
		} else if (fromDirection === DOWN) {
			if (toDirection === TOP) {
				return { x: squareStart.x + (squareLength - 1 - x), y: squareStart.y + squareLength - 1 };
			} else if (toDirection === RIGHT) {
				return { x: squareStart.x, y: squareStart.y + (squareLength - 1 - x) };
			} else if (toDirection === LEFT) {
				return { x: 0, y: 0 };
			} else if (toDirection === DOWN) {
				return { x: squareStart.x + x, y: squareStart.y };
			}
		}
	};
	const move = () => {
		let destination = { x: position.x, y: position.y, square: position.square };
		let newDirection = direction.value;
		const currentSquareStart = squareStart[position.square];
		if (direction.value === RIGHT) {
			if (
				destination.x === xLength - 1 ||
				map[destination.y][destination.x + 1] === " " ||
				position.x - squareStart[position.square].x === squareLength - 1
			) {
				destination.square = squareMapping[position.square][RIGHT].square;
				newDirection = squareMapping[position.square][RIGHT].direction;
				console.log(
					"from square",
					position.square,
					destination.square,
					"from direction",
					direction.value,
					newDirection,
					"checking",
					position.x,
					position.y,
					position.x - currentSquareStart.x,
					position.y - currentSquareStart.y
				);
				const newPosition = positionOnNewSquare(
					squareStart[destination.square],
					direction.value,
					newDirection,
					position.x - currentSquareStart.x,
					position.y - currentSquareStart.y
				);
				console.log("from", position.x, position.y, "newPosition", newPosition.x, newPosition.y);
				destination.x = newPosition.x;
				destination.y = newPosition.y;
				while (map[destination.y][destination.x] === " ") {
					destination.x += 1;
				}
			} else {
				destination.x += 1;
			}
		} else if (direction.value === DOWN) {
			if (
				destination.y === yLength - 1 ||
				map[destination.y + 1][destination.x] === " " ||
				position.y - currentSquareStart.y === squareLength - 1
			) {
				destination.square = squareMapping[position.square][DOWN].square;
				newDirection = squareMapping[position.square][DOWN].direction;
				console.log(
					"from square",
					position.square,
					destination.square,
					"from direction",
					direction.value,
					newDirection
				);
				const newPosition = positionOnNewSquare(
					squareStart[destination.square],
					direction.value,
					newDirection,
					position.x - currentSquareStart.x,
					position.y - currentSquareStart.y
				);
				destination.x = newPosition.x;
				destination.y = newPosition.y;
				while (map[destination.y][destination.x] === " ") {
					destination.y += 1;
				}
			} else {
				destination.y += 1;
			}
		} else if (direction.value === LEFT) {
			if (
				destination.x === 0 ||
				map[destination.y][destination.x - 1] === " " ||
				position.x - currentSquareStart.x === 0
			) {
				destination.square = squareMapping[position.square][LEFT].square;
				newDirection = squareMapping[position.square][LEFT].direction;
				console.log(
					"from square",
					position.square,
					destination.square,
					"from direction",
					direction.value,
					newDirection
				);
				const newPosition = positionOnNewSquare(
					squareStart[destination.square],
					direction.value,
					newDirection,
					position.x - currentSquareStart.x,
					position.y - currentSquareStart.y
				);
				console.log("from", position.x, position.y, "newPosition", newPosition.x, newPosition.y);
				destination.x = newPosition.x;
				destination.y = newPosition.y;
				while (map[destination.y][destination.x] === " ") {
					destination.x -= 1;
				}
			} else {
				destination.x -= 1;
			}
		} else if (direction.value === TOP) {
			if (
				destination.y === 0 ||
				map[destination.y - 1][destination.x] === " " ||
				position.y - currentSquareStart.y === 0
			) {
				destination.square = squareMapping[position.square][TOP].square;
				newDirection = squareMapping[position.square][TOP].direction;
				console.log(
					"from square",
					position.square,
					destination.square,
					"from direction",
					direction.value,
					newDirection
				);
				const newPosition = positionOnNewSquare(
					squareStart[destination.square],
					direction.value,
					newDirection,
					position.x - currentSquareStart.x,
					position.y - currentSquareStart.y
				);
				destination.x = newPosition.x;
				destination.y = newPosition.y;
				while (map[destination.y][destination.x] === " ") {
					destination.y -= 1;
				}
			} else {
				destination.y -= 1;
			}
		}
		explored[position.y][position.x] = directions[direction.value];
		if (map[destination.y][destination.x] === "#") {
			return 1;
		}
		position = destination;
		direction.value = newDirection;
		return 0;
	};

	// * Process
	for (const action of actions) {
		if (typeof action === "number") {
			for (let i = 0; i < action; i++) {
				if (move()) {
					break;
				}
			}
			// console.log("action", action, directions[direction.value], position);
		} else {
			direction.rotate(action);
			// console.log("action", action, directions[direction.value]);
		}
	}
	console.log(explored.map((l) => l.join("")).reduce((acc, l) => `${acc}${l}\n`, ""));

	// * Answer
	const row = position.y + 1;
	const column = position.x + 1;
	console.log("row", row, "column", column, "degree", direction.value);
	console.log("Answer:", 1000 * row + 4 * column + direction.value, "expect", 5031);
})();
