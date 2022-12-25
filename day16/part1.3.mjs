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
	console.log(valves, opened);

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
		if (node.minute < 30) {
			const unopened = valveKeys.filter((k) => k != node.valve.name && !node.opened[k]);
			if (unopened.length === 0) {
				assignAnswer(computeRemaining(node));
				continue;
			}
			for (const otherValveName of unopened.sort((a, b) => valves[b].rate - valves[a].rate)) {
				let tmpNode = {
					...node,
					opened: { ...node.opened },
					path: [...node.path],
				};
				const path = reconstructPath(tmpNode.valve.name, otherValveName);
				for (const step of path) {
					tmpNode.path.push(step);
					tmpNode.valve = valves[step];
					tmpNode.minute += 1;
					tmpNode.released += tmpNode.perMinute;
					if (tmpNode.openSize == limit || tmpNode.minute == 30) {
						assignAnswer(computeRemaining(tmpNode));
						break;
					}
					if (!tmpNode.opened[step]) {
						tmpNode.opened[step] = true;
						tmpNode.openSize += 1;
						tmpNode.minute += 1;
						tmpNode.released += tmpNode.perMinute;
						tmpNode.perMinute += valves[step].rate;
					}
					if (tmpNode.openSize == limit || tmpNode.minute == 30) {
						assignAnswer(computeRemaining(tmpNode));
					} else {
						openSet.push({
							...tmpNode,
							opened: { ...tmpNode.opened },
							path: [...tmpNode.path],
						});
						openSet.sort((a, b) => b.released - a.released);
					}
				}
			}
		} else {
			assignAnswer(computeRemaining(node));
		}
	}

	// * Answer
	console.log("Answer:", answer);
})();
