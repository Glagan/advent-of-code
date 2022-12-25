import { readFile } from "fs/promises";

const directions = [
	{ x: -1, y: 0 },
	{ x: 1, y: 0 },
	{ x: 0, y: -1 },
	{ x: 0, y: 1 },
];

(async () => {
	const file = (await readFile("input")).toString();
	const input = file.split("\n");

	// * Parse
	const position = { x: 1, y: 0 };
	const xLength = input[0].length;
	const yLength = input.length;
	// Calculate blizzards without map
	const blizzards = {
		list: input
			.map((l) => Array.from(l))
			.flatMap((l, y) =>
				l.map((c, x) => (c === ">" || c === "v" || c === "<" || c === "^" ? { d: c, x, y } : null))
			)
			.filter((b) => !!b),
	};
	for (const blizzard of blizzards.list) {
		if (!blizzards[blizzard.y]) {
			blizzards[blizzard.y] = {};
		}
		blizzards[blizzard.y][blizzard.x] = true;
	}
	// Pre-calculate weather
	const nextTick = (blizzards) => {
		const copied = { list: [] };
		for (const old of blizzards.list) {
			const blizzard = { ...old };
			if (blizzard.d === ">") {
				blizzard.x = (blizzard.x + 1) % (xLength - 1);
				if (blizzard.x === 0) {
					blizzard.x = 1;
				}
			} else if (blizzard.d === "v") {
				blizzard.y = (blizzard.y + 1) % (yLength - 1);
				if (blizzard.y === 0) {
					blizzard.y = 1;
				}
			} else if (blizzard.d === "<") {
				if (blizzard.x === 1) {
					blizzard.x = xLength - 2;
				} else {
					blizzard.x -= 1;
				}
			} /* if (blizzard.d === "^") */ else {
				if (blizzard.y === 1) {
					blizzard.y = yLength - 2;
				} else {
					blizzard.y -= 1;
				}
			}
			if (!copied[blizzard.y]) {
				copied[blizzard.y] = {};
			}
			copied[blizzard.y][blizzard.x] = true;
			copied.list.push(blizzard);
		}
		return copied;
	};
	const weather = { [1]: blizzards };
	for (let time = 2; time < 1000; time++) {
		weather[time] = nextTick(weather[time - 1]);
	}
	// console.log(position blizzards);

	// * Process
	function key(node) {
		return `${node.x}_${node.y}_${node.minute}`;
	}

	function reconstruct(cameFrom, current) {
		let path = [current];
		while (cameFrom[key(current)]) {
			current = cameFrom[key(current)];
			path.push(current);
		}
		return path;
	}

	function aStar(goal) {
		const openSet = [{ x: 1, y: 0, minute: 0 }];
		const startKey = key(openSet[0]);
		let cameFrom = {};
		let gScore = { [startKey]: 0 };
		let fScore = { [startKey]: 1 };

		while (openSet.length > 0) {
			let node = openSet.splice(0, 1)[0];
			const useKey = key(node);
			if (node.x === goal.x && node.y === goal.y) {
				return reconstruct(cameFrom, node);
			}

			const neighbors = directions
				.map((d) => ({ x: node.x + d.x, y: node.y + d.y, minute: node.minute + 1 }))
				.filter((p) => {
					return (
						(p.x > 0 &&
							p.x < xLength - 1 &&
							p.y > 0 &&
							p.y < yLength - 1 &&
							!weather[node.minute + 2][p.y]?.[p.x]) ||
						(p.x === goal.x && p.y === goal.y)
					);
				});
			if (!weather[node.minute + 2][node.y]?.[node.x]) {
				neighbors.push({ x: node.x, y: node.y, minute: node.minute + 1 });
			}
			for (const neighbor of neighbors) {
				let neighborKey = key(neighbor);
				let score = gScore[useKey] + 1;
				if (gScore[neighborKey] === undefined || score < gScore[neighborKey]) {
					cameFrom[neighborKey] = node;
					gScore[neighborKey] = score;
					fScore[neighborKey] = score + 1;
					if (openSet[neighborKey] === undefined) {
						openSet.push(neighbor);
						openSet.sort((a, b) =>
							fScore[a] === undefined ? b : fScore[b] === undefined ? a : fScore[key(a)] - fScore[key(b)]
						);
					}
				}
			}
		}

		return false;
	}

	function bfs(goal) {
		const openSet = [{ x: 1, y: 0, minute: 0, blizzards: weather[1] }];
		if (!weather[1][1]?.[1]) {
			openSet.push({ x: 1, y: 1, minute: 1, blizzards: weather[1] });
		}

		let highestMinute = 0;
		while (openSet.length > 0) {
			const node = openSet.splice(0, 1)[0];
			if (node.minute > highestMinute) {
				console.log("now deep", node.minute, openSet.length);
				highestMinute = node.minute;
			}
			if (node.x === goal.x && node.y === goal.y) {
				return node.minute;
			}

			if (!weather[node.minute + 2][node.y]?.[node.x]) {
				openSet.push({ x: node.x, y: node.y, minute: node.minute + 1 });
			}
			const neighbors = directions
				.map((d) => ({ x: node.x + d.x, y: node.y + d.y, minute: node.minute + 1 }))
				.filter((p) => {
					return (
						(p.x > 0 &&
							p.x < xLength - 1 &&
							p.y > 0 &&
							p.y < yLength - 1 &&
							!weather[node.minute + 2][p.y]?.[p.x]) ||
						(p.x === goal.x && p.y === goal.y)
					);
				});
			for (const neighbor of neighbors) {
				openSet.unshift(neighbor);
			}
		}

		return -1;
	}

	// * Answer
	console.log("Answer:", aStar({ x: xLength - 2, y: yLength - 1 })[0].minute);
})();
