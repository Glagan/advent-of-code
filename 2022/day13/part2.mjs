import { readFile } from "fs/promises";

(async () => {
	const file = (await readFile("input")).toString();
	const input = file.split("\n");

	const compareInts = (a, b) => {
		return a < b ? 1 : b < a ? -1 : 0;
	};
	const compareMixed = (a, b) => {
		if (typeof a === "number") {
			return compareLists([a], b);
		}
		return compareLists(a, [b]);
	};
	const compareLists = (a, b) => {
		const max = Math.max(a.length, b.length);
		for (let i = 0; i < max; i++) {
			if (a[i] === undefined) {
				return 1;
			} else if (b[i] === undefined) {
				return -1;
			}
			const comparison = compareValues(a[i], b[i]);
			if (comparison !== 0) {
				return comparison;
			}
		}
		return 0;
	};
	const compareValues = (a, b) => {
		if (typeof a === "number" && typeof b === "number") {
			return compareInts(a, b);
		} else if (Array.isArray(a) && Array.isArray(b)) {
			return compareLists(a, b);
		}
		return compareMixed(a, b);
	};

	const pairs = input.filter((l) => l !== "").map((p) => JSON.parse(p));
	pairs.push([[2]]);
	pairs.push([[6]]);
	pairs.sort((a, b) => compareValues(b, a));

	let [firstPair, secondPair] = [0, 0];
	for (let i = 0; i < pairs.length; i++) {
		const pair = pairs[i];
		if (JSON.stringify(pair) === "[[2]]") {
			firstPair = i + 1;
		} else if (JSON.stringify(pair) === "[[6]]") {
			secondPair = i + 1;
		}
	}

	console.log(pairs);

	console.log("Answer:", firstPair * secondPair);
})();
