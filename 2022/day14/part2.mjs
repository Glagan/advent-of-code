import { readFile } from "fs/promises";

(async () => {
	const file = (await readFile("input")).toString();
	const input = file.split("\n");

	// * Parse

	let xMax = 0;
	let [yMin, yMax] = [999, 0];
	const rocks = [];
	for (const line of input) {
		const rock = [];
		const parts = line.split(" -> ");
		for (const part of parts) {
			const [y, x] = part.split(",").map((p) => parseInt(p));
			if (y < yMin) {
				yMin = y;
			}
			if (x > xMax) {
				xMax = x;
			}
			if (y > yMax) {
				yMax = y;
			}
			rock.push({ x, y });
		}
		rocks.push(rock);
	}
	yMin -= 50;
	yMax += 175;

	const map = [];
	for (let i = 0; i < xMax + 3; i++) {
		let row = [];
		for (let j = yMin; j < yMax; j++) {
			if (i === xMax + 2) {
				row.push("#");
			} else if (i === 0 && j === 500) {
				row.push("+");
			} else {
				row.push(".");
			}
		}
		map.push(row);
	}
	for (const rockPoint of rocks) {
		for (let index = 1; index < rockPoint.length; index++) {
			const previous = { ...rockPoint[index - 1] };
			const current = rockPoint[index];
			const direction = [
				previous.x === current.x ? 0 : current.x > previous.x ? 1 : -1,
				previous.y === current.y ? 0 : current.y > previous.y ? 1 : -1,
			];
			while (previous.x != current.x || previous.y != current.y) {
				map[previous.x][previous.y - yMin] = "#";
				previous.x += direction[0];
				previous.y += direction[1];
			}
			map[previous.x][previous.y - yMin] = "#";
		}
	}

	// * Visualization

	console.log("yMin", yMin, "yMax", yMax, "xMax", xMax);
	console.log(`map size ${map.length}x${map[0].length}`);
	for (const row of map) {
		console.log(row.join(""));
	}

	// * Simulation

	let time = 0;
	while (true) {
		let position = [0, 500 - yMin];
		let voided = false;
		while (true) {
			if (map[position[0] + 1][position[1]] === ".") {
				position[0] += 1;
			} else if (map[position[0] + 1][position[1] - 1] === ".") {
				position[0] += 1;
				position[1] -= 1;
			} else if (map[position[0] + 1][position[1] + 1] === ".") {
				position[0] += 1;
				position[1] += 1;
			} else {
				break;
			}
		}
		map[position[0]][position[1]] = "o";
		time += 1;
		if (position[0] === 0 && position[1] === 500 - yMin) {
			map[position[0]][position[1]] = "~";
			break;
		}
	}

	// * Show answer

	console.log("---");
	for (const row of map) {
		console.log(row.join(""));
	}
	console.log("Answer:", time);
})();
