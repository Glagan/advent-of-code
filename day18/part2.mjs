import { readFile } from "fs/promises";

const directions = [
	{ x: 1, y: 0, z: 0 },
	{ x: -1, y: 0, z: 0 },
	{ x: 0, y: 1, z: 0 },
	{ x: 0, y: -1, z: 0 },
	{ x: 0, y: 0, z: 1 },
	{ x: 0, y: 0, z: -1 },
];

function bfs(map, boundaries, start) {
	const [xMin, xMax, yMin, yMax, zMin, zMax] = boundaries;

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
	graph[start.x][start.y][start.z].explored = true;
	const openSet = [graph[start.x][start.y][start.z]];

	while (openSet.length > 0) {
		const v = openSet.splice(0, 1)[0];
		if (v.x === 0 || v.y === 0 || v.z === 0 || v.x === xMax || v.y === yMax || v.z === zMax) {
			return true;
		}

		const neighbors = directions
			.map((d) => ({ x: v.x + d.x, y: v.y + d.y, z: v.z + d.z }))
			.filter(
				(p) =>
					p.x >= 0 && p.x <= xMax && p.y >= 0 && p.y < yMax && p.z >= 0 && p.z < zMax && !map[p.x][p.y][p.z]
			)
			.map((n) => graph[n.x][n.y][n.z]);
		for (const neighbor of neighbors) {
			if (neighbor.explored === false) {
				neighbor.explored = true;
				openSet.push(neighbor);
			}
		}
	}

	return false;
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
	const boundaries = [xMin, xMax, yMin, yMax, zMin, zMax];

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
	// Try to reach outside of the map from each faces of each cubes,
	// If they succeed they are part of the outside area of the droplet
	let faces = 0;
	for (let i = 0; i < cubes.length; i++) {
		const cube = cubes[i];
		// Check the adjacent of each positions
		if (
			cube.x === 0 ||
			(!map[cube.x - 1][cube.y][cube.z] && bfs(map, boundaries, { x: cube.x - 1, y: cube.y, z: cube.z }))
		) {
			faces += 1;
		}
		if (
			cube.y === 0 ||
			(!map[cube.x][cube.y - 1][cube.z] && bfs(map, boundaries, { x: cube.x, y: cube.y - 1, z: cube.z }))
		) {
			faces += 1;
		}
		if (
			cube.z === 0 ||
			(!map[cube.x][cube.y][cube.z - 1] && bfs(map, boundaries, { x: cube.x, y: cube.y, z: cube.z - 1 }))
		) {
			faces += 1;
		}
		if (
			cube.x === xMax ||
			(!map[cube.x + 1][cube.y][cube.z] && bfs(map, boundaries, { x: cube.x + 1, y: cube.y, z: cube.z }))
		) {
			faces += 1;
		}
		if (
			cube.y === yMax ||
			(!map[cube.x][cube.y + 1][cube.z] && bfs(map, boundaries, { x: cube.x, y: cube.y + 1, z: cube.z }))
		) {
			faces += 1;
		}
		if (
			cube.z === zMax ||
			(!map[cube.x][cube.y][cube.z + 1] && bfs(map, boundaries, { x: cube.x, y: cube.y, z: cube.z + 1 }))
		) {
			faces += 1;
		}
	}

	// * Answer
	console.log("Answer:", faces, "expect", 58);
})();
