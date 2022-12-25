import { readFile } from "fs/promises";

(async () => {
	const file = (await readFile("input")).toString();
	const input = file.split("\n").map((line) => line.split(""));

	const iMax = input.length;
	const jMax = input[0].length;

	const directions = [
		[-1, 0],
		[0, -1],
		[1, 0],
		[0, 1],
	];

	let visible = iMax * 2 + jMax * 2 - 4;
	for (let i = 1; i < iMax - 1; i++) {
		for (let j = 1; j < jMax - 1; j++) {
			if (
				directions.find(([offsetI, offsetJ]) => {
					let [currentI, currentJ] = [i + offsetI, j + offsetJ];
					while (currentI >= 0 && currentI < iMax && currentJ >= 0 && currentJ < jMax) {
						if (input[currentI][currentJ] >= input[i][j]) {
							return false;
						}
						currentI += offsetI;
						currentJ += offsetJ;
					}
					return true;
				})
			) {
				visible += 1;
			}
		}
	}

	console.log("Answer:", visible);
})();
