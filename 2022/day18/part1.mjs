import { readFile } from "fs/promises";

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
	let faces = 0;
	for (let i = 0; i < cubes.length; i++) {
		const cube = cubes[i];
		// Check the adjacent of each positions
		if (cube.x === 0 || !map[cube.x - 1][cube.y][cube.z]) {
			faces += 1;
		}
		if (cube.y === 0 || !map[cube.x][cube.y - 1][cube.z]) {
			faces += 1;
		}
		if (cube.z === 0 || !map[cube.x][cube.y][cube.z - 1]) {
			faces += 1;
		}
		if (cube.x === xMax || !map[cube.x + 1][cube.y][cube.z]) {
			faces += 1;
		}
		if (cube.y === yMax || !map[cube.x][cube.y + 1][cube.z]) {
			faces += 1;
		}
		if (cube.z === zMax || !map[cube.x][cube.y][cube.z + 1]) {
			faces += 1;
		}
	}

	// * Answer
	console.log("Answer:", faces, "expect", 64);
})();
