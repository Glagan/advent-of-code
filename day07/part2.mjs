import { readFile } from "fs/promises";

(async () => {
	const file = (await readFile("input")).toString();
	const input = file.split("\n");

	let fs = { files: {}, size: 0 };
	let cwd = fs;

	for (const line of input) {
		if (line.startsWith("$ cd")) {
			const [_, __, name] = line.split(" ");
			if (name == "/") {
				cwd = fs;
			} else if (name == "..") {
				if (cwd.parent) {
					cwd = cwd.parent;
				}
			} else {
				if (!cwd.files[name]) {
					cwd.files[name] = { files: {}, size: 0, parent: cwd };
				}
				cwd = cwd.files[name];
			}
		} else if (line.startsWith("$ ls")) {
			continue;
		} else {
			const [typeOrSize, name] = line.split(" ");
			if (typeOrSize === "dir") {
				if (!cwd.files[name]) {
					cwd.files[name] = { files: {}, size: 0, parent: cwd };
				}
			} else {
				const size = parseInt(typeOrSize);
				cwd.files[name] = size;
				cwd.size += size;
				let parent = cwd.parent;
				while (parent) {
					parent.size += size;
					parent = parent.parent;
				}
			}
		}
	}

	const requiredMinimum = fs.size - 40_000_000;
	console.log("size required", requiredMinimum, "used space", fs.size);
	let smallestFolder = fs.size;

	const findSmallest = (files) => {
		for (const file of files) {
			if (typeof file === "number") {
				continue;
			} else {
				if (file.size >= requiredMinimum && file.size < smallestFolder) {
					console.log("checking", file.size);
					smallestFolder = file.size;
				}
				findSmallest(Object.values(file.files));
			}
		}
	};
	findSmallest(Object.values(fs.files));

	console.log("Answer:", fs, smallestFolder);
})();
