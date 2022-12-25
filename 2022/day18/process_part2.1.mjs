import { readFile } from "fs/promises";

const directions = [
	{ x: 1, y: 0, z: 0 },
	{ x: -1, y: 0, z: 0 },
	{ x: 0, y: 1, z: 0 },
	{ x: 0, y: -1, z: 0 },
	{ x: 0, y: 0, z: 1 },
	{ x: 0, y: 0, z: -1 },
];

function bfs(map, boundaries) {
	const [xMax, yMax, zMax] = boundaries;

	let graph = [];
	for (let i = 0; i <= xMax; i++) {
		const row = [];
		for (let j = 0; j <= yMax; j++) {
			const column = [];
			for (let k = 0; k <= zMax; k++) {
				column.push({ x: i, y: j, z: k, explored: false });
			}
			row.push(column);
		}
		graph.push(row);
	}
	graph[0][0][0].explored = true;
	const openSet = [graph[0][0][0]];

	let faces = 0;
	while (openSet.length > 0) {
		const node = openSet.pop();

		// Check each sides of the position to count exterior faces
		if (node.x > 0 && map[node.x - 1][node.y][node.z]) {
			faces += 1;
		}
		if (node.y > 0 && map[node.x][node.y - 1][node.z]) {
			faces += 1;
		}
		if (node.z > 0 && map[node.x][node.y][node.z - 1]) {
			faces += 1;
		}
		if (node.x < xMax && map[node.x + 1][node.y][node.z]) {
			faces += 1;
		}
		if (node.y < yMax && map[node.x][node.y + 1][node.z]) {
			faces += 1;
		}
		if (node.z < zMax && map[node.x][node.y][node.z + 1]) {
			faces += 1;
		}

		const neighbors = directions
			.map((d) => ({ x: node.x + d.x, y: node.y + d.y, z: node.z + d.z }))
			.filter(
				(p) =>
					p.x >= 0 && p.x <= xMax && p.y >= 0 && p.y <= yMax && p.z >= 0 && p.z <= zMax && !map[p.x][p.y][p.z]
			);
		for (const position of neighbors) {
			const neighbor = graph[position.x][position.y][position.z];
			if (neighbor.explored === false) {
				neighbor.explored = true;
				openSet.push(neighbor);
			}
		}
	}

	return [graph, faces];
}

(async () => {
	const file = (await readFile("input")).toString();
	const input = file.split("\n");

	// * Parse
	let [xMin, xMax, yMin, yMax, zMin, zMax] = [9999, -9999, 9999, -9999, 9999, -9999];
	let cubes = input
		.map((line) => line.split(",").map((position) => parseInt(position)))
		.map(([x, y, z]) => ({ x, y, z }));
	for (const cube of cubes) {
		xMin = Math.min(xMin, cube.x);
		xMax = Math.max(xMax, cube.x);
		yMin = Math.min(yMin, cube.y);
		yMax = Math.max(yMax, cube.y);
		zMin = Math.min(zMin, cube.z);
		zMax = Math.max(zMax, cube.z);
	}
	cubes = cubes.map((cube) => ({ x: cube.x - xMin, y: cube.y - yMin, z: cube.z - zMin }));
	xMax -= xMin;
	yMax -= yMin;
	zMax -= zMin;
	const boundaries = [xMax, yMax, zMax];

	// * Pre-process
	let map = [];
	for (let i = 0; i <= xMax; i++) {
		const row = [];
		for (let j = 0; j <= yMax; j++) {
			const column = [];
			for (let k = 0; k <= zMax; k++) {
				column.push(false);
			}
			row.push(column);
		}
		map.push(row);
	}
	for (const cube of cubes) {
		map[cube.x][cube.y][cube.z] = true;
	}

	// * Process
	// Scan the exterior of the lava droplet and count each faces touching outside air
	let [_, faces] = bfs(map, boundaries);
	// Add cube faces that are facing outside of the scan range and can't be found in the bfs scan
	for (let i = 0; i < cubes.length; i++) {
		const cube = cubes[i];
		// Check the adjacent of each positions
		if (cube.x === 0) {
			faces += 1;
		}
		if (cube.y === 0) {
			faces += 1;
		}
		if (cube.z === 0) {
			faces += 1;
		}
		if (cube.x === xMax) {
			faces += 1;
		}
		if (cube.y === yMax) {
			faces += 1;
		}
		if (cube.z === zMax) {
			faces += 1;
		}
	}

	// * Answer
	console.log("Answer:", faces, "expect", 58);
})();
