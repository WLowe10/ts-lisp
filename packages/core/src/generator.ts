import type {
	Program,
	Identifier,
	StringLiteral,
	CallExpression,
	NumberLiteral,
	INode,
} from "./nodes";
import type { IVisitor } from "./visitor";

export class Generator implements IVisitor {
	public generate(node: INode) {
		return node.accept(this) as unknown as string;
	}

	public visitProgram(node: Program) {
		return node.body.map((node) => node.accept(this)).join(";");
	}

	public visitCallExpression(callExpr: CallExpression) {
		const args = callExpr.arguments.map((arg) => arg.accept(this)) as unknown[] as string[];

		// addition
		if (callExpr.callee.name === "add") {
			return `(${args.join("+")})`;
		}

		// subtraction
		if (callExpr.callee.name === "sub") {
			return `(${args.join("-")})`;
		}

		// logical or (||)
		if (callExpr.callee.name === "or") {
			return `(${args.join("||")})`;
		}

		// logical and (&&)
		if (callExpr.callee.name === "and") {
			return `(${args.join("&&")})`;
		}

		// logical not (!)
		if (callExpr.callee.name === "not") {
			if (args.length !== 1) {
				throw new Error("not expects exactly one argument");
			}

			return `!(${args[0]})`;
		}

		// logical equal (==)
		if (callExpr.callee.name === "and") {
			return `(${args.join("&&")})`;
		}

		// array literal
		if (callExpr.callee.name === "array") {
			return `[${args.join(",")}]`;
		}

		// object literal
		if (callExpr.callee.name === "object") {
			if (args.length % 2 !== 0) {
				throw new Error("object expects an even number of arguments");
			}

			const entries: string[] = [];

			for (let i = 0; i < args.length; i += 2) {
				entries.push(`${args[i]}:${args[i + 1]}`);
			}

			return `{${entries.join(",")}}`;
		}

		// instantiation
		if (callExpr.callee.name === "new") {
			const identifier = args.shift();

			return `new ${identifier}(${args.join(",")})`;
		}

		// if statement
		if (callExpr.callee.name === "if") {
			if (args.length !== 2 && args.length !== 3) {
				throw new Error("if expects exactly two or three arguments");
			}

			const condition = args[0]!;
			const thenBlock = args[1]!;
			const elseBlock = args[2];

			let ifExpr;

			// if the condition is wrapped in parentheses, no need to wrap it in the if statement
			if (condition.startsWith("(")) {
				ifExpr = `if${condition}${thenBlock}`;
			} else {
				ifExpr = `if(${condition})${thenBlock}`;
			}

			if (thenBlock && elseBlock) {
				return `${ifExpr};else ${elseBlock}`;
			}

			return ifExpr;
		}

		// esm

		// import
		if (callExpr.callee.name === "import") {
			if (args.length !== 2) {
				throw new Error("def expects exactly two arguments");
			}

			return `import ${[args[0]]} from ${args[1]}`;
		}

		// export
		// todo: if export has two args, is may be an export *from*
		if (callExpr.callee.name === "export") {
			if (args.length !== 1) {
				throw new Error("export requires exactly one argument");
			}

			return `export ${[args[0]]}`;
		}

		// variable declaration
		if (callExpr.callee.name === "def") {
			if (args.length !== 2) {
				throw new Error("def expects exactly two arguments");
			}

			return `const ${[args[0]]} = ${args[1]}`;
		}

		// await
		if (callExpr.callee.name === "await") {
			if (args.length !== 1) {
				throw new Error("await expects exactly one argument");
			}

			return `await ${args[0]}`;
		}

		// access object property
		if (callExpr.callee.name === "getprop") {
			if (args.length !== 2) {
				throw new Error("len expects exactly two arguments");
			}

			const identifier = args.shift();

			return `${identifier}.${args[0]}`;
		}

		// array and string indexing
		if (callExpr.callee.name === "idx") {
			if (args.length !== 2) {
				throw new Error("idx expects exactly two arguments");
			}

			const identifier = args.shift();

			return `${identifier}[${args[0]}]`;
		}

		// array and string length
		if (callExpr.callee.name === "len") {
			if (args.length !== 1) {
				throw new Error("len expects exactly one argument");
			}

			return `${args[0]}.length`;
		}

		// throw
		if (callExpr.callee.name === "throw") {
			if (args.length !== 1) {
				throw new Error("throw expects exactly one argument");
			}

			return `throw ${args[0]}`;
		}

		// typeof
		if (callExpr.callee.name === "typeof") {
			if (args.length !== 1) {
				throw new Error("typeof expects exactly one argument");
			}

			return `typeof ${args[0]}`;
		}

		// console.log shorthand
		if (callExpr.callee.name === "print") {
			callExpr.callee.name = "console.log";
		}

		const callee = callExpr.callee.accept(this);

		return `${callee}(${args.join(",")})`;
	}

	public visitIdentifier(node: Identifier) {
		return node.name;
	}

	public visitStringLiteral(node: StringLiteral) {
		return '"' + node.value + '"';
	}

	public visitNumberLiteral(node: NumberLiteral) {
		return node.raw;
	}
}
