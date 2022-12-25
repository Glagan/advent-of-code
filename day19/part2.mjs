import { readFile } from "fs/promises";

(async () => {
	const file = (await readFile("input")).toString();
	const input = file.split("\n").slice(0, 3);

	// * Parse
	const blueprints = [];
	for (const line of input) {
		const [_, id, oreOreCost, clayOreCost, obsidianOreCost, obsidianClayCost, geodeOreCost, geodeObsidianCost] =
			line.match(
				/Blueprint (\d+): Each ore robot costs (\d+) ore. Each clay robot costs (\d+) ore. Each obsidian robot costs (\d+) ore and (\d+) clay. Each geode robot costs (\d+) ore and (\d+) obsidian./
			);
		blueprints.push({
			id: Number(id),
			oreOreCost: Number(oreOreCost),
			clayOreCost: Number(clayOreCost),
			obsidianOreCost: Number(obsidianOreCost),
			obsidianClayCost: Number(obsidianClayCost),
			geodeOreCost: Number(geodeOreCost),
			geodeObsidianCost: Number(geodeObsidianCost),
		});
	}
	console.log(blueprints);

	// * Utility
	const waitUntilEnd = (node) => {
		const remaining = 32 - node.minute;
		return {
			...node,
			minute: 32,
			ore: node.ore + node.oreRobots * remaining,
			clay: node.clay + node.clayRobots * remaining,
			obsidian: node.obsidian + node.obsidianRobots * remaining,
			geode: node.geode + node.geodeRobots * remaining,
		};
	};

	// * Process
	let answer = 1;
	for (const blueprint of blueprints) {
		console.log("blueprint", blueprint.id);
		let leafs = 0;
		let explored = 0;
		const mostExpensiveOre = Math.max(
			blueprint.oreOreCost,
			blueprint.clayOreCost,
			blueprint.obsidianOreCost,
			blueprint.geodeOreCost
		);
		let openSet = [
			{
				minute: 1,
				ore: 1,
				oreRobots: 1,
				clay: 0,
				clayRobots: 0,
				obsidian: 0,
				obsidianRobots: 0,
				geode: 0,
				geodeRobots: 0,
			},
		];
		let best = null;
		while (openSet.length > 0) {
			explored += 1;
			const node = openSet.splice(0, 1)[0];
			// * Leafs
			if (node.minute === 32) {
				leafs += 1;
				if (!best || node.geode >= best.geode) {
					best = node;
				}
				continue;
			}
			// * Create each robots
			let added = false;
			const timeRemaining = 32 - node.minute;
			// Geode
			if (node.obsidianRobots > 0) {
				const timeUntilNextGeode = Math.max(
					node.ore >= blueprint.geodeOreCost
						? 1
						: Math.ceil((blueprint.geodeOreCost - node.ore) / node.oreRobots) + 1,
					node.obsidian >= blueprint.geodeObsidianCost
						? 1
						: Math.ceil((blueprint.geodeObsidianCost - node.obsidian) / node.obsidianRobots) + 1
				);
				if (node.minute + timeUntilNextGeode < 32) {
					added = true;
					openSet.unshift({
						...node,
						minute: node.minute + timeUntilNextGeode,
						ore: node.ore + node.oreRobots * timeUntilNextGeode - blueprint.geodeOreCost,
						clay: node.clay + node.clayRobots * timeUntilNextGeode,
						obsidian:
							node.obsidian + node.obsidianRobots * timeUntilNextGeode - blueprint.geodeObsidianCost,
						geode: node.geode + node.geodeRobots * timeUntilNextGeode,
						geodeRobots: node.geodeRobots + 1,
					});
				}
			}
			// Obsidian
			if (
				node.clayRobots > 0 &&
				node.obsidianRobots < blueprint.geodeObsidianCost &&
				!(node.obsidian + node.obsidianRobots * timeRemaining >= timeRemaining * blueprint.geodeObsidianCost)
			) {
				const timeUntilNextObsidian = Math.max(
					node.ore >= blueprint.obsidianOreCost
						? 1
						: Math.ceil((blueprint.obsidianOreCost - node.ore) / node.oreRobots) + 1,
					node.clay >= blueprint.obsidianClayCost
						? 1
						: Math.ceil((blueprint.obsidianClayCost - node.clay) / node.clayRobots) + 1
				);
				if (node.minute + timeUntilNextObsidian < 32) {
					added = true;
					openSet.push({
						...node,
						minute: node.minute + timeUntilNextObsidian,
						ore: node.ore + node.oreRobots * timeUntilNextObsidian - blueprint.obsidianOreCost,
						clay: node.clay + node.clayRobots * timeUntilNextObsidian - blueprint.obsidianClayCost,
						obsidian: node.obsidian + node.obsidianRobots * timeUntilNextObsidian,
						geode: node.geode + node.geodeRobots * timeUntilNextObsidian,
						obsidianRobots: node.obsidianRobots + 1,
					});
				}
			}
			// Clay
			if (
				node.geodeRobots === 0 &&
				node.clayRobots < blueprint.obsidianClayCost &&
				!(node.clay + node.clayRobots * timeRemaining >= timeRemaining * blueprint.obsidianClayCost)
			) {
				const timeUntilNextClay =
					node.ore >= blueprint.clayOreCost
						? 1
						: Math.ceil((blueprint.clayOreCost - node.ore) / node.oreRobots) + 1;
				if (node.minute + timeUntilNextClay < 32) {
					added = true;
					openSet.push({
						...node,
						minute: node.minute + timeUntilNextClay,
						ore: node.ore + node.oreRobots * timeUntilNextClay - blueprint.clayOreCost,
						clay: node.clay + node.clayRobots * timeUntilNextClay,
						obsidian: node.obsidian + node.obsidianRobots * timeUntilNextClay,
						geode: node.geode + node.geodeRobots * timeUntilNextClay,
						clayRobots: node.clayRobots + 1,
					});
				}
			}
			// Ore
			if (
				node.geodeRobots === 0 &&
				node.oreRobots < mostExpensiveOre &&
				!(node.ore + node.oreRobots * timeRemaining >= timeRemaining * mostExpensiveOre)
			) {
				const timeUntilNextOre =
					node.ore >= blueprint.oreOreCost
						? 1
						: Math.ceil((blueprint.oreOreCost - node.ore) / node.oreRobots) + 1;
				if (node.minute + timeUntilNextOre < 32) {
					added = true;
					openSet.push({
						...node,
						minute: node.minute + timeUntilNextOre,
						ore: node.ore + node.oreRobots * timeUntilNextOre - blueprint.oreOreCost,
						clay: node.clay + node.clayRobots * timeUntilNextOre,
						obsidian: node.obsidian + node.obsidianRobots * timeUntilNextOre,
						geode: node.geode + node.geodeRobots * timeUntilNextOre,
						oreRobots: node.oreRobots + 1,
					});
				}
			}
			// * No actions
			if (!added && node.geodeRobots > 0) {
				openSet.unshift(waitUntilEnd(node));
			}
			if (openSet.length > 50000) {
				openSet = openSet.slice(0, 50000);
			}
		}
		if (best) {
			answer *= best.geode;
			console.log("got", best.geode, "in", leafs, "leafs and", explored, "nodes");
		} else {
			console.log("got", 0, "in", leafs, "leafs");
		}
	}

	// * Answer
	console.log("Answer:", answer, "expect", 56);
})();
