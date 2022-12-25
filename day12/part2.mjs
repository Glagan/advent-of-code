import { readFile } from "fs/promises";

const directions = [
	[0, 1],
	[1, 0],
	[-1, 0],
	[0, -1],
];
const directionsChar = [">", "v", "^", "<"];
const a = "a".charCodeAt(0);
const z = "z".charCodeAt(0);

function printMap(map) {
	for (const line of map) {
		console.log(
			line
				.map((charCode) => {
					if (typeof charCode === "number") {
						if (charCode === z - a + 1) {
							return "E";
						} else if (charCode === -1) {
							return "S";
						} else {
							return String.fromCharCode(a + charCode);
						}
					} else {
						return charCode;
					}
				})
				.join("")
		);
	}
	console.log("---");
}

function key(position) {
	return `${position[0]}_${position[1]}`;
}

function reconstruct(cameFrom, current) {
	let path = [current];
	while (cameFrom[key(current)]) {
		current = [...cameFrom[key(current)]];
		path.push([...current]);
	}
	return path;
}

function aStar(map, start) {
	const boundaries = [map.length, map[0].length];
	const startKey = key(start);
	let openSet = [[...start]];
	let cameFrom = {};
	let gScore = { [startKey]: 0 };
	let fScore = { [startKey]: 1 };

	while (openSet.length > 0) {
		let node = openSet.splice(0, 1)[0];
		const useKey = key(node);
		delete openSet[useKey];
		if (map[node[0]][node[1]] === 0) {
			return reconstruct(cameFrom, node);
		}

		const neighbors = directions
			.map((d) => [node[0] + d[0], node[1] + d[1]])
			.filter(
				(p) =>
					p[0] >= 0 &&
					p[0] < boundaries[0] &&
					p[1] >= 0 &&
					p[1] < boundaries[1] &&
					map[p[0]][p[1]] + 1 >= map[node[0]][node[1]]
			);
		for (const neighbor of neighbors) {
			let neighborKey = key(neighbor);
			let score = gScore[useKey] + 1;
			if (gScore[neighborKey] === undefined || score < gScore[neighborKey]) {
				cameFrom[neighborKey] = [...node];
				gScore[neighborKey] = score;
				fScore[neighborKey] = score + 1;
				if (openSet[neighborKey] === undefined) {
					openSet.push([...neighbor]);
					openSet.sort((a, b) =>
						fScore[a] === undefined ? b : fScore[b] === undefined ? a : fScore[key(a)] - fScore[key(b)]
					);
				}
			}
		}
	}

	return false;
}

(async () => {
	const file = (await readFile("input")).toString();
	const input = file.split("\n");

	// * Parse input
	let map = [];
	let E = [0, 0];
	for (let i = 0; i < input.length; i++) {
		const lineLength = input[i].length;
		let line = [];
		for (let j = 0; j < lineLength; j++) {
			if (input[i][j] === "S") {
				line.push(0);
			} else if (input[i][j] === "E") {
				line.push(z - a);
				E = [i, j];
			} else {
				line.push(input[i].charCodeAt(j) - a);
			}
		}
		map.push(line);
	}
	printMap(map);

	// * Find solution
	const solution = aStar(map, E);
	if (solution !== false) {
		// * Calculate movement map
		const movements = [];
		for (let i = 0; i < map.length; i++) {
			let p = [];
			for (let j = 0; j < map[i].length; j++) {
				p.push(String.fromCharCode(a + map[i][j]));
			}
			movements.push(p);
		}

		let previous = null;
		for (const position of solution) {
			if (previous) {
				for (let d = 0; d < directions.length; d++) {
					const direction = directions[d];
					if (position[0] + direction[0] === previous[0] && position[1] + direction[1] === previous[1]) {
						movements[position[0]][position[1]] = directionsChar[d];
						break;
					}
				}
			} else {
				movements[position[0]][position[1]] = "E";
			}
			previous = [...position];
		}
		printMap(movements);

		// * Show solution length
		console.log("Answer:", solution.length - 1);
	} else {
		console.log("failed to find answer");
	}
})();
