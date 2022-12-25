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

	// * Utility
	let answer = null;
	const computeRemaining = (node) => {
		if (node.minute < 30) {
			return {
				...node,
				minute: 30,
				released: node.released + node.perMinute * (30 - node.minute),
			};
		}
		return node;
	};
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
		openSize: Object.keys(opened).length,
		minute: 1,
		released: 0,
		perMinute: 0,
		path: [],
	};
	const openSet = [root];
	while (openSet.length > 0) {
		const node = openSet.splice(0, 1)[0];
		for (const valveExit of node.valve.exits) {
			// Not opened
			const childNode = {
				valve: valves[valveExit],
				opened: { ...node.opened },
				openSize: node.openSize,
				minute: node.minute + 1,
				released: node.released + node.perMinute,
				perMinute: node.perMinute,
				path: [...node.path, valveExit],
			};
			if (childNode.openSize === limit || childNode.minute === 30) {
				assignAnswer(computeRemaining(childNode));
			} else {
				openSet.push(childNode);
			}
			// Opened
			if (!node.opened[valveExit] && node.minute + 1 < 30) {
				const childNode = {
					valve: valves[valveExit],
					opened: { ...node.opened, [valveExit]: true },
					openSize: node.openSize + 1,
					minute: node.minute + 2,
					released: node.released + node.perMinute * 2,
					perMinute: node.perMinute + node.valve.rate,
					path: [...node.path, valveExit],
				};
				if (childNode.openSize === limit || childNode.minute === 30) {
					assignAnswer(computeRemaining(childNode));
				} else {
					openSet.push(childNode);
				}
			}
		}
	}
	console.log(answer);

	// * Answer
	console.log("Answer:", answer);
})();
