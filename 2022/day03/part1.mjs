import { readFile } from "fs/promises";

const A_LOW = "a".charCodeAt(0);
const A_UP = "A".charCodeAt(0);
const Z_LOW = "z".charCodeAt(0);
const Z_UP = "Z".charCodeAt(0);

(async () => {
	const file = (await readFile("input")).toString();
	const lines = file.split("\n");

	let sum = 0;
	for (const line of lines) {
		const half = line.length / 2;
		const firstCompartiment = Array.from(line.slice(0, half));
		const secondCompartiment = Array.from(line.slice(half));

		// console.log(firstCompartiment, firstCompartiment.length, secondCompartiment, secondCompartiment.length);

		for (let index = 0; index < half; index++) {
			const item = firstCompartiment[index];
			if (secondCompartiment.indexOf(item) >= 0) {
				const itemCode = item.charCodeAt(0);
				if (itemCode >= A_LOW && itemCode <= Z_LOW) {
					sum += item.charCodeAt(0) - A_LOW + 1;
					// console.log("duplicate", item, item.charCodeAt(0), item.charCodeAt(0) - A_LOW + 1);
				} else {
					sum += item.charCodeAt(0) - A_UP + 27;
					// console.log("duplicate", item, item.charCodeAt(0), item.charCodeAt(0) - A_UP + 27);
				}
				break;
			}
		}
	}

	console.log("Answer:", sum);
})();
