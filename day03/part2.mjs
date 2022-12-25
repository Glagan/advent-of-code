import { readFile } from "fs/promises";

const A_LOW = "a".charCodeAt(0);
const A_UP = "A".charCodeAt(0);
const Z_LOW = "z".charCodeAt(0);
const Z_UP = "Z".charCodeAt(0);

(async () => {
	const file = (await readFile("input")).toString();
	const lines = file.split("\n");

	let sum = 0;
	for (let index = 0; index < lines.length; ) {
		const sacks = lines.slice(index, index + 3);
		let usedInEach = [{}, {}, {}];
		for (let j = 0; j < 3; j++) {
			for (const item of Array.from(sacks[j])) {
				if (!usedInEach[j][item]) {
					usedInEach[j][item] = 1;
				} else {
					usedInEach[j][item] += 1;
				}
			}
		}
		for (const item of Object.keys(usedInEach[0])) {
			if (usedInEach[1][item] !== undefined && usedInEach[2][item] !== undefined) {
				const itemCode = item.charCodeAt(0);
				if (itemCode >= A_LOW && itemCode <= Z_LOW) {
					sum += item.charCodeAt(0) - A_LOW + 1;
				} else {
					sum += item.charCodeAt(0) - A_UP + 27;
				}
				break;
			}
		}

		index += 3;
	}

	console.log("Answer:", sum);
})();
