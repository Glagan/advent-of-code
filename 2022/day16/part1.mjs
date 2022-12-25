import { readFile } from "fs/promises";

(async () => {
	const file = (await readFile("input2")).toString();
	const input = file.split("\n");

	// * Parse
	const valves = {};
	const opened = {};
	for (const line of input) {
		const [_, name, rate, rawExits] = line.match(
			/Valve (\w+) has flow rate=(\d+); tunnels? leads? to valves? (.+)/
		);
		valves[name] = { name, rate: Number(rate), exits: rawExits.split(", ") };
		if (valves[name].rate == 0) {
			opened[name] = true;
		}
	}
	const limit = Object.keys(valves).length;
	console.log(valves);

	// * Pre-compute
	// Find the shortest paths from AA to all other valves which goes through all valves
	/*let paths = {};
	for (const otherValve of Object.keys(valves)) {
		if (otherValve != "AA") {
			let path = a_star(valves, "AA", otherValve);
			path.reverse();
			paths[otherValve] = path;
		}
	}
	console.log("paths", paths);*/

	// * Utility
	let answer = null;
	const computeRemaining = (node) => ({
		...node,
		remaining: 0,
		released: node.released + node.perMinute * node.remaining,
	});
	const assignAnswer = (node) => {
		if (!answer) {
			console.log("new answer", node);
			answer = node;
		} else if (answer.released < node.released) {
			console.log("new answer", node);
			answer = node;
		}
	};

	// * Process
	// For each branch in the current tree, calculate the final output and leaf for each neighbors up to 30 min and select the best one
	const root = {
		valve: valves.AA,
		opened,
		openSize: opened.length,
		parent: null,
		remaining: 30,
		released: 0,
		perMinute: 0,
	};
	const openSet = [root];
	while (openSet.length > 0) {
		const node = openSet.splice(0, 1)[0];
		if (node.openSize == limit) {
			assignAnswer(computeRemaining(node));
			continue;
		}
		if (node.remaining >= 1) {
			if (!node.opened[node.valve.name] && node.valve.rate > 0) {
				const childNode = {
					valve: node.valve,
					opened: { ...node.opened, [node.valve.name]: true },
					openSize: node.openSize + 1,
					parent: node,
					remaining: node.remaining - 1,
					released: node.released + node.perMinute,
					perMinute: node.perMinute + node.valve.rate,
				};
				if (node.openSize === limit) {
					assignAnswer(computeRemaining(node));
				} else {
					openSet.unshift(childNode);
				}
			}
			for (const valveExit of node.valve.exits) {
				if (!node.opened[valveExit]) {
					if (node.remaining <= 1) {
						continue;
					}
					const childNode = {
						valve: valves[valveExit],
						opened: { ...node.opened, [node.valve.name]: true },
						openSize: node.openSize + 1,
						parent: node,
						remaining: node.remaining - 2,
						released: node.released + node.perMinute * 2,
						perMinute: node.perMinute + node.valve.rate,
					};
					if (node.openSize === limit) {
						assignAnswer(computeRemaining(node));
					} else {
						openSet.unshift(childNode);
					}
				} else {
					const childNode = {
						valve: valves[valveExit],
						opened: { ...node.opened },
						openSize: node.openSize,
						parent: node,
						remaining: node.remaining - 1,
						released: node.released + node.perMinute,
						perMinute: node.perMinute,
					};
					openSet.unshift(childNode);
				}
			}
		} else if (!answer) {
			answer = node;
		} else if (answer.released < node.released) {
			answer = node;
		}
	}
	console.log(answer);

	// * Answer
	console.log("Answer:", answer);
})();
