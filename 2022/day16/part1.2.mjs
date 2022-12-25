import { readFile } from "fs/promises";

function reconstructPath(next, u, v) {
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
	console.log(valves);

	// * Pre-compute
	// Find the shortest paths from AA to all other valves which goes through all valves
	let [_, next] = floydWarshall(valves);

	// * Process
	// Tests every possible paths that goes through all nodes that have a positive flow rate
	const generatePathWithMissings = (path, missingNodes) => {
		let paths = [];
		for (const missingNode of missingNodes) {
			const pathWithMissings = [...path, ...reconstructPath(next, path[path.length - 1], missingNode).slice(1)];
			if (path.length > 15) {
				paths.push(pathWithMissings);
				continue;
			}
			const missingNodes = Object.keys(valves).filter(
				(k) => valves[k].rate > 0 && pathWithMissings.indexOf(k) < 0
			);
			if (missingNodes.length > 0) {
				paths.push(...generatePathWithMissings(pathWithMissings, missingNodes));
			} else {
				paths.push(pathWithMissings);
			}
		}
		return paths;
	};
	let pathsToTest = [];
	for (const valveName of Object.keys(valves)) {
		const path = reconstructPath(next, "AA", valveName);
		const missingNodes = Object.keys(valves).filter((k) => valves[k].rate > 0 && path.indexOf(k) < 0);
		if (missingNodes.length > 0 && path.length < 15) {
			pathsToTest.push(...generatePathWithMissings(path, missingNodes));
		} else {
			pathsToTest.push(path);
		}
	}

	// * Process
	let answer = null;
	for (const path of pathsToTest) {
		const state = {
			opened: {},
			remaining: 30,
			released: 0,
			perMinute: 0,
			steps: [path],
		};
		for (const step of path) {
			state.steps.push(`Minute ${31 - state.remaining}`);
			state.steps.push(
				Object.keys(state.opened).length == 0
					? "No valves are open"
					: `Opened: ${Object.keys(state.opened).join(", ")} releasing ${state.perMinute} pressure`
			);
			state.steps.push(`You move to ${step}`);
			state.released += state.perMinute;
			state.remaining -= 1;
			if (valves[step].rate > 0 && !state.opened[step]) {
				state.steps.push(`Minute ${31 - state.remaining}`);
				state.steps.push(
					Object.keys(state.opened).length == 0
						? "No valves are open"
						: `Opened: ${Object.keys(state.opened).join(", ")} releasing ${state.perMinute} pressure`
				);
				state.steps.push(`You open valve ${step}`);
				state.opened[step] = true;
				state.released += state.perMinute;
				state.perMinute += valves[step].rate;
				state.remaining -= 1;
			}
		}
		for (let index = state.remaining; index > 0; index--) {
			state.steps.push(`Minute ${31 - index}`);
			state.steps.push(
				Object.keys(state.opened).length == 0
					? "No valves are open"
					: `Opened: ${Object.keys(state.opened).join(", ")} releasing ${state.perMinute} pressure`
			);
			state.released += state.perMinute;
			state.remaining -= 1;
		}
		if (!answer || state.released > answer.released) {
			answer = state;
		}
	}

	// * Answer
	console.log("Answer:", answer);
})();
