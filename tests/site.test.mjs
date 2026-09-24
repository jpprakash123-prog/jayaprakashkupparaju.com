import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";
import { resolve, dirname } from "node:path";

const html = readFileSync("index.html", "utf8");
const projects = readFileSync("projects/index.html", "utf8");
const caseStudy = readFileSync("projects/portfolio-sre.html", "utf8");
const pages = ["index.html", "career.html", "about.html", "projects/index.html", "projects/portfolio-sre.html"];

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

test("site discloses and loads privacy-safe browser monitoring", () => {
  assert.match(html, /Anonymous, sampled performance telemetry/);
  assert.match(html, /no names, form contents or persistent user identifiers/);
  assert.match(html, /src=["']rum-config\.js["']/);
  assert.match(html, /src=["']rum\.js["']/);
});

test("SRE website project showcases delivery and recovery skills", () => {
  assert.match(projects, /Production Website SRE Lab/);
  assert.match(projects, /Azure Static Web Apps/);
  assert.match(projects, /GitHub Actions/);
  assert.match(projects, /Cloudflare DNS/);
  assert.match(projects, /emergency rollback/i);
  assert.match(projects, /href=["']https:\/\/jayaprakashkupparaju\.com["']/);
  assert.match(projects, /href=["']\.\.\/deployment-info\.json["']/);
});

test("SRE project explains the production architecture", () => {
  assert.match(caseStudy, /How the website reaches a visitor/);
  assert.match(caseStudy, /feature branch/);
  assert.match(caseStudy, /DEV environment/);
  assert.match(caseStudy, /Application Insights/);
  assert.match(caseStudy, /Log Analytics/);
  assert.match(caseStudy, /automation cutoff/);
  assert.match(caseStudy, /\$10 annual budget/);
});

test("all page navigation and asset references resolve", () => {
  const generatedAssets = new Set(["rum-config.js", "rum.js", "deployment-info.json"].map((file) => resolve(file)));
  for (const file of pages) {
    const content = readFileSync(file, "utf8");
    assert.equal([...content.matchAll(/<h1\b/g)].length, 1, `${file}: one page heading`);
    assert.equal([...content.matchAll(/aria-current="page"/g)].length, 1, `${file}: active navigation`);
    for (const [, target] of content.matchAll(/(?:href|src)="([^"]+)"/g)) {
      if (/^https?:/.test(target)) continue;
      assert.ok(!target.startsWith("/"), `${file}: ${target} would break direct file viewing`);
      const [path, fragment] = target.split("#");
      let destination = path ? (path.startsWith("/") ? resolve(`.${path}`) : resolve(dirname(file), path)) : resolve(file);
      if (path.endsWith("/")) destination = resolve(destination, "index.html");
      if (generatedAssets.has(destination)) continue;
      assert.ok(existsSync(destination), `${file}: missing ${target}`);
      if (fragment) assert.ok(readFileSync(destination, "utf8").includes(`id="${fragment}"`), `${file}: missing ${target}`);
    }
  }
});

test("public professional profiles are linked securely", () => {
  assert.match(html, /href=["']https:\/\/github\.com\/jpprakash123-prog["']/);
  assert.match(
    html,
    /href=["']https:\/\/www\.linkedin\.com\/in\/jayaprakash-kupparaju-99108225\/["']/,
  );
  assert.match(html, /rel=["']noopener noreferrer["']/);
});
