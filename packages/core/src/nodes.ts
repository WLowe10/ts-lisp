import type { IVisitor } from "./visitor";

export interface INode {
	accept(visitor: IVisitor): void;
}

export class Identifier implements INode {
	public name: string;

	constructor(opts: { name: string }) {
		this.name = opts.name;
	}

	accept(visitor: IVisitor) {
		return visitor.visitIdentifier(this);
	}
}

export class StringLiteral implements INode {
	public value: string;

	constructor(opts: { value: string }) {
		this.value = opts.value;
	}

	accept(visitor: IVisitor) {
		return visitor.visitStringLiteral(this);
	}
}

export class NumberLiteral implements INode {
	public raw: string;

	constructor(opts: { raw: string }) {
		this.raw = opts.raw;
	}

	accept(visitor: IVisitor) {
		return visitor.visitNumberLiteral(this);
	}
}

export class CallExpression implements INode {
	public callee: Identifier;
	public arguments: INode[];

	constructor(opts: { callee: Identifier; arguments: INode[] }) {
		this.callee = opts.callee;
		this.arguments = opts.arguments;
	}

	accept(visitor: IVisitor) {
		return visitor.visitCallExpression(this);
	}
}

export class Program implements INode {
	public body: INode[];

	constructor(opts: { body: INode[] }) {
		this.body = opts.body;
	}

	accept(visitor: IVisitor) {
		return visitor.visitProgram(this);
	}
}
