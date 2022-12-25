import { readFile } from "fs/promises";

(async () => {
	const file = (await readFile("input")).toString();
	const input = file.split("");

	// * Parse
	const rocks = [
		{
			blocks: [
				{ x: 0, y: 0 },
				{ x: 0, y: 1 },
				{ x: 0, y: 2 },
				{ x: 0, y: 3 },
			],
			topBlocks: [0, 1, 2, 3],
			mostTop: 0,
			leftBlocks: [0],
			mostLeft: 0,
			rightBlocks: [3],
			mostRight: 3,
			downBlocks: [0, 1, 2, 3],
			mostDown: 0,
			height: 1,
			width: 4,
		},
		{
			blocks: [
				{ x: 0, y: 1 },
				{ x: -1, y: 0 },
				{ x: -1, y: 1 },
				{ x: -1, y: 2 },
				{ x: -2, y: 1 },
			],
			topBlocks: [1, 0, 3],
			mostTop: 0,
			leftBlocks: [0, 1, 4],
			mostLeft: 1,
			rightBlocks: [0, 3, 4],
			mostRight: 3,
			downBlocks: [1, 4, 3],
			mostDown: 4,
			height: 3,
			width: 3,
		},
		{
			blocks: [
				{ x: 0, y: 2 },
				{ x: -1, y: 2 },
				{ x: -2, y: 0 },
				{ x: -2, y: 1 },
				{ x: -2, y: 2 },
			],
			topBlocks: [2, 3, 0],
			mostTop: 0,
			leftBlocks: [0, 1, 2],
			mostLeft: 2,
			rightBlocks: [0, 1, 4],
			mostRight: 0,
			downBlocks: [2, 3, 4],
			mostDown: 2,
			height: 3,
			width: 3,
		},
		{
			blocks: [
				{ x: 0, y: 0 },
				{ x: -1, y: 0 },
				{ x: -2, y: 0 },
				{ x: -3, y: 0 },
			],
			topBlocks: [0],
			mostTop: 0,
			leftBlocks: [0, 1, 2, 3],
			mostLeft: 0,
			rightBlocks: [0, 1, 2, 3],
			mostRight: 0,
			downBlocks: [3],
			mostDown: 3,
			height: 4,
			width: 1,
		},
		{
			blocks: [
				{ x: 0, y: 0 },
				{ x: 0, y: 1 },
				{ x: -1, y: 0 },
				{ x: -1, y: 1 },
			],
			topBlocks: [0, 1],
			mostTop: 0,
			leftBlocks: [0, 2],
			mostLeft: 0,
			rightBlocks: [1, 3],
			mostRight: 1,
			downBlocks: [2, 3],
			mostDown: 2,
			height: 2,
			width: 2,
		},
	];
	const jets = input.map((d) => (d === ">" ? 1 : -1));

	// * Utility
	const map = [];
	let highestRockX = -1;
	let fallenRocks = 0;
	let currentRockIndex = 0;
	let jetIndex = 0;
	const visualize = (fallingRock) => {
		console.log("---------");
		const vMap = [];
		const upperLimit = Math.max(highestRockX, fallingRock ? fallingRock.blocks[fallingRock.mostTop].x : 0);
		for (let x = 0; x <= upperLimit; x++) {
			vMap.push(new Array(7).fill("."));
		}
		if (fallingRock) {
			for (const block of fallingRock.blocks) {
				vMap[upperLimit - block.x][block.y] = "@";
			}
		}
		for (const rock of map) {
			for (const block of rock.blocks) {
				vMap[upperLimit - block.x][block.y] = "#";
			}
		}
		for (const row of vMap) {
			console.log(`|${row.join("")}|`);
		}
		console.log("---------");
	};

	// * Process
	while (fallenRocks <= 2022) {
		console.log("rock", fallenRocks, "/", 2022);
		// Spawn
		const rock = {
			...JSON.parse(JSON.stringify(rocks[currentRockIndex])),
			move(by) {
				this.blocks.forEach((block) => {
					block.x += by[0];
					block.y += by[1];
				});
			},
			isTouchingDown() {
				if (this.blocks[this.mostDown].x === 0) {
					return true;
				}
				const useMap = map.filter((r) => r.blocks[r.mostTop].x >= this.blocks[this.mostDown].x + 1);
				if (useMap.length == 0) {
					return false;
				}
				return (
					this.downBlocks.find((blockIndex) => {
						const block = this.blocks[blockIndex];
						for (const rock of useMap) {
							if (
								rock.topBlocks.find(
									(t) => block.x - 1 == rock.blocks[t].x && block.y == rock.blocks[t].y
								) !== undefined
							) {
								return true;
							}
						}
						return false;
					}) !== undefined
				);
			},
			isTouchingLeft() {
				if (this.blocks[this.mostLeft].y === 0) {
					return true;
				}
				const useMap = map.filter(
					(r) =>
						r.blocks[r.mostTop].x <= this.blocks[this.mostDown].x &&
						r.blocks[r.mostDown].x >= this.blocks[this.mostTop].x
				);
				if (useMap.length == 0) {
					return false;
				}
				return (
					this.leftBlocks.find((blockIndex) => {
						const block = this.blocks[blockIndex];
						for (const rock of useMap) {
							if (
								rock.rightBlocks.find(
									(t) => block.x == rock.blocks[t].x && block.y - 1 == rock.blocks[t].y
								) !== undefined
							) {
								return true;
							}
						}
						return false;
					}) !== undefined
				);
			},
			isTouchingRight() {
				if (this.blocks[this.mostRight].y == 6) {
					return true;
				}
				const useMap = map.filter(
					(r) =>
						r.blocks[r.mostTop].x <= this.blocks[this.mostDown].x &&
						r.blocks[r.mostDown].x >= this.blocks[this.mostTop].x
				);
				if (useMap.length == 0) {
					return false;
				}
				return (
					this.rightBlocks.find((blockIndex) => {
						const block = this.blocks[blockIndex];
						for (const rock of useMap) {
							if (
								rock.leftBlocks.find(
									(t) => block.x == rock.blocks[t].x && block.y + 1 == rock.blocks[t].y
								) !== undefined
							) {
								return true;
							}
						}
						return false;
					}) !== undefined
				);
			},
		};
		rock.move([highestRockX + 3 + rocks[currentRockIndex].height, 2]);
		if (fallenRocks < 11) {
			visualize(rock);
		}
		currentRockIndex = (currentRockIndex + 1) % rocks.length;
		fallenRocks += 1;
		// Simulate
		// A rock can't be touching when it spawns
		while (true) {
			// Jets
			const movement = jets[jetIndex];
			jetIndex = (jetIndex + 1) % jets.length;
			// Ignore moves that pushes to edges
			if ((movement < 0 && !rock.isTouchingLeft()) || (movement > 0 && !rock.isTouchingRight())) {
				rock.move([0, movement]);
			}
			// Gravity
			if (rock.isTouchingDown()) {
				highestRockX = Math.max(highestRockX, rock.blocks[rock.mostTop].x);
				map.unshift(rock);
				break;
			}
			rock.move([-1, 0]);
		}
	}

	// * Answer
	console.log("Answer:", highestRockX - 1);
})();
