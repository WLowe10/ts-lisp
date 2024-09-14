import {
	Program,
	CallExpression,
	StringLiteral,
	NumberLiteral,
	Identifier,
	type INode,
} from "./nodes";
import type { Token, TokenType } from "./tokenizer";

export class Parser {
	private current = 0;
	private tokens: Token[];

	constructor(tokens: Token[]) {
		this.tokens = tokens;
	}

	public parse() {
		const callExpressions = [];

		while (!this.isAtEnd()) {
			callExpressions.push(this.parseExpression());
		}

		return new Program({ body: callExpressions });
	}

	private parseStringLiteral() {
		const token = this.consume("STRING_LITERAL", "Expected string literal");

		return new StringLiteral({ value: token.value });
	}

	private parseNumberLiteral() {
		const token = this.consume("NUMBER_LITERAL", "Expected string literal");

		return new NumberLiteral({ raw: token.value });
	}

	private parseIdentifier(): Identifier {
		const token = this.consume("TEXT", "Expected text");

		let name = token.value;

		// we could have member expressions, but for now we will just combine TEXT separted by DOTs into one indentifier
		while (
			!this.isAtEnd() &&
			this.peek()!.type === "DOT" &&
			this.peekNext() &&
			this.peekNext()!.type === "TEXT"
		) {
			this.advance();

			name += "." + this.peek()!.value;

			this.advance();
		}

		return new Identifier({ name });
	}

	private parseCallExpression() {
		this.consume("L_PAREN", "Expected '('");

		const callee = this.parseIdentifier();

		const args = [];

		while (!this.check("R_PAREN")) {
			args.push(this.parseExpression());
		}

		this.consume("R_PAREN", "Expected ')'");

		return new CallExpression({ callee, arguments: args });
	}

	private parseExpression(): INode {
		if (this.check("L_PAREN")) {
			return this.parseCallExpression();
		}

		if (this.check("STRING_LITERAL")) {
			return this.parseStringLiteral();
		}

		if (this.check("NUMBER_LITERAL")) {
			return this.parseNumberLiteral();
		}

		if (this.check("TEXT")) {
			return this.parseIdentifier();
		}

		throw new Error("Expected expression");
	}

	// helpers

	private peek() {
		return this.tokens[this.current];
	}

	private peekNext() {
		return this.tokens[this.current + 1];
	}

	private advance() {
		this.current++;

		return this.peek();
	}

	private isAtEnd() {
		return this.current >= this.tokens.length;
	}

	private check(type: TokenType) {
		if (this.isAtEnd()) {
			return false;
		}

		return this.peek()!.type === type;
	}

	private consume(type: TokenType, message: string) {
		if (this.check(type)) {
			const token = this.peek();

			this.advance();

			// token will always be defined
			return token as unknown as Token;
		}

		throw new Error(message);
	}
}
