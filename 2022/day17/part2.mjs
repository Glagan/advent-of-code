// import { createWriteStream } from "fs";
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
	let map = [];
	let upperLimit = 150000;
	for (let index = 0; index < upperLimit; index++) {
		map.push(new Array(7).fill("."));
	}
	let highestRockX = -1;
	let skippedRockHeight = 0;
	let fallenRocks = 0;
	let currentRockIndex = 0;
	let jetIndex = 0;
	const visualize = () => {
		for (const row of map) {
			console.log(`|${row.join("")}|`);
		}
	};

	// * Process
	const stuckRocks = [];
	const rockHeights = [];
	while (fallenRocks <= 1000000000000) {
		if (fallenRocks % 1000 === 0) {
			console.log("rock", fallenRocks, "/", 1000000000000);
		}
		// Spawn
		const rock = {
			...JSON.parse(JSON.stringify(rocks[currentRockIndex])),
			set(offset) {
				this.blocks.forEach((block) => {
					block.x += offset[0];
					block.y += offset[1];
					map[block.x][block.y] = "#";
				});
			},
			move(by) {
				this.blocks.forEach((block) => {
					map[block.x][block.y] = ".";
				});
				this.blocks.forEach((block) => {
					block.x += by[0];
					block.y += by[1];
					map[block.x][block.y] = "#";
				});
			},
			isTouchingDown() {
				if (this.blocks[this.mostDown].x === 0) {
					return true;
				}
				return (
					this.downBlocks.find((blockIndex) => {
						const block = this.blocks[blockIndex];
						return map[block.x - 1][block.y] !== ".";
					}) !== undefined
				);
			},
			isTouchingLeft() {
				if (this.blocks[this.mostLeft].y === 0) {
					return true;
				}
				return (
					this.leftBlocks.find((blockIndex) => {
						const block = this.blocks[blockIndex];
						return map[block.x][block.y - 1] !== ".";
					}) !== undefined
				);
			},
			isTouchingRight() {
				if (this.blocks[this.mostRight].y == 6) {
					return true;
				}
				return (
					this.rightBlocks.find((blockIndex) => {
						const block = this.blocks[blockIndex];
						return map[block.x][block.y + 1] !== ".";
					}) !== undefined
				);
			},
		};
		let oldUpper = upperLimit;
		if (upperLimit <= highestRockX + 3 + rock.height) {
			upperLimit = highestRockX + 3 + rock.height;
			for (let index = 0; index <= upperLimit - oldUpper; index++) {
				map.push(new Array(7).fill("."));
			}
		}
		rock.set([highestRockX + 3 + rocks[currentRockIndex].height, 2]);
		currentRockIndex = (currentRockIndex + 1) % rocks.length;
		fallenRocks += 1;
		// Simulate
		// A rock can't be touching when it spawns
		const moves = [];
		while (true) {
			// Jets
			const movement = jets[jetIndex];
			moves.push(jetIndex);
			jetIndex = (jetIndex + 1) % jets.length;
			// Ignore moves that pushes to edges
			if ((movement < 0 && !rock.isTouchingLeft()) || (movement > 0 && !rock.isTouchingRight())) {
				moves.push(movement ? "r" : "l");
				rock.move([0, movement]);
			}
			// Gravity
			if (rock.isTouchingDown()) {
				highestRockX = Math.max(highestRockX, rock.blocks[rock.mostTop].x);
				if (skippedRockHeight === 0) {
					const hashedBlock = moves.join("");
					let sameFlow = stuckRocks.findLastIndex((s) => s === hashedBlock);
					if (sameFlow >= 0) {
						const last = stuckRocks.length - 1;
						const cycleLength = stuckRocks.length - sameFlow;
						sameFlow -= 1;
						// Validate the cycle 10 times
						let allValid = true;
						for (let j = 0; j < 10; j++) {
							let k = 0;
							for (; k < cycleLength; k++) {
								if (
									stuckRocks[last - k - j * cycleLength] !==
									stuckRocks[sameFlow - k - j * cycleLength]
								) {
									allValid = false;
									break;
								}
							}
							if (
								k !== cycleLength ||
								stuckRocks[last - k - j * cycleLength] !== stuckRocks[sameFlow - k - j * cycleLength]
							) {
								allValid = false;
								break;
							}
						}
						if (allValid) {
							const skippedCycles = Math.floor((1000000000000 - fallenRocks - 1) / cycleLength) - 1;
							const skippedRocks = cycleLength * skippedCycles;
							console.log("found cycle of length", cycleLength, "at", fallenRocks);
							console.log(
								"skipping",
								skippedCycles * cycleLength,
								"rocks, from",
								fallenRocks,
								"to",
								fallenRocks + skippedRocks
							);
							fallenRocks += skippedRocks;
							skippedRockHeight = (highestRockX - rockHeights[sameFlow + 1]) * skippedCycles;
						}
					}
					stuckRocks.push(hashedBlock);
					rockHeights.push(highestRockX);
				}
				break;
			}
			moves.push(`d`);
			rock.move([-1, 0]);
		}
	}
	// console.log(stuckRocks);

	// * Find cycle
	/*map = map.map((row) => row.join("")).filter((l) => l !== ".......");
	for (let i = 0; i < map.length; i++) {
		console.log("checking cycle starting from line", i, "/", map.length);
		let nextSame = map.slice(i + 2).findIndex((l) => l === map[i]);
		if (nextSame) {
			nextSame = nextSame + i + 2;
			console.log("\tfound the same line on", i, nextSame, map[i], map[nextSame]);
			// Check the cycle multiple times
			let cycleLength = nextSame - i;
			let allValid = true;
			for (let j = 0; j < 10; j++) {
				let k = 0;
				for (; k < cycleLength; k++) {
					if (map[i + k + j * cycleLength] !== map[nextSame + k + j * cycleLength]) {
						console.log(
							"\tbreak pattern on cycle",
							k,
							"on line",
							i + k + j * cycleLength,
							nextSame + k + j * cycleLength
						);
						break;
					}
				}
				if (k !== cycleLength || map[i + k + j * cycleLength] !== map[nextSame + k + j * cycleLength]) {
					allValid = false;
					break;
				}
			}
			if (allValid) {
				for (let index = i; index < nextSame; index++) {
					console.log(`\t${map[index]}`);
				}
				console.log(`\t${map[nextSame]} < repeat`);
				console.log("\tfound cycle from", i, "to", nextSame, "!");
				break;
			}
		}
	}*/

	// * Debug
	/*const writerStream = createWriteStream("output.txt", { flags: "a" })
		.on("finish", function () {
			console.log("Write Finish.");
		})
		.on("error", function (err) {
			console.log(err.stack);
		});
	for (const row of map.reverse()) {
		writerStream.write(`|${row.join("")}|\n`);
	}
	writerStream.end();*/

	// * Answer
	console.log("Answer:", highestRockX + skippedRockHeight /* , "expect", 1514285714288 */);
})();
