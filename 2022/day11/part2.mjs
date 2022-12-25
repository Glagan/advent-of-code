import { readFile } from "fs/promises";

(async () => {
	const file = (await readFile("input")).toString();
	const input = file.split("\n\n");

	let monkeys = [];
	for (const rawMonkey of input) {
		let monkey = { inspected: 0, items: [], operation: null, test: null, divisor: 0, true: 0, false: 0 };
		monkey.items = rawMonkey
			.match(/Starting items: (.+)\n/)[1]
			.split(", ")
			.map((item) => parseInt(item));
		const [op, againstValue] = rawMonkey.match(/new = old (.) (\d+|old)/).slice(1, 3);
		monkey.operation = (value) => {
			if (op === "+") {
				return value + (againstValue === "old" ? value : parseInt(againstValue));
			} else if (op === "*") {
				return value * (againstValue === "old" ? value : parseInt(againstValue));
			}
		};
		const testValue = parseInt(rawMonkey.match(/divisible by (\d+)/)[1]);
		monkey.test = (value) => value % testValue === 0;
		monkey.divisor = testValue;
		monkey.true = parseInt(rawMonkey.match(/If true: throw to monkey (\d+)/)[1]);
		monkey.false = parseInt(rawMonkey.match(/If false: throw to monkey (\d+)/)[1]);
		monkeys.push(monkey);
	}

	const pod = monkeys.map((m) => m.divisor).reduce((acc, v) => acc * v, 1);
	console.log(pod);
	for (let round = 0; round < 10000; round++) {
		let i = 0;
		for (const monkey of monkeys) {
			// console.log("Monkey", i);
			const items = [...monkey.items];
			monkey.items = [];
			for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
				// console.log("\tMonkey inspects an item with a worry level of", items[itemIndex]);
				const worry = monkey.operation(items[itemIndex]) % pod;
				// console.log("\t\tWorry level is updated to", worry);
				monkey.inspected += 1;
				if (monkey.test(worry)) {
					// console.log("\t\tCurrent worry level is tested");
					// console.log("\t\tItem with worry level", worry, "is thrown to monkey", monkey.true, ".");
					monkeys[monkey.true].items.push(worry);
				} else {
					// console.log("\t\tCurrent worry level is not tested");
					// console.log("\t\tItem with worry level", worry, "is thrown to monkey", monkey.false, ".");
					monkeys[monkey.false].items.push(worry);
				}
			}
			i++;
		}
		// console.log("---");
	}

	console.log(monkeys);
	const sorted = monkeys.sort((a, b) => b.inspected - a.inspected);
	console.log("Answer:", sorted[0].inspected * sorted[1].inspected);
})();
