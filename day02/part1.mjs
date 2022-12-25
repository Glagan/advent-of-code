import { readFile } from "fs/promises";

// A rock B paper C scissor
const ROCK = "A";
const PAPER = "B";
const SCISSOR = "C";
const MOVE_SCORE = { [ROCK]: 1, [PAPER]: 2, [SCISSOR]: 3 };

(async () => {
	const file = (await readFile("input")).toString();
	const lines = file.split("\n");

	const play = { Y: PAPER, Z: SCISSOR, X: ROCK };
	let score = 0;
	for (const line of lines) {
		const actions = line.split(" ");
		const ennemyMove = actions[0];
		const selfMove = play[actions[1]];
		if (
			(ennemyMove == ROCK && selfMove == PAPER) ||
			(ennemyMove == PAPER && selfMove == SCISSOR) ||
			(ennemyMove == SCISSOR && selfMove == ROCK)
		) {
			score += MOVE_SCORE[selfMove] + 6;
		} else if (ennemyMove == selfMove) {
			score += MOVE_SCORE[selfMove] + 3;
		} else {
			score += MOVE_SCORE[selfMove];
		}
	}

	console.log("Answer:", score);
})();
