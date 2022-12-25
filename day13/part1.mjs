import { readFile } from "fs/promises";

(async () => {
	const file = (await readFile("input")).toString();
	const input = file.split("\n");

	const compareInts = (a, b) => {
		console.log("| compare", a, b, a < b ? "in order" : b < a ? "out of order" : "ignore");
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
				console.log("$ compare", JSON.stringify(a), JSON.stringify(b), "in order");
				return 1;
			} else if (b[i] === undefined) {
				console.log("% compare", JSON.stringify(a), JSON.stringify(b), "out of order");
				return -1;
			}
			const comparison = compareValues(a[i], b[i]);
			if (comparison !== 0) {
				return comparison;
			}
		}
		console.log("@ compare", JSON.stringify(a), JSON.stringify(b), "ignore");
		return 0;
	};
	const compareValues = (a, b) => {
		if (typeof a === "number" && typeof b === "number") {
			return compareInts(a, b);
		} else if (Array.isArray(a) && Array.isArray(b)) {
			return compareLists(a, b);
		}
		console.log("& compare mixed", a, b);
		return compareMixed(a, b);
	};

	let pairInOrder = 0;
	let pairIndex = 1;
	for (let i = 0; i < input.length; i += 3) {
		const [pair1, pair2] = [JSON.parse(input[i]), JSON.parse(input[i + 1])];
		console.log("# compare", JSON.stringify(pair1), JSON.stringify(pair2));
		const comparison = compareValues(pair1, pair2);
		if (comparison === 1) {
			pairInOrder += pairIndex;
		}
		pairIndex += 1;
	}

	console.log("Answer:", pairInOrder);
})();
