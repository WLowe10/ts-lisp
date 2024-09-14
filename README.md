# ts-lisp

## Getting Started

### Install

```sh
# install the ts-lisp-cli globally
pnpm install -g @ts-lisp/cli
```

### Commands

#### `ts-lisp`

A command to compile and run ts-lisp generated JS in one step.

```sh
ts-lisp ./main.lisp

# Running 'ts-lisp' without passing a file starts the repl
ts-lisp
```

#### `ts-lispc`

A command to compile lisp files

```sh
ts-lispc ./main.lisp ./file-two.lisp ...
```
