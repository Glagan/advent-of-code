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

	let highestScore = 0;
	for (let i = 1; i < iMax - 1; i++) {
		for (let j = 1; j < jMax - 1; j++) {
			const score = directions.reduce((acc, [offsetI, offsetJ]) => {
				let score = 0;
				let [currentI, currentJ] = [i + offsetI, j + offsetJ];
				while (currentI >= 0 && currentI < iMax && currentJ >= 0 && currentJ < jMax) {
					score += 1;
					if (input[currentI][currentJ] >= input[i][j]) {
						break;
					}
					currentI += offsetI;
					currentJ += offsetJ;
				}
				return acc * score;
			}, 1);
			if (score > highestScore) {
				highestScore = score;
			}
		}
	}

	console.log("Answer:", highestScore);
})();
