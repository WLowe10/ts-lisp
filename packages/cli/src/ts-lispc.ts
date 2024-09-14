import fs from "node:fs/promises";
import path from "node:path";
import { parseArgs } from "node:util";
import { compile } from "@ts-lisp/core";

const args = parseArgs({
	allowPositionals: true,
});

const srcFiles = args.positionals;

for (const srcFile of srcFiles) {
	const srcPath = path.join(process.cwd(), srcFile);
	const fileName = path.parse(srcFile).name;
	const outPath = path.join(process.cwd(), fileName + ".js");

	const src = await fs.readFile(srcPath, "utf8");
	const js = compile(src);

	await fs.writeFile(outPath, js);
}
