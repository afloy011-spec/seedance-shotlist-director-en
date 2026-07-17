#!/usr/bin/env node
// Validates a generated shotlist.html against the blocking criteria of
// tests/golden-scenarios.md (the mechanically checkable half).
// Zero dependencies. Usage:  node scripts/validate.mjs path/to/shotlist.html
// Exit code: 0 = all blocking checks pass (warnings allowed), 1 = at least one FAIL.

import { readFileSync } from 'node:fs';

const file = process.argv[2];
if (!file) {
  console.error('Usage: node scripts/validate.mjs <shotlist.html>');
  process.exit(2);
}
const html = readFileSync(file, 'utf8');

const results = [];
const fail = (id, msg) => results.push({ level: 'FAIL', id, msg });
const warn = (id, msg) => results.push({ level: 'WARN', id, msg });
const pass = (id, msg) => results.push({ level: 'PASS', id, msg });
const check = (id, ok, okMsg, failMsg) => (ok ? pass(id, okMsg) : fail(id, failMsg));

const decode = s => s
  .replace(/&lt;/g, '<').replace(/&gt;/g, '>')
  .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, '&');

// ---------- document basics ----------
check('DOC-1', /<!DOCTYPE html>/i.test(html), 'doctype present', 'missing <!DOCTYPE html>');
check('DOC-2', /<meta name="viewport"/.test(html), 'viewport meta present', 'missing <meta name="viewport">');
const langMatch = html.match(/<html lang="([^"]+)"/);
check('DOC-3', !!langMatch, `<html lang="${langMatch?.[1]}">`, 'missing <html lang="...">');
const userLang = langMatch ? langMatch[1].toLowerCase() : 'en';

const leftovers = html.match(/{{[A-Z_]+}}/g);
check('DOC-4', !leftovers, 'no unfilled placeholders',
  `unfilled template placeholders: ${[...new Set(leftovers || [])].join(', ')}`);

// self-contained: no external resources
const external = html.match(/<link[^>]+rel="stylesheet"|<script[^>]+src=|src="https?:\/\/|url\(https?:\/\/|@import/);
check('DOC-5', !external, 'self-contained (no external resources)',
  `external resource reference found: ${external?.[0]}`);

// no emoji anywhere on the board (colored text badges only)
const emoji = html.match(/[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{2B00}-\u{2BFF}\u{FE0F}]/u);
check('DOC-6', !emoji, 'no emoji on the board', `emoji found: ${emoji?.[0]}`);

// ---------- slug / namespacing (B6) ----------
const slugMatch = html.match(/data-slug="([^"]*)"/);
check('B6-1', !!slugMatch && slugMatch[1].length > 0, `data-slug="${slugMatch?.[1]}"`, 'missing or empty data-slug on .container');
const slug = slugMatch?.[1] ?? '';
check('B6-2', /const K = s => 'sd-' \+ SLUG \+ '-' \+ s;/.test(html),
  'localStorage keys namespaced via K()', 'template JS namespacing helper (const K = ...) missing or altered');

// ---------- project bible (B6) ----------
const bibleMatch = html.match(/<script type="application\/json" id="project-bible">\s*([\s\S]*?)\s*<\/script>/);
let bible = null;
if (!bibleMatch) {
  fail('B6-3', 'missing <script type="application/json" id="project-bible">');
} else {
  try {
    bible = JSON.parse(bibleMatch[1]);
    pass('B6-3', 'Project Bible JSON parses');
  } catch (e) {
    fail('B6-3', `Project Bible JSON does not parse: ${e.message}`);
  }
}
if (bible) {
  for (const key of ['title', 'slug', 'language', 'styleCore', 'characters', 'assets', 'scenes']) {
    check(`B6-4:${key}`, key in bible, `bible has "${key}"`, `bible missing required key "${key}"`);
  }
  if (bible.slug !== undefined)
    check('B6-5', bible.slug === slug, 'bible slug matches data-slug', `bible slug "${bible.slug}" != data-slug "${slug}"`);
}

// ---------- scenes and checkboxes (B7) ----------
const sceneDivs = html.match(/<div class="scene">/g) || [];
const checkboxScenes = [...html.matchAll(/<input type="checkbox" data-scene="([^"]+)"/g)].map(m => m[1]);
check('B7-1', sceneDivs.length > 0, `${sceneDivs.length} scene(s)`, 'no <div class="scene"> blocks found');
check('B7-2', checkboxScenes.length === sceneDivs.length,
  'one checkbox per scene',
  `${sceneDivs.length} scenes but ${checkboxScenes.length} scene checkboxes`);
check('B7-3', new Set(checkboxScenes).size === checkboxScenes.length,
  'scene numbers unique', `duplicate data-scene values: ${checkboxScenes.join(', ')}`);

// ---------- prompts ----------
const promptRe = /<pre class="prompt"([^>]*)>([\s\S]*?)<\/pre>/g;
const prompts = [...html.matchAll(promptRe)].map(m => {
  const attrs = m[1];
  const id = attrs.match(/data-prompt-id="([^"]+)"/)?.[1] ?? null;
  return { id, attrs, raw: m[2], text: decode(m[2]) };
});
check('P-1', prompts.length > 0, `${prompts.length} prompt(s)`, 'no <pre class="prompt"> blocks found');
check('P-2', prompts.every(p => p.id), 'every prompt has data-prompt-id',
  'prompt(s) missing data-prompt-id');
check('P-3', new Set(prompts.map(p => p.id)).size === prompts.length,
  'prompt ids unique', 'duplicate prompt ids');
check('P-4', prompts.every(p => /lang="en"/.test(p.attrs)),
  'every prompt carries lang="en"', 'prompt(s) missing lang="en"');

// escaping: decoded-vs-raw — raw '<' inside pre means unescaped markup (B5/B6 hygiene)
const unescaped = prompts.filter(p => /</.test(p.raw));
check('P-5', unescaped.length === 0, 'prompt text properly HTML-escaped',
  `raw "<" inside prompt(s): ${unescaped.map(p => p.id).join(', ')}`);

// per-prompt structure (B5, B2, B1, B4)
const sections = [
  ['B5:style', /(^|\n)Style:/, 'Style CORE'],
  ['B5:lighting', /(^|\n)Lighting:/, 'Lighting line'],
  ['B5:characters', /(^|\n)Characters:/, 'Characters block'],
  ['B5:scene', /(^|\n)Scene:/, 'Scene block'],
  ['B5:cut1', /(^|\n)CUT 1/, 'CUT 1'],
  ['B2:endson', /(^|\n)ENDS ON:/, 'ENDS ON line'],
  ['B2:sfx', /(^|\n)SFX:/, 'SFX line'],
];
for (const [id, re, name] of sections) {
  const missing = prompts.filter(p => !re.test(p.text)).map(p => p.id);
  check(id, missing.length === 0, `every prompt has ${name}`,
    `${name} missing in prompt(s): ${missing.join(', ')}`);
}
const cyrillic = prompts.filter(p => /[Ѐ-ӿ]/.test(p.text)).map(p => p.id);
check('B4-1', cyrillic.length === 0, 'prompts are English (no Cyrillic)',
  `Cyrillic inside English prompt(s): ${cyrillic.join(', ')}`);
const noRefs = prompts.filter(p => !/@[a-z][a-z0-9_]*/i.test(p.text)).map(p => p.id);
check('B1-1', noRefs.length === 0, 'every prompt references @assets',
  `no @asset reference in prompt(s): ${noRefs.join(', ')}`);

// optics: FOV in degrees, not lens millimeters (cinematography.md) — asset prompts are exempt
const mmLens = prompts.filter(p => /\b\d{2,3}\s?mm\b/.test(p.text)).map(p => p.id);
if (mmLens.length) warn('C-1', `lens millimeters in prompt(s) ${mmLens.join(', ')} — state FOV in degrees (see references/cinematography.md)`);
else pass('C-1', 'no lens-mm values in video prompts (FOV degrees)');

// lighting reuse across different scenes (B3 — mechanical half; semantic review stays manual)
const sceneOf = id => (id?.match(/^([0-9]+(?:\.[0-9]+)?)/)?.[1]) ?? id;
const lightingByScene = new Map();
for (const p of prompts) {
  const line = p.text.match(/(^|\n)(Lighting:[^\n]*)/)?.[2]?.trim();
  if (line) {
    const s = sceneOf(p.id);
    if (!lightingByScene.has(s)) lightingByScene.set(s, line);
  }
}
const seen = new Map();
const dupes = [];
for (const [s, line] of lightingByScene) {
  if (seen.has(line)) dupes.push(`${seen.get(line)} & ${s}`);
  else seen.set(line, s);
}
if (dupes.length) warn('B3-1', `identical Lighting line shared by different scenes (${dupes.join('; ')}) — legitimate only if same location/time-of-day`);
else pass('B3-1', 'per-scene lighting lines are distinct');

// ---------- per-prompt production controls (B7) ----------
const fieldIds = field => new Set(
  [...html.matchAll(new RegExp(
    `data-prompt-field="${field}"[^>]*data-prompt-id="([^"]+)"|data-prompt-id="([^"]+)"[^>]*data-prompt-field="${field}"`, 'g'
  ))].map(m => m[1] || m[2])
);
for (const field of ['status', 'keeper', 'notes']) {
  const ids = fieldIds(field);
  const missing = prompts.filter(p => !ids.has(p.id)).map(p => p.id);
  check(`B7-4:${field}`, missing.length === 0, `every prompt has a ${field} control`,
    `${field} control missing for prompt(s): ${missing.join(', ')}`);
}
const badges = html.match(/class="badge risk-(low|mid|high)"/g) || [];
check('S2-1', badges.length >= prompts.length,
  'every prompt has a risk badge', `${prompts.length} prompts but ${badges.length} risk badges`);

// runtime summary (S3 — presence only; arithmetic stays a manual check)
const runtime = html.match(/<div class="runtime">([\s\S]*?)<\/div>/);
check('S3-1', !!runtime && runtime[1].trim().length > 0 && !/{{/.test(runtime[1]),
  'runtime summary present', 'runtime summary missing or empty');

// ---------- asset generation prompts (Asset Checklist) ----------
const assetItems = html.match(/<div class="asset-item">/g) || [];
const assetPrompts = [...html.matchAll(/<pre class="asset-prompt"([^>]*)>([\s\S]*?)<\/pre>/g)].map(m => ({
  id: m[1].match(/data-asset-id="([^"]+)"/)?.[1] ?? null,
  text: decode(m[2]),
}));
if (assetItems.length > 0 || assetPrompts.length > 0) {
  // Variant tabs let one asset-item hold several prompts (character sheet vs AI Cast card)
  check('A-1', assetItems.length > 0 && assetPrompts.length >= assetItems.length,
    `${assetPrompts.length} asset generation prompt(s) in ${assetItems.length} asset item(s)`,
    `${assetItems.length} asset items but only ${assetPrompts.length} asset-prompt blocks`);
  const variants = html.match(/<div class="asset-variant"/g) || [];
  const variantTabs = html.match(/class="variant-tab[ "]/g) || [];
  check('A-6', variants.length === variantTabs.length,
    variants.length ? `${variants.length} variant panel(s) with matching tabs` : 'no variant tabs (fine)',
    `${variants.length} .asset-variant panels but ${variantTabs.length} variant tabs`);
  check('A-2', assetPrompts.every(a => a.text.trim().length > 0 && !/{{/.test(a.text)),
    'asset prompts are filled', 'empty or unfilled asset prompt(s)');
  check('A-3', assetPrompts.every(a => !/[Ѐ-ӿ]/.test(a.text)),
    'asset prompts are English (no Cyrillic)', 'Cyrillic inside asset generation prompt(s)');
  if (bible) {
    const entries = [...(Array.isArray(bible.characters) ? bible.characters : []),
                     ...(Array.isArray(bible.assets) ? bible.assets : [])];
    const missing = entries.filter(a => !a.genPrompt).map(a => a.ref || '?');
    if (missing.length) warn('A-4', `bible characters/assets without genPrompt: ${missing.join(', ')}`);
    else pass('A-4', 'every bible character/asset carries its genPrompt');
  }
  check('A-5', assetPrompts.every(a => a.id) && new Set(assetPrompts.map(a => a.id)).size === assetPrompts.length,
    'asset prompts carry unique data-asset-id', 'missing or duplicate data-asset-id on asset prompt(s)');
} else {
  warn('A-1', 'no copyable asset generation prompts in the Asset Checklist (.asset-item blocks)');
}

// ---------- language mirror & editing chrome (S9) — scene prompts + asset prompts ----------
const units = prompts.length + assetPrompts.length;
if (userLang !== 'en') {
  const mirrors = html.match(/<pre class="prompt-mirror"/g) || [];
  check('S9-1', mirrors.length === units,
    'every prompt and asset prompt has a language mirror', `${units} editable blocks but ${mirrors.length} mirrors`);
  const langBtns = html.match(/class="tool-btn lang-btn"/g) || [];
  check('S9-2', langBtns.length === units,
    'every block has a mirror toggle', `${units} blocks but ${langBtns.length} lang buttons`);
  const stale = html.match(/class="mirror-stale"/g) || [];
  check('S9-3', stale.length === units,
    'every block has a stale-translation notice', `${units} blocks but ${stale.length} .mirror-stale divs`);
}
check('S9-4', /id="export-edits"/.test(html), 'Export edits button present', 'missing #export-edits button');
const resetBtns = html.match(/class="tool-btn reset-btn"/g) || [];
check('S9-5', resetBtns.length === units,
  'every editable block has a Reset button', `${units} blocks but ${resetBtns.length} reset buttons`);

// ---------- bible ↔ DOM consistency ----------
if (bible && Array.isArray(bible.scenes)) {
  const bibleSceneNums = bible.scenes.map(s => String(s.num ?? s.n ?? ''));
  const domScenes = new Set(checkboxScenes);
  const missingScenes = bibleSceneNums.filter(n => !domScenes.has(n));
  check('BIB-1', missingScenes.length === 0 && bibleSceneNums.length === checkboxScenes.length,
    'bible scene map matches DOM scenes',
    `bible scenes [${bibleSceneNums.join(',')}] vs DOM scenes [${checkboxScenes.join(',')}]`);
  const bibleIds = bible.scenes.flatMap(s => (s.prompts || []).map(p => typeof p === 'string' ? p : p.id));
  const domIds = new Set(prompts.map(p => p.id));
  const idMismatch = bibleIds.filter(i => !domIds.has(i)).concat([...domIds].filter(i => !bibleIds.includes(i)));
  check('BIB-2', idMismatch.length === 0,
    'bible prompt ids match DOM prompt ids', `mismatched prompt ids: ${idMismatch.join(', ')}`);
}

// ---------- report ----------
const width = Math.max(...results.map(r => r.id.length));
let fails = 0, warns = 0;
for (const r of results) {
  if (r.level === 'FAIL') fails++;
  if (r.level === 'WARN') warns++;
  console.log(`${r.level.padEnd(4)}  ${r.id.padEnd(width)}  ${r.msg}`);
}
console.log(`\n${results.length - fails - warns} passed, ${warns} warning(s), ${fails} failure(s) — ${file}`);
if (fails) {
  console.log('Blocking criteria failed. Fix the board before presenting it.');
  process.exit(1);
}
