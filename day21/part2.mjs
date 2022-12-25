import { readFile } from "fs/promises";
import nerdamer from "nerdamer";
import "nerdamer/Solve.js"; // Import to expand functions, functions are not exported

(async () => {
	const file = (await readFile("input")).toString();
	const input = file.split("\n");

	// * Parse
	let monkeys = {};
	for (const line of input) {
		const [_, name, value] = line.match(/(.+): (.+)/);
		if (!isNaN(parseInt(value))) {
			monkeys[name] = Number(value);
		} else {
			const [_, m1, op, m2] = value.match(/(.+) (.) (.+)/);
			monkeys[name] = { m1, op, m2 };
		}
	}

	// * Process
	const resolveEquation = (name) => {
		const { m1, op, m2 } = monkeys[name];
		// If the equation is already solved
		if (typeof monkeys[m1] === "number" && typeof monkeys[m2] === "number") {
			let left = monkeys[m1];
			let right = monkeys[m2];
			return op === "+" ? left + right : op === "-" ? left - right : op === "*" ? left * right : left / right;
		}
		// Build an equation with humn as x
		let left = "x";
		if (m1 !== "humn") {
			left = typeof monkeys[m1] === "number" ? monkeys[m1] : resolveEquation(m1);
		}
		let right = "x";
		if (m2 !== "humn") {
			right = typeof monkeys[m2] === "number" ? monkeys[m2] : resolveEquation(m2);
		}
		if (typeof left === "number" && typeof right === "number") {
			return op === "+" ? left + right : op === "-" ? left - right : op === "*" ? left * right : left / right;
		}
		return ["(", left, op, right, ")"].join("");
	};
	const { m1, m2 } = monkeys.root;
	// One or the other will be fully resolved and returned as a number
	const left = resolveEquation(m1);
	const right = resolveEquation(m2);

	// * Answer
	const answer = nerdamer.solve(`${left} = ${right}`, "x");
	console.log("Answer:", Math.round(parseFloat(answer.text().slice(1, -1))));
})();
