import { readFile } from "fs/promises";

// A rock B paper C scissor
const ROCK = "A";
const PAPER = "B";
const SCISSOR = "C";
const WIN = "Z";
const DRAW = "Y";
const LOSE = "X";
const MOVE_SCORE = { [ROCK]: 1, [PAPER]: 2, [SCISSOR]: 3 };
const WINNING_MOVE = { [ROCK]: PAPER, [PAPER]: SCISSOR, [SCISSOR]: ROCK };
const LOSING_MOVE = { [ROCK]: SCISSOR, [PAPER]: ROCK, [SCISSOR]: PAPER };

(async () => {
	const file = (await readFile("input")).toString();
	const lines = file.split("\n");

	let score = 0;
	for (const line of lines) {
		const actions = line.split(" ");
		const ennemyMove = actions[0];
		const selfMove = actions[1];
		if (selfMove == WIN) {
			score += MOVE_SCORE[WINNING_MOVE[ennemyMove]] + 6;
		} else if (selfMove == DRAW) {
			score += MOVE_SCORE[ennemyMove] + 3;
		} else {
			score += MOVE_SCORE[LOSING_MOVE[ennemyMove]];
		}
	}

	console.log("Answer:", score);
})();
