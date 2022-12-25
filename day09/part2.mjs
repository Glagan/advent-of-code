import { readFile } from "fs/promises";

function visualize(head, tails) {
	for (let i = -20; i < 20; i++) {
		let line = [];
		for (let j = -20; j < 20; j++) {
			if (head[0] === i && head[1] == j) {
				line.push("H");
			} else {
				const tail = tails.findIndex((tail) => tail[0] == i && tail[1] == j);
				if (tail >= 0) {
					line.push(`${tail + 1}`);
				} else {
					line.push(".");
				}
			}
		}
		console.log(line.join(""));
	}
	console.log("---");
}

(async () => {
	const file = (await readFile("input")).toString();
	const input = file.split("\n");

	const angles = [
		[-1, 0],
		[1, 0],
		[0, -1],
		[0, 1],
	];
	const diagonals = [
		[-1, -1],
		[-1, 1],
		[1, -1],
		[1, 1],
	];

	let headPosition = [0, 0];
	let tailPositions = [
		[0, 0],
		[0, 0],
		[0, 0],
		[0, 0],
		[0, 0],
		[0, 0],
		[0, 0],
		[0, 0],
		[0, 0],
	];
	const visitedState = { [0]: { [0]: true } };
	let visited = 1;

	const distance = (p1, p2) => {
		return Math.round(Math.sqrt(Math.pow(p2[0] - p1[0], 2) + Math.pow(p2[1] - p1[1], 2)));
	};

	for (const line of input) {
		let [direction, amount] = line.split(" ");
		amount = parseInt(amount);

		for (let i = 0; i < amount; i++) {
			let movement = [0, 0];
			switch (direction) {
				case "R":
					movement = [0, 1];
					break;
				case "L":
					movement = [0, -1];
					break;
				case "U":
					movement = [-1, 0];
					break;
				case "D":
					movement = [1, 0];
					break;
			}

			// Head movement
			headPosition = [headPosition[0] + movement[0], headPosition[1] + movement[1]];

			// Tail movement
			// console.log("movement", movement, "to", headPosition);
			for (let index = 0; index < tailPositions.length; index++) {
				const tailPosition = tailPositions[index];
				const against = index === 0 ? headPosition : tailPositions[index - 1];

				// Update node position
				/* console.log(
					"checking",
					index + 1,
					tailPosition,
					"against",
					index,
					against,
					"distance",
					distance(tailPosition, against)
				); */
				if (distance(tailPosition, against) > 1) {
					// Move in diagonals only if the node is not in the same row or column
					if (tailPosition[0] == against[0] || tailPosition[1] == against[1]) {
						for (const angle of angles) {
							const newPosition = [tailPosition[0] + angle[0], tailPosition[1] + angle[1]];
							if (distance(newPosition, against) === 1) {
								// console.log(
								// 	"moving",
								// 	index + 1,
								// 	"from",
								// 	tailPositions[index],
								// 	"to",
								// 	newPosition,
								// 	"for",
								// 	against
								// );
								tailPositions[index] = newPosition;
								break;
							}
						}
						// console.log(
						// 	"moving",
						// 	index + 1,
						// 	"from",
						// 	tailPositions[index],
						// 	"to",
						// 	[tailPosition[0] + movement[0], tailPosition[1] + movement[1]],
						// 	"for",
						// 	against
						// );
						// tailPositions[index] = [tailPosition[0] + movement[0], tailPosition[1] + movement[1]];
					} /* diagonal movement */ else {
						for (const diagonal of diagonals) {
							const newPosition = [tailPosition[0] + diagonal[0], tailPosition[1] + diagonal[1]];
							if (distance(newPosition, against) === 1) {
								// console.log(
								// 	"moving",
								// 	index + 1,
								// 	"from",
								// 	tailPositions[index],
								// 	"to",
								// 	newPosition,
								// 	"for",
								// 	against
								// );
								tailPositions[index] = newPosition;
								break;
							}
						}
						/*if (tailPosition[0] - 1 == against[0] || tailPosition[0] + 1 == against[0]) {
							if (tailPosition[1] > against[1]) {
								tailPositions[index] = [against[0], tailPosition[1] - 1];
								console.log("moving", index + 1, "top/bottom left");
							} else {
								tailPositions[index] = [against[0], tailPosition[1] + 1];
								console.log("moving", index + 1, "top/bottom right");
							}
						} else if (tailPosition[1] - 1 == against[1] || tailPosition[1] + 1 == against[1]) {
							if (tailPosition[0] > against[0]) {
								tailPositions[index] = [tailPosition[0] - 1, against[1]];
								console.log("moving", index + 1, "top left/right");
							} else {
								tailPositions[index] = [tailPosition[0] + 1, against[1]];
								console.log("moving", index + 1, "bottom left/right");
							}
						}*/
					}
				}

				// Only the last tail visits count
				if (index === 8) {
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

			// if (direction === "R" && amount === 17) {
			// 	visualize(headPosition, tailPositions);
			// }
		}

		// visualize(headPosition, tailPositions);
	}

	console.log("Answer:", visited);
})();
