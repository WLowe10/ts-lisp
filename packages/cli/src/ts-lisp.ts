#!/usr/bin/env node

import readline from "node:readline/promises";
import fs from "node:fs/promises";
import path from "node:path";
import { parseArgs } from "node:util";
import { compile, Parser, Tokenizer } from "@ts-lisp/core";
import { execa } from "execa";

const args = parseArgs({
	options: {
		tokenize: { type: "boolean" },
		parse: { type: "boolean" },
	},
	allowPositionals: true,
});

const values = args.values;
const positionals = args.positionals;
const filePath = positionals[0];

async function run(src: string) {
	const js = compile(src);

	return await execa("node", ["-e", js], {
		stdout: "inherit",
	});
}

if (filePath) {
	const srcPath = path.join(process.cwd(), filePath);
	const src = await fs.readFile(srcPath, "utf8");

	if (values.tokenize) {
		console.log(new Tokenizer(src).tokenize());
	} else if (values.parse) {
		const tokens = new Tokenizer(src).tokenize();
		console.log(new Parser(tokens).parse());
	} else {
		await run(src);
	}
} else {
	// if not running ts-lisp on a file, start the repl

	const rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout,
	});

	console.log("Welcome to ts-lisp");

	while (true) {
		const src = await rl.question("ts-lisp > ");

		if (values.tokenize) {
			console.log(new Tokenizer(src).tokenize());
		} else if (values.parse) {
			const tokens = new Tokenizer(src).tokenize();
			console.log(new Parser(tokens).parse());
		} else {
			await run(src);
		}
	}
}
