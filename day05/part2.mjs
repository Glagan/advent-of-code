import { readFile } from "fs/promises";

(async () => {
	const file = (await readFile("input")).toString();
	const lines = file.split("\n");

	let state = [
		["G", "T", "R", "W"],
		["G", "C", "H", "P", "M", "S", "V", "W"],
		["C", "L", "T", "S", "G", "M"],
		["J", "H", "D", "M", "W", "R", "F"],
		["P", "Q", "L", "H", "S", "W", "F", "J"],
		["P", "J", "D", "N", "F", "M", "S"],
		["Z", "B", "D", "F", "G", "C", "S", "J"],
		["R", "T", "B"],
		["H", "N", "W", "L", "C"],
	];

	let sum = 0;
	for (const line of lines) {
		let [_, quantity, stackStart, stackEnd] = /move (\d+) from (\d+) to (\d+)/.exec(line);
		const length = state[stackStart - 1].length;
		const elements = state[stackStart - 1].splice(length - quantity, quantity);
		state[stackEnd - 1].push(...elements);
	}

	console.log("state", state);
	console.log("Answer:", state.map((stack) => stack[stack.length - 1]).join(""));
})();
