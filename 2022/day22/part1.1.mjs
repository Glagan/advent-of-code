import { readFile } from "fs/promises";

(async () => {
	const file = (await readFile("input2")).toString();
	const input = file.split("\n");

	// * Parse
	const xLength = input[0].length;
	const yLength = input.slice(0, -2).length;
	const map = [];
	let position = false;
	for (let y = 0; y < yLength; y++) {
		map.push(new Array(xLength).fill(" "));
	}
	const mapLines = input.slice(0, -2);
	for (let y = 0; y < mapLines.length; y++) {
		const line = Array.from(mapLines[y]);
		for (let x = 0; x < line.length; x++) {
			const tile = line[x];
			if (tile !== " ") {
				map[y][x] = tile;
			}
			if (!position && tile === ".") {
				position = { x, y };
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
		map.map((l) => l.join("")).reduce((acc, l) => `${acc}${l}\n`, ""),
		actions,
		position
	);

	// * Utility
	const directions = [
		{ y: 0, x: 1 }, // right
		{ y: 1, x: 0 }, // down
		{ y: 0, x: -1 }, // left
		{ y: -1, x: 0 }, // up
	];
	const degrees = [0, 1, 2, 3];
	const direction = {
		index: 0,
		rotate(direction) {
			if (direction == "R") {
				this.index = (this.index + 1) % 4;
			} else {
				this.index = this.index === 0 ? 3 : this.index - 1;
			}
		},
	};
	const move = (/* amount */) => {
		// for (let i = 0; i < amount; ) {
		let destination = { x: position.x, y: position.y };
		if (direction.index === 0) {
			destination.x += directions[direction.index].x;
			if (destination.x === xLength || map[destination.x][destination.y] == " ") {
				destination.x = 0;
				while (map[destination.x][destination.y] === " ") {
					destination.x += 1;
				}
			}
		} else if (direction.index === 1) {
			destination.y += directions[direction.index].y;
			if (destination.y === yLength || map[destination.x][destination.y] == " ") {
				destination.y = 0;
				while (map[destination.x][destination.y] === " ") {
					destination.y += 1;
				}
			}
		} else if (direction.index === 2) {
			destination.x += directions[direction.index].x;
			if (destination.x < 0 || map[destination.x][destination.y] == " ") {
				destination.x = xLength - 1;
				while (map[destination.x][destination.y] === " ") {
					destination.x -= 1;
				}
			}
		} else {
			destination.y += directions[direction.index].y;
			if (destination.y < 0 || map[destination.x][destination.y] == " ") {
				destination.y = 0;
				while (map[destination.x][destination.y] === " ") {
					destination.y -= 1;
				}
			}
		}
		// console.log(
		// 	"destination is",
		// 	"x",
		// 	destination.x,
		// 	"y",
		// 	destination.y,
		// 	"tile",
		// 	map[destination.x][destination.y]
		// );
		if (map[destination.x][destination.y] === "#") {
			return 1;
		}
		position.x = destination.x;
		position.y = destination.y;
		// let moved = 0;
		// let tripAmount = amount - i;
		// console.log("tile", `'${map[destination.x][destination.y]}'`);
		// while (moved < tripAmount && map[destination.x][destination.y] === ".") {
		// 	destination.x += directions[direction.index].x;
		// 	destination.y += directions[direction.index].y;
		// 	moved += 1;
		// 	if (destination.x < 0 || destination.x === xLength || destination.y < 0 || destination.y === yLength) {
		// 		break;
		// 	}
		// }
		// console.log(
		// 	"moved",
		// 	moved,
		// 	tripAmount,
		// 	amount,
		// 	"x",
		// 	destination.x,
		// 	"y",
		// 	destination.y,
		// 	"tile",
		// 	map[position.x][position.y],
		// 	"x",
		// 	destination.x,
		// 	"y",
		// 	destination.y
		// );
		// i += moved;
		// }
		return 0;
	};

	// * Process
	for (const action of actions) {
		console.log("action", action, degrees[direction.index]);
		if (typeof action === "number") {
			for (let i = 0; i < action; i++) {
				if (move()) {
					break;
				}
			}
		} else {
			direction.rotate(action);
		}
	}

	for (let y = 0; y < yLength; y++) {
		let result = [];
		for (let x = 0; x < xLength; x++) {
			if (position.x === x && position.y === y) {
				result.push("R");
			} else {
				result.push(map[y][x]);
			}
		}
		console.log(result.join(""));
	}

	// * Answer
	console.log("row", position.y + 1, "column", position.x + 1, "degree", degrees[direction.index]);
	console.log("Answer:", 1000 * (position.y + 1) + 4 * (position.x + 1) + degrees[direction.index], "expect", 6032);
})();
