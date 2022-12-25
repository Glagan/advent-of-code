import { readFile } from "fs/promises";

function path(next, u, v) {
	if (next[u][v] == null) {
		return [];
	}
	let path = [u];
	while (u != v) {
		u = next[u][v];
		path.push(u);
	}
	return path;
}

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
	const file = (await readFile("input2")).toString();
	const input = file.split("\n");

	// * Parse
	const valves = {};
	const opened = {};
	for (const line of input) {
		console.log(line);
		const [_, name, rate, rawExits] = line.match(
			/Valve (\w+) has flow rate=(\d+); tunnels? leads? to valves? (.+)/
		);
		valves[name] = { rate: Number(rate), exits: rawExits.split(", ") };
		if (valves[name].rate == 0) {
			opened[name] = true;
		}
	}

	// * Pre-compute
	// Find the shortest paths from AA to all other valves which goes through all valves
	const dists = floydWarshall(valves);
	console.log(dists);
	/* let paths = {};
	for (const otherValve of Object.keys(valves)) {
		if (otherValve != "AA") {
			let path = bfs(valves, "AA", otherValve);
			paths[otherValve] = path.reverse();
		}
	}
	console.log("paths", paths); */

	// * Process
	// Compute each paths and find the best one
	/* for (const path of paths) {
		// TODO
	} */

	// * Answer
	console.log("Answer:", 0);
})();
