import { defineConfig } from "tsup";

export default defineConfig({
	outDir: "dist",
	entry: ["src/ts-lisp.ts", "src/ts-lispc.ts"],
	format: ["esm"],
	clean: true,
});
