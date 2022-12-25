import { readFile } from "fs/promises";

(async () => {
	const file = (await readFile("input")).toString();
	const input = file.split("\n");

	// * Parse
	function toDecimal(snafu) {
		let decimalResult = 0;
		let power = 1;
		const asArray = Array.from(snafu);
		for (let index = asArray.length - 1; index >= 0; index--) {
			const char = asArray[index];
			if (char === "0" || char === "1" || char === "2") {
				decimalResult += Number(char) * power;
			} else if (char == "-") {
				decimalResult -= power;
			} else if (char == "=") {
				decimalResult -= 2 * power;
			}
			power *= 5;
		}
		return decimalResult;
	}
	function toSnafu(decimal) {
		const snafuResult = [];
		while (decimal) {
			const quotient = Math.floor(decimal / 5);
			const remainder = decimal % 5;
			decimal = quotient;
			if (remainder < 3) {
				snafuResult.unshift(remainder);
			} else if (remainder === 3) {
				decimal += 1;
				snafuResult.unshift("=");
			} else if (remainder === 4) {
				decimal += 1;
				snafuResult.unshift("-");
			}
		}
		return snafuResult.join("");
	}

	// * Process
	const decimalAnswer = input.map((snafu) => toDecimal(snafu)).reduce((acc, value) => acc + value, 0);
	console.log("converted", decimalAnswer);

	// * Answer
	console.log("Answer:", toSnafu(decimalAnswer));
})();
