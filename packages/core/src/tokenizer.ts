export type TokenType =
	| "L_PAREN"
	| "R_PAREN"
	| "DOT"
	| "PLUS"
	| "MINUS"
	| "STAR"
	| "SLASH"
	| "TRUE"
	| "FALSE"
	| "UNDEFINED"
	| "NULL"
	| "TEXT"
	| "STRING_LITERAL"
	| "NUMBER_LITERAL";

export type Token = {
	type: TokenType;
	value: string;
};

const characterRegex = /[a-zA-Z]/;
const numberRegex = /[0-9]/;
const whitespaceRegex = /\s/;

const isCharacter = (char: string) => characterRegex.test(char);
const isDigit = (char: string) => numberRegex.test(char);
const isAlphaNumeric = (char: string) => isCharacter(char) || isDigit(char);

const createToken = (type: TokenType, value: string) => ({ type, value });

export class Tokenizer {
	private src: string;
	private current: number = 0;
	private line: number = 1;
	private tokens: Token[] = [];

	constructor(src: string) {
		this.src = src;
	}

	public tokenize() {
		while (!this.isAtEnd()) {
			const currentChar = this.peek();

			if (currentChar === "\n") {
				this.line++;
				this.advance();
			} else if (whitespaceRegex.test(currentChar)) {
				this.advance();
			} else if (currentChar === "(") {
				this.tokens.push(createToken("L_PAREN", currentChar));
				this.advance();
			} else if (currentChar === ")") {
				this.tokens.push(createToken("R_PAREN", currentChar));
				this.advance();
			} else if (currentChar === ".") {
				this.tokens.push(createToken("DOT", currentChar));
				this.advance();
			} else if (currentChar === "+") {
				this.tokens.push(createToken("PLUS", currentChar));
				this.advance();
			} else if (currentChar === "-") {
				this.tokens.push(createToken("MINUS", currentChar));
				this.advance();
			} else if (currentChar === "*") {
				this.tokens.push(createToken("STAR", currentChar));
				this.advance();
			} else if (currentChar === "/" && this.peekNext() !== "/" && this.peekNext() !== "*") {
				this.tokens.push(createToken("SLASH", currentChar));
				this.advance();
			} else if (currentChar === '"') {
				let value = "";

				// move past the opening quote
				this.advance();

				while (this.peek() !== '"') {
					value += this.peek();
					this.advance();
				}

				if (currentChar !== '"') {
					throw new Error(`Unterminated string literal`);
				}

				// move past the closing quote
				this.advance();

				this.tokens.push(createToken("STRING_LITERAL", value));
			} else if (isCharacter(currentChar)) {
				let value = currentChar;

				// move past first char, we already have it
				this.advance();

				while (isAlphaNumeric(this.peek())) {
					value += this.peek();
					this.advance();
				}

				// we will check for reserved keywords here
				// if (value === "true") {
				// 	this.tokens.push(createToken("TRUE", value));
				// } else if (value === "false") {
				// 	this.tokens.push(createToken("FALSE", value));
				// } else if (value === "undefined") {
				// 	this.tokens.push(createToken("UNDEFINED", value));
				// } else if (value === "null") {
				// 	this.tokens.push(createToken("NULL", value));
				// } else {
				// identifier
				this.tokens.push(createToken("TEXT", value));
				// }
			} else if (isDigit(currentChar)) {
				let raw = currentChar;

				// we already have the first digit, move past
				this.advance();

				while (isDigit(this.peek())) {
					raw += this.peek();

					this.advance();
				}

				if (this.peek() === "." && isDigit(this.peekNext())) {
					raw += this.peek();

					// skip past the .
					this.advance();

					while (isDigit(this.peek())) {
						raw += this.peek();
						this.advance();
					}
				}

				this.tokens.push(createToken("NUMBER_LITERAL", raw));
			} else if (currentChar === "/" && this.peekNext() === "/") {
				// A comment goes until the end of the line.

				while (this.peek() !== "\n" && !this.isAtEnd()) {
					this.advance();
				}
			} else if (currentChar === "/" && this.peekNext() === "*") {
				// skip past the /
				this.advance();

				// skip past the *
				this.advance();

				// A block comment goes until the end of the block.

				while (this.peek() !== "*" && this.peekNext() !== "/") {
					if (this.peek() === "\n") {
						this.line++;
					}

					this.advance();
				}

				if (this.peek() !== "*" && this.peekNext() !== "/") {
					throw new Error(`Unterminated block comment`);
				}

				// move past the *
				this.advance();

				// move past the /
				this.advance();
			} else {
				throw new Error(`Unexpected token '${currentChar}'`);
			}
		}

		return this.tokens;
	}

	private peek() {
		return this.src[this.current] || "\0";
	}

	private peekNext() {
		return this.src[this.current + 1] || "\0";
	}

	private advance() {
		this.current++;

		return this.peek();
	}

	private isAtEnd() {
		return this.current >= this.src.length;
	}
}
