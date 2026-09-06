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

test("SRE website project showcases delivery and recovery skills", () => {
  assert.match(html, /Production Website SRE Lab/);
  assert.match(html, /Azure Static Web Apps/);
  assert.match(html, /GitHub Actions/);
  assert.match(html, /Cloudflare DNS/);
  assert.match(html, /emergency rollback/i);
  assert.match(html, /href=["']\/deployment-info\.json["']/);
});
