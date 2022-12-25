import { readFile } from "fs/promises";

(async () => {
	const file = (await readFile("input")).toString();
	const bufferSize = 14;
	const input = file.split("\n")[0];
	// const input = "mjqjpqmgbljsphdztnvjfqwrcgsmlb"; // 19
	// const input = "bvwbjplbgvbhsrlpgdmjqwftvncz"; // 23
	// const input = "nppdvjthqldpwncqszvftbrmjlhg"; // 23
	// const input = "nznrnfrfntjfmvfwmzdfjlvtqnbhcprsg"; // 29
	// const input = "zcfzfwzzqfrljwzlrfnpqdbhtmscgvjw"; // 26

	let offset = 0;
	while (offset < input.length - bufferSize) {
		let slice = input.slice(offset, offset + bufferSize);
		// console.log("checking", slice, new Set(Array.from(slice)));
		if (new Set(Array.from(slice)).size === bufferSize) {
			offset += bufferSize;
			break;
		}
		offset += 1;
	}

	console.log("Answer:", offset);
})();
