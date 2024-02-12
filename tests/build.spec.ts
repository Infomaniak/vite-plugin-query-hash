import { readFileSync } from "fs";
import { resolve } from "path";
import spawn from "cross-spawn";
import { beforeAll, describe, test, expect } from "vitest";

const example = resolve(__dirname, "../example");

describe("build", () => {
  beforeAll(() => buildApp(), 5000);

  test("ends with query hash", () => {
    const manifest = readManifest("manifest.json");
    const pattern = /.*\?v=\d+$/;
    expect(manifest["entrypoints/main.ts"].file).toMatch(pattern);

    expect(manifest["dynamic.ts"].file).toMatch(pattern);

    expect(manifest["entrypoints/styles.css"].file).toMatch(pattern);
  });
});

function readManifest(path: string) {
  return JSON.parse(readFileSync(`${example}/public/vite/.vite/${path}`, "utf-8"));
}

function buildApp() {
  spawn.sync("npm", ["run", "build"], {
    stdio: process.env.DEBUG ? "inherit" : undefined,
    cwd: example,
  });
}
