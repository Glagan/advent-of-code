import { readFile } from "fs/promises";

(async () => {
	const file = (await readFile("input")).toString();
	const input = file.split("\n");

	// * Parse
	let numbers = input.map((n) => Number(n));
	numbers = numbers.map((value) => ({ value: value * 811589153 }));
	const shuffleCount = 10;
	const originalList = [...numbers];

	// * Process
	for (let c = 0; c < shuffleCount; c++) {
		for (const number of originalList) {
			const index = numbers.indexOf(number);
			const value = numbers.splice(index, 1).shift();
			let newIndex = index + number.value;
			const length = numbers.length;
			if (newIndex < 0) newIndex += length * Math.abs(Math.floor(newIndex / length));
			if (newIndex >= length) newIndex = newIndex % length;
			numbers.splice(newIndex, 0, value);
		}
	}
	numbers = numbers.map((n) => n.value);

	// * Answer
	let zeroIndex = numbers.indexOf(0);
	const answer = [1000, 2000, 3000].reduce((carry, checkpoint) => {
		console.log(numbers[(zeroIndex + checkpoint) % numbers.length]);
		return carry + numbers[(zeroIndex + checkpoint) % numbers.length];
	}, 0);
	console.log("Answer:", answer, "expect", 4265712588168);
})();
