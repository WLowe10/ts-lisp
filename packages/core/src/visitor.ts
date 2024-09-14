import type { CallExpression, Identifier, NumberLiteral, Program, StringLiteral } from "./nodes";

export interface IVisitor {
	visitProgram(node: Program): any;
	visitCallExpression(node: CallExpression): any;
	visitIdentifier(node: Identifier): any;
	visitStringLiteral(node: StringLiteral): any;
	visitNumberLiteral(node: NumberLiteral): any;
}
