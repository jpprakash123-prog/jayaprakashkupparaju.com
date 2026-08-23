import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

const html = readFileSync("index.html", "utf8");

test("site has its expected title", () => {
  assert.match(html, /<title>Jayaprakash Kupparaju[^<]*<\/title>/);
});

test("profile image reference resolves", () => {
  assert.match(html, /src=["']profile\.jpg["']/);
  assert.equal(existsSync("profile.jpg"), true);
});

test("internal navigation targets exist", () => {
  const targets = [...html.matchAll(/href=["']#([^"']+)["']/g)].map(
    ([, target]) => target,
  );

  for (const target of targets) {
    assert.match(html, new RegExp(`id=["']${target}["']`));
  }
});

test("automated deployment marker remains visible", () => {
  assert.match(html, /Deployed automatically with GitHub Actions\./);
});
