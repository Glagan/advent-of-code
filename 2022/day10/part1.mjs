import { readFile } from "fs/promises";

(async () => {
	const file = (await readFile("input")).toString();
	const input = file.split("\n").map((line) => line.split(" "));

	const reportCycles = [20, 60, 100, 140, 180, 220];

	let cycle = 1;
	let X = 1;
	let strengthSum = 0;
	for (const line of input) {
		if (line[0] === "noop") {
			if (reportCycles.indexOf(cycle) >= 0) {
				console.log("cycle", cycle, "X is", X, "add", cycle, "*", X);
				strengthSum += cycle * X;
			}
			cycle += 1;
		} else {
			const value = parseInt(line[1]);
			if (reportCycles.indexOf(cycle) >= 0) {
				console.log("cycle", cycle, "X is", X, "add", cycle, "*", X);
				strengthSum += cycle * X;
			}
			cycle += 1;
			if (reportCycles.indexOf(cycle) >= 0) {
				console.log("cycle", cycle, "X is", X, "add", cycle, "*", X);
				strengthSum += cycle * X;
			}
			X += value;
			cycle += 1;
		}
	}

	console.log("Answer:", strengthSum);
})();
