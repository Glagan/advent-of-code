import { readFile } from "fs/promises";

function floydWarshall(valves) {
	const valveKeys = Object.keys(valves);
	const dist = {};
	const next = {};
	for (const valveName of valveKeys) {
		dist[valveName] = {};
		next[valveName] = {};
		for (const otherValveName of valveKeys) {
			dist[valveName][otherValveName] = Infinity;
			next[valveName][otherValveName] = null;
		}
		const valve = valves[valveName];
		for (const valveExit of valve.exits) {
			dist[valveName][valveExit] = 1;
			next[valveName][valveExit] = valveExit;
		}
		dist[valveName][valveName] = 0;
		next[valveName][valveName] = valveName;
	}
	for (const k of valveKeys) {
		for (const i of valveKeys) {
			for (const j of valveKeys) {
				if (dist[i][j] > dist[i][k] + dist[k][j]) {
					dist[i][j] = dist[i][k] + dist[k][j];
					next[i][j] = next[i][k];
				}
			}
		}
	}
	return [dist, next];
}

(async () => {
	const file = (await readFile("input")).toString();
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
	const valveKeys = Object.keys(valves);
	const limit = valveKeys.length;
	console.log(valves);

	// * Pre-compute
	// Find the shortest paths from AA to all other valves which goes through all valves
	let [_, next] = floydWarshall(valves);
	const reconstructPath = (u, v) => {
		if (next[u][v] == null) {
			return [];
		}
		let path = [u];
		while (u != v) {
			u = next[u][v];
			path.push(u);
		}
		return path.slice(1); // Ignore the first path which is the current one
	};
	const paths = {};
	for (const valve of valveKeys) {
		paths[valve] = {};
		for (const otherValve of valveKeys) {
			if (valve != otherValve) {
				paths[valve][otherValve] = reconstructPath(valve, otherValve);
			}
		}
	}

	// * Utility
	let answer = null;
	const computeRemaining = (node) => {
		if (node.minute < 30) {
			return {
				...node,
				minute: 30,
				released: node.released + node.perMinute * (31 - node.minute),
			};
		}
		return node;
	};
	const assignAnswer = (node) => {
		if (!answer) {
			answer = node;
		} else if (answer.released < node.released) {
			answer = node;
		}
	};

	// * Process
	// For each branch in the current tree, calculate the final output and leaf for each neighbors up to 30 min and select the best one
	const root = {
		valve: "AA",
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
		const unopened = valveKeys.filter((k) => k != node.valve && !node.opened[k]);
		if (unopened.length === 0) {
			assignAnswer(computeRemaining(node));
			continue;
		}
		let usedPath = false;
		for (const otherValveName of unopened.sort((a, b) => valves[b].rate - valves[a].rate)) {
			const path = paths[node.valve][otherValveName];
			if (node.minute + path.length + 1 < 30) {
				usedPath = true;
				let childNode = {
					valve: otherValveName,
					opened: { ...node.opened, [otherValveName]: true },
					openSize: node.openSize + 1,
					minute: node.minute + path.length + 1,
					released: node.released + (path.length + 1) * node.perMinute,
					perMinute: node.perMinute + valves[otherValveName].rate,
					path: [...node.path, ...path.slice(0, -1), "_" + otherValveName],
				};
				if (childNode.openSize == limit || childNode.minute == 30) {
					assignAnswer(computeRemaining(childNode));
				} else {
					openSet.push(childNode);
				}
			}
		}
		if (!usedPath) {
			assignAnswer(computeRemaining(node));
		}
	}

	// * Answer
	console.log(
		"Answer:",
		answer /* , "expect", {
		path: [
			"_DD",
			"CC",
			"_BB",
			"AA",
			"II",
			"_JJ",
			"II",
			"AA",
			"DD",
			"EE",
			"FF",
			"GG",
			"_HH",
			"GG",
			"FF",
			"_EE",
			"DD",
			"_CC",
		],
	} */
	);
})();
