import { readFile } from "fs/promises";

(async () => {
	const file = (await readFile("input")).toString();
	const input = file.split("\n");

	// * Parse
	const monkeys = {};
	for (const line of input) {
		const [_, name, value] = line.match(/(.+): (.+)/);
		if (!isNaN(parseInt(value))) {
			monkeys[name] = Number(value);
		} else {
			const [_, m1, op, m2] = value.match(/(.+) (.) (.+)/);
			monkeys[name] = { m1, op, m2 };
		}
	}
	console.log(monkeys);

	// * Process
	const resolveNumber = (name) => {
		console.log("resolve", name);
		const { m1, op, m2 } = monkeys[name];
		let left = typeof monkeys[m1] === "number" ? monkeys[m1] : resolveNumber(m1);
		let right = typeof monkeys[m2] === "number" ? monkeys[m2] : resolveNumber(m2);
		let result = op === "+" ? left + right : op === "-" ? left - right : op === "*" ? left * right : left / right;
		monkeys[name] = result;
		return result;
	};

	// * Answer
	console.log("Answer:", resolveNumber("root", monkeys.root), "expect", 152);
})();
