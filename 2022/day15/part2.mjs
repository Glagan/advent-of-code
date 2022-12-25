import { readFile } from "fs/promises";
import { exit } from "process";

(async () => {
	const file = (await readFile("input")).toString();
	const input = file.split("\n");
	const checkRow = 2000000;

	// * Parse
	const sensors = [];
	let [xMin, xMax, yMin, yMax] = [999999, -999999, 999999, -999999];
	for (const line of input) {
		const [_, x, y, bX, bY] = line.match(
			/Sensor at x=(-?\d+), y=(-?\d+): closest beacon is at x=(-?\d+), y=(-?\d+)/
		);
		const sensor = {
			x: Number(x),
			y: Number(y),
			beacon: { x: Number(bX), y: Number(bY) },
		};
		sensor.distance = Math.round(Math.abs(sensor.x - sensor.beacon.x) + Math.abs(sensor.y - sensor.beacon.y));
		if (sensor.x - sensor.distance < xMin) {
			xMin = sensor.x - sensor.distance;
		}
		if (sensor.beacon.x < xMin) {
			xMin = sensor.beacon.x;
		}
		if (sensor.y - sensor.distance < yMin) {
			yMin = sensor.y - sensor.distance;
		}
		if (sensor.beacon.y < yMin) {
			yMin = sensor.beacon.y;
		}
		if (sensor.x + sensor.distance > xMax) {
			xMax = sensor.x + sensor.distance;
		}
		if (sensor.beacon.x > xMax) {
			xMax = sensor.beacon.x;
		}
		if (sensor.y + sensor.distance > yMax) {
			yMax = sensor.y + sensor.distance;
		}
		if (sensor.beacon.y > yMax) {
			yMax = sensor.beacon.y;
		}
		sensor.isInRange = (x, y) => {
			return Math.round(Math.abs(sensor.x - x) + Math.abs(sensor.y - y)) <= sensor.distance;
		};
		sensors.push(sensor);
	}
	console.log("#", sensors);

	// * Process
	// For each sensors check their borders and if the tile is in the range of another sensor
	const directions = [
		[-1, 0],
		[1, 0],
		[0, -1],
		[0, 1],
	];
	for (const sensor of sensors) {
		// Check tips
		for (const direction of directions) {
			const [x, y] = [
				sensor.x - sensor.distance - 1 - direction[0],
				sensor.y - sensor.distance - 1 - direction[1],
			];
			if (
				x >= 0 &&
				y >= 0 &&
				x <= 4000000 &&
				y <= 4000000 &&
				sensors.every((sensor) => !sensor.isInRange(x, y))
			) {
				console.log(`found Answer (${x},${y})`, x * 4000000 + y);
				exit(0);
			}
		}
		// Check left/right borders + 1
		let xWidth = 0;
		let xDirection = 1;
		for (let yOffset = sensor.distance * -1; yOffset <= sensor.distance + 1; yOffset++) {
			const y = sensor.y - yOffset;
			if (y >= 0 && y <= 4000000) {
				let xOffset = xWidth * -1 - 1;
				let x = sensor.x - xOffset;
				if (x >= 0 && x <= 4000000 && sensors.every((sensor) => !sensor.isInRange(x, y))) {
					console.log(`found Answer (${x},${y})`, x * 4000000 + y);
					exit(0);
				}
				xOffset = xWidth - 1;
				x = sensor.x + xOffset;
				if (x >= 0 && x <= 4000000 && sensors.every((sensor) => !sensor.isInRange(x, y))) {
					console.log(`found Answer (${x},${y})`, x * 4000000 + y);
					exit(0);
				}
			}
			if (xWidth === sensor.distance) {
				xDirection = -1;
			}
			xWidth += xDirection;
		}
	}

	// * Answer
	console.log("Answer:", 0);
})();
