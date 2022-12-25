import { readFile } from "fs/promises";

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
		sensor.distance = Math.round(Math.abs(sensor.y - sensor.beacon.y) + Math.abs(sensor.x - sensor.beacon.x));
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
		sensors.push(sensor);
	}
	console.log("#", sensors);
	console.log("#", xMin, xMax, yMin, yMax, "map of", (yMax - yMin) * (xMax - xMin), "elements (lol)");

	// * Process
	const row = new Array(xMax - xMin).fill(".");
	console.log("# Generating sensor widths");
	for (const sensor of sensors) {
		console.log("# Processing", sensor);
		if (sensor.y === checkRow) {
			row[sensor.x - xMin] = "S";
		}
		if (sensor.beacon.y === checkRow) {
			row[sensor.beacon.x - xMin] = "B";
		}
		let xWidth = 0;
		let xDirection = 1;
		for (let yOffset = -sensor.distance; yOffset <= sensor.distance; yOffset++) {
			if (sensor.y - yOffset === checkRow) {
				for (let xOffset = -xWidth; xOffset <= xWidth; xOffset++) {
					if (row[sensor.x - xOffset - xMin] == ".") {
						row[sensor.x - xOffset - xMin] = "#";
					}
				}
			}
			if (xWidth === sensor.distance) {
				xDirection = -1;
			}
			xWidth += xDirection;
		}
	}
	console.log(`${("       " + checkRow).slice(-7)}`, row.join(""));

	// * Answer
	let total = 0;
	for (const column of row) {
		if (column === "#") {
			total += 1;
		}
	}
	console.log("Answer:", total);
})();
