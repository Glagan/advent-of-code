import { readFile } from "fs/promises";

(async () => {
	const file = (await readFile("input")).toString();
	const input = file.split("\n").map((line) => line.split(" "));

	let pixels = new Array(240).fill(".");
	let cycle = 1;
	let X = 1;
	for (const line of input) {
		if (line[0] === "noop") {
			// console.log("Start cycle", cycle, ": begin executing", line.join(" "));
			// console.log("During cycle", cycle, ": CRT draws pixel in position", cycle - 1);
			const pixel = (cycle - 1) % 40;
			if (pixel >= X - 1 && pixel <= X + 1) {
				pixels[cycle - 1] = "#";
			}
			cycle += 1;
		} else {
			const value = parseInt(line[1]);
			// console.log("Start cycle", cycle, ": begin executing", line.join(" "));
			// console.log("During cycle", cycle, ": CRT draws pixel in position", cycle - 1);
			let pixel = (cycle - 1) % 40;
			if (pixel >= X - 1 && pixel <= X + 1) {
				pixels[cycle - 1] = "#";
			}
			cycle += 1;
			// console.log("Start cycle", cycle, ": begin executing", line.join(" "));
			// console.log("During cycle", cycle, ": CRT draws pixel in position", cycle - 1);
			pixel = (cycle - 1) % 40;
			if (pixel >= X - 1 && pixel <= X + 1) {
				pixels[cycle - 1] = "#";
			}
			X += value;
			cycle += 1;
		}
	}

	console.log(pixels.slice(0, 40).join(""));
	console.log(pixels.slice(40, 80).join(""));
	console.log(pixels.slice(80, 120).join(""));
	console.log(pixels.slice(120, 160).join(""));
	console.log(pixels.slice(160, 200).join(""));
	console.log(pixels.slice(200, 240).join(""));
})();
