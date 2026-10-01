import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { compilePublications, normalizeDoi, validatePublications, validDate, writeJsonAtomic } from '../scripts/lib/publications.mjs';

const read = (file) => JSON.parse(fs.readFileSync(new URL(file, import.meta.url), 'utf8'));
const source = read('../src/data/publications.source.json');
const metadata = read('../scripts/publication_metadata.json');
const legacyIds = read('./fixtures/legacy-publication-identities.json');
const generated = read('../src/data/publications.generated.json');
const clone = (object) => structuredClone(object);
const verifiedAdditions = new Set([
  '10.1007/s00477-026-03356-2', '10.1016/j.jhydrol.2026.136291',
  '10.1016/j.advwatres.2026.105381', '10.1016/j.icheatmasstransfer.2026.111572',
  '10.1016/j.ijheatmasstransfer.2026.128817', '10.1016/j.applthermaleng.2026.130490',
]);

test('verified baseline records have unique canonical DOIs and retain all 41 legacy IDs', () => {
  const records = compilePublications(source, metadata);
  assert.ok(records.length >= 47);
  for (const doi of verifiedAdditions) assert.ok(records.some((record) => normalizeDoi(record.doi) === doi));
  assert.equal(new Set(records.map((record) => normalizeDoi(record.doi))).size, records.length);
  assert.equal(Object.keys(legacyIds).length, 41);
  for (const record of records) {
    const legacyId = legacyIds[normalizeDoi(record.doi)];
    if (legacyId) assert.equal(record.id, legacyId);
  }
  assert.deepEqual(records.filter((record) => legacyIds[normalizeDoi(record.doi)] && record.studentContribution).map((record) => record.id), ['2026-01-2']);
  assert.deepEqual(validatePublications(records), []);
  assert.deepEqual(records, generated);
});

test('all 39 film DOI-to-ID relationships survive without requiring six new videos', () => {
  const byDoi = new Map(generated.map((record) => [normalizeDoi(record.doi), record]));
  const films = read('../src/data/publicationFilms.generated.json');
  assert.equal(films.length, 39);
  for (const film of films) assert.equal(byDoi.get(normalizeDoi(film.doi)).id, film.id);
  for (const record of generated.filter((record) => verifiedAdditions.has(normalizeDoi(record.doi)))) {
    assert.equal(record.studentContribution, undefined);
    assert.equal(record.featureVideo, undefined);
  }
});

test('source order and repeated compilation do not change output or stable IDs', () => {
  const reversed = { ...source, records: Object.fromEntries(Object.entries(source.records).reverse()) };
  assert.deepEqual(compilePublications(reversed, metadata, generated), generated);
  assert.deepEqual(compilePublications(source, metadata, generated), generated);
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'publication-idempotence-'));
  try {
    const target = path.join(dir, 'records.json');
    assert.equal(writeJsonAtomic(target, generated), true);
    const stat = fs.statSync(target);
    assert.equal(writeJsonAtomic(target, compilePublications(source, metadata)), false);
    assert.equal(fs.statSync(target).mtimeMs, stat.mtimeMs);
  } finally { fs.rmSync(dir, { recursive: true }); }
});

test('DOI normalization handles URLs, prefixes, encoding and casing without false matches', () => {
  assert.equal(normalizeDoi(' DOI: 10.1029/2024WR038724 '), '10.1029/2024wr038724');
  assert.equal(normalizeDoi('https://dx.doi.org/10.1029%2F2024WR038724'), '10.1029/2024wr038724');
  for (const value of [null, '', '#', 'hello', '10.1234/has space', 'https://evil.example/10.1234/x', '10.1234/x?other', '10.1234/%ZZ']) assert.equal(normalizeDoi(value), '');
});

test('unreviewed, preprint, mismatched, duplicate and incomplete records fail closed', () => {
  const key = Object.keys(source.records)[0];
  const pending = clone(metadata); pending[key].review.status = 'pending';
  assert.throws(() => compilePublications(source, pending), /Unreviewed/);
  const preprint = clone(source); preprint.records[key].publicationType = 'posted-content';
  assert.throws(() => compilePublications(preprint, metadata), /formal journal/);
  const mismatch = clone(source); mismatch.records[key].doi = '10.1234/another';
  assert.throws(() => compilePublications(mismatch, metadata), /mismatch/);
  const duplicate = clone(metadata); duplicate[key].id = metadata[Object.keys(metadata)[1]].id;
  assert.throws(() => compilePublications(source, duplicate), /duplicate stable ID/);
  const raw = clone(generated); raw.push({ ...raw[0], id: 'duplicate', doi: raw[0].doi.toUpperCase() });
  assert.ok(validatePublications(raw).some((error) => error.includes('duplicate DOI')));
  assert.throws(() => compilePublications({ schemaVersion: 1, records: {} }, {}), /at least one/);
  const overwrite = clone(metadata); overwrite[key].authors = 'Wrong Author';
  assert.throws(() => compilePublications(source, overwrite), /Unsupported curated field/);
});

test('source omissions and identifier changes never overwrite the last valid catalogue', () => {
  const key = Object.keys(source.records)[0];
  const missing = clone(source); delete missing.records[key];
  const reduced = clone(metadata); delete reduced[key];
  assert.throws(() => compilePublications(missing, reduced, generated), /Refusing to remove/);
  const renamed = clone(metadata); renamed[key].id = 'different-id';
  assert.throws(() => compilePublications(source, renamed, generated), /Refusing stable ID change/);
});

test('first-online is explicit and never fabricated from issue/deposit timestamps', () => {
  const newRecords = generated.filter((record) => verifiedAdditions.has(normalizeDoi(record.doi)));
  assert.equal(newRecords.length, 6);
  const springer = newRecords.find((record) => record.doi.startsWith('10.1007/'));
  assert.equal(springer.dates.online.value, '2026-09-18');
  assert.equal(springer.dates.online.precision, 'day');
  assert.equal(springer.dates.issue.value, '2026-10');
  for (const record of newRecords.filter((record) => record !== springer)) assert.equal(record.dates.online, null);
  for (const record of generated.filter((record) => legacyIds[normalizeDoi(record.doi)])) assert.deepEqual(record.dates, { online: null, issue: null });
  const date = { value: '2026-02-29', precision: 'day', source: 'publisher', sourceUrl: 'https://example.org/paper' };
  assert.equal(validDate(date), false);
  assert.equal(validDate({ ...date, value: '2024-02-29' }), true);
  assert.equal(validDate({ ...date, value: '2026-09', precision: 'day' }), false);
  assert.equal(validDate(null), true);
});

test('CLI compilation is independent of legacy sibling files and does not rewrite members', () => {
  const before = fs.readFileSync(new URL('../src/data/publications.generated.json', import.meta.url));
  const members = fs.readFileSync(new URL('../src/data/members.generated.json', import.meta.url));
  execFileSync(process.execPath, ['scripts/import_publications.mjs'], { cwd: new URL('../', import.meta.url), env: { ...process.env, YFLIN_OLD_SITE: '/does/not/exist' } });
  assert.deepEqual(fs.readFileSync(new URL('../src/data/publications.generated.json', import.meta.url)), before);
  assert.deepEqual(fs.readFileSync(new URL('../src/data/members.generated.json', import.meta.url)), members);
});
