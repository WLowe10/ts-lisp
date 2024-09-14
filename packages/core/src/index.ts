import { Tokenizer } from "./tokenizer";
import { Parser } from "./parser";
import { Generator } from "./generator";

export function compile(src: string): string {
	const tokens = new Tokenizer(src).tokenize();
	const program = new Parser(tokens).parse();

	return new Generator().generate(program);
}

export * from "./nodes";
export * from "./tokenizer";
export * from "./parser";
export * from "./generator";
