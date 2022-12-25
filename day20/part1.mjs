import { readFile } from "fs/promises";

(async () => {
	const file = (await readFile("input")).toString();
	const input = file.split("\n");

	// * Parse
	const numbers = input.map((n) => Number(n));
	const originalList = [...numbers];
	let start = { previous: null, value: numbers[0], next: null };
	let current = start;
	for (const number of numbers.slice(1)) {
		current.next = {
			previous: current,
			value: number,
			next: null,
		};
		current = current.next;
	}
	start.previous = current;
	current.next = start;
	console.log("tail", current);

	// * Utility
	const find = (number) => {
		let head = current;
		while (head.value !== number) {
			head = head.next;
		}
		return head;
	};
	const toString = () => {
		let values = [current.value];
		let head = current.next;
		while (head.value !== current.value) {
			values.push(head.value);
			head = head.next;
		}
		return values.join(", ");
	};
	console.log("list", toString());

	// * Process
	for (let i = 0; i < originalList.length; i++) {
		const number = originalList[i];
		console.log("moving", number, i + 1, "/", originalList.length);
		if (number !== 0) {
			let node = find(number);
			// Remove node from the chain
			node.previous.next = node.next;
			node.next.previous = node.previous;
			current = node.previous;
			// console.log("shuffled", number, toString());
			// Go to the new 'index' on the chain
			if (number > 0) {
				for (let index = 0; index < Math.abs(number); index++) {
					node = node.next;
				}
				const movedNode = { previous: node, value: number, next: node.next };
				node.next.previous = movedNode;
				node.next = movedNode;
				current = movedNode;
				// console.log("shuffled", number, toString());
			} else {
				for (let index = 0; index < Math.abs(number); index++) {
					node = node.previous;
				}
				const movedNode = { previous: node.previous, value: number, next: node };
				node.previous.next = movedNode;
				node.previous = movedNode;
				current = movedNode;
				// console.log("shuffled", number, toString());
			}
		}
	}

	// * Answer
	let head = find(0);
	const answer = [1, 2, 3].reduce((carry, _) => {
		for (let index = 0; index < 1000; index++) {
			head = head.next;
		}
		return carry + head.value;
	}, 0);
	console.log("Answer:", answer, "expect", 3346);
})();
