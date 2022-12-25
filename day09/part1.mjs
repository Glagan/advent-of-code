import { readFile } from "fs/promises";

(async () => {
	const file = (await readFile("input")).toString();
	const input = file.split("\n");

	const headPosition = [0, 0];
	let tailPosition = [0, 0];
	const visitedState = { [0]: { [0]: true } };
	let visited = 1;

	const distance = (p1, p2) => {
		return Math.round(Math.sqrt(Math.pow(p2[0] - p1[0], 2) + Math.pow(p2[1] - p1[1], 2)));
	};

	for (const line of input) {
		let [direction, amount] = line.split(" ");
		amount = parseInt(amount);
		for (let i = 0; i < amount; i++) {
			const previousHead = [...headPosition];
			switch (direction) {
				case "R":
					headPosition[1] += 1;
					break;
				case "U":
					headPosition[0] -= 1;
					break;
				case "D":
					headPosition[0] += 1;
					break;
				case "L":
					headPosition[1] -= 1;
					break;
			}
			if (distance(headPosition, tailPosition) > 1) {
				tailPosition = previousHead;
				if (visitedState[tailPosition[0]]) {
					if (!visitedState[tailPosition[0]][tailPosition[1]]) {
						visitedState[tailPosition[0]][tailPosition[1]] = true;
						visited += 1;
					}
				} else {
					visitedState[tailPosition[0]] = { [tailPosition[1]]: true };
					visited += 1;
				}
			}
		}
	}

	console.log("Answer:", visited);
})();
