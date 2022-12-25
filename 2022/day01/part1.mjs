import { readFile } from "fs/promises";

(async () => {
	const file = (await readFile("input")).toString();
	let lines = file.split("\n");

	let elves = [];

	let current = 0;
	for (const line of lines) {
		if (line == "") {
			elves.push(current);
			current = 0;
		} else {
			current += parseInt(line);
		}
	}

	elves.sort((a, b) => b - a);

	console.log("elves:", elves);
	console.log("Answer:", elves[0] + elves[1] + elves[2]);
})();
