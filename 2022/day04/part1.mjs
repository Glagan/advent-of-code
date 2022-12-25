import { readFile } from "fs/promises";

(async () => {
	const file = (await readFile("input")).toString();
	const lines = file.split("\n");

	let sum = 0;
	for (const line of lines) {
		let pairs = line.split(",");
		let [firstRange, secondRange] = [
			pairs[0].split("-").map((v) => parseInt(v)),
			pairs[1].split("-").map((v) => parseInt(v)),
		];
		if (
			(firstRange[0] <= secondRange[0] && firstRange[1] >= secondRange[1]) ||
			(firstRange[0] >= secondRange[0] && firstRange[1] <= secondRange[1])
		) {
			sum += 1;
		}
	}

	console.log("Answer:", sum);
})();
