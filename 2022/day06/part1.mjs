import { readFile } from "fs/promises";

(async () => {
	const file = (await readFile("input")).toString();
	const input = file.split("\n")[0];
	// const input = "bvwbjplbgvbhsrlpgdmjqwftvncz";
	// const input = "nppdvjthqldpwncqszvftbrmjlhg";
	// const input = "nznrnfrfntjfmvfwmzdfjlvtqnbhcprsg";
	// const input = "zcfzfwzzqfrljwzlrfnpqdbhtmscgvjw";

	let offset = 0;
	while (offset < input.length - 4) {
		let slice = input.slice(offset, offset + 4);
		// console.log("checking", slice, new Set(Array.from(slice)));
		if (new Set(Array.from(slice)).size === 4) {
			offset += 4;
			break;
		}
		offset += 1;
	}

	console.log("Answer:", offset);
})();
