# CSS Shorthand Expand - Build Commands
set shell := ["bash", "-cu"]

# Default task
default: check test

# ------------- Build & Test -------------
build:
    pnpm run build

test:
    pnpm test

test-watch:
    pnpm run test:watch

# ------------- Quality Gates -------------
typecheck:
    pnpm run type-check

lint:
    biome check .

format:
    biome format --write .

fix:
    biome check --write .

check: format fix typecheck

# ------------- Development -------------
dev: build test

clean:
    rm -rf lib node_modules pnpm-lock.yaml

# ------------- Setup -------------
bootstrap:
    pnpm install

install:
    pnpm install

