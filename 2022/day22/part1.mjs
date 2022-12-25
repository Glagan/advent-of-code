import { readFile } from "fs/promises";

(async () => {
	const file = (await readFile("input")).toString();
	const input = file.split("\n");

	// * Parse
	const xLength = input.slice(0, -2).reduce((acc, line) => (line.length > acc ? line.length : acc), 0);
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
		// map.map((l) => l.join("")).reduce((acc, l) => `${acc}${l}\n`, ""),
		actions,
		position
	);

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
	const move = () => {
		let destination = { x: position.x, y: position.y };
		// Right
		if (direction.value === 0) {
			if (destination.x === xLength - 1 || map[destination.y][destination.x + 1] === " ") {
				destination.x = 0;
				while (map[destination.y][destination.x] === " ") {
					destination.x += 1;
				}
			} else {
				destination.x += 1;
			}
		}
		// Down
		else if (direction.value === 1) {
			if (destination.y === yLength - 1 || map[destination.y + 1][destination.x] === " ") {
				destination.y = 0;
				while (map[destination.y][destination.x] === " ") {
					destination.y += 1;
				}
			} else {
				destination.y += 1;
			}
		}
		// Left
		else if (direction.value === 2) {
			if (destination.x === 0 || map[destination.y][destination.x - 1] === " ") {
				destination.x = xLength - 1;
				while (map[destination.y][destination.x] === " ") {
					destination.x -= 1;
				}
			} else {
				destination.x -= 1;
			}
		}
		// Up
		else {
			if (destination.y === 0 || map[destination.y - 1][destination.x] === " ") {
				destination.y = yLength - 1;
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
	console.log("Answer:", 1000 * row + 4 * column + direction.value, "expect", 6032);
})();
