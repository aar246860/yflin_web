import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { normalizeDoi } from '../scripts/lib/publications.mjs';
import { TARGET_ORCID, authorIdentity, emptyCandidateState, fetchAllCrossrefWorks, fetchCrossrefPage, mergeCandidates, normalizeCrossrefWork, normalizeOrcid, readPublicationDate } from '../scripts/lib/publication_discovery.mjs';
import { discoverPublications } from '../scripts/discover_publications.mjs';

const at = '2026-10-01T00:00:00.000Z';
const author = { given: 'Ying-Fan', family: 'Lin', ORCID: `https://orcid.org/${TARGET_ORCID}`, 'authenticated-orcid': false };
const work = (overrides = {}) => ({ DOI: '10.1234/new.article', title: ['A bounded groundwater study'], type: 'journal-article', author: [author], 'container-title': ['Journal of Groundwater'], 'published-online': { 'date-parts': [[2026, 9, 18]] }, 'published-print': { 'date-parts': [[2026, 10]] }, ...overrides });
const catalog = [{ id: 'known-1', doi: '10.1234/known', title: { en: 'Known publication' }, venue: 'Journal of Groundwater', year: 2025, month: 3 }];
const response = (items, total = items.length, cursor) => ({ status: 'ok', 'message-type': 'work-list', message: { items, 'total-results': total, ...(cursor ? { 'next-cursor': cursor } : {}) } });
const ok = (payload) => ({ ok: true, status: 200, json: async () => payload });
const always = (payload) => async () => ok(payload);
const observed = (overrides = {}) => normalizeCrossrefWork(work(overrides));
const queue = (overrides = {}) => mergeCandidates(emptyCandidateState(), [observed(overrides)], catalog, at).state;

async function sandbox(t, state) {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'publication-discovery-'));
  t.after(() => fs.rm(root, { recursive: true, force: true }));
  await fs.mkdir(path.join(root, 'src/data'), { recursive: true });
  const catalogPath = path.join(root, 'src/data/publications.generated.json');
  const catalogBytes = JSON.stringify(catalog, null, 3) + '\n';
  await fs.writeFile(catalogPath, catalogBytes);
  const candidatesPath = path.join(root, 'reports/publications/candidates.json');
  let candidateBytes;
  if (state) {
    await fs.mkdir(path.dirname(candidatesPath), { recursive: true });
    candidateBytes = typeof state === 'string' ? state : JSON.stringify(state, null, 3) + '\n';
    await fs.writeFile(candidatesPath, candidateBytes);
  }
  return { root, catalogPath, catalogBytes, candidatesPath, candidateBytes };
}

const normalizedAuthor = (overrides = {}) => ({ given: 'Ying-Fan', family: 'Lin', orcid: TARGET_ORCID, ...overrides });

test('normalizes DOI URLs, prefixes, whitespace at edges, and case', () => {
  assert.equal(normalizeDoi('  HTTPS://DOI.ORG/10.1234/ABC  '), '10.1234/abc');
  assert.equal(normalizeDoi('doi:10.1234/ABC'), '10.1234/abc');
  assert.equal(normalizeDoi('http://dx.doi.org/10.1234/ABC'), '10.1234/abc');
  assert.equal(normalizeDoi(''), '');
  assert.equal(normalizeOrcid(`http://orcid.org/${TARGET_ORCID}/`), TARGET_ORCID);
  assert.equal(normalizeOrcid(`https://evil.example/${TARGET_ORCID}`), null);
});

test('author identity uses exact ORCID, never a same-name match', () => {
  assert.equal(authorIdentity([normalizedAuthor()]).status, 'exact-orcid');
  assert.equal(authorIdentity([normalizedAuthor({ orcid: '0000-0001-2345-6789' })]).status, 'conflicting-orcid');
  assert.equal(authorIdentity([normalizedAuthor({ given: 'Another', family: 'Author', orcid: '0000-0001-2345-6789' })]).status, 'orcid-mismatch');
  assert.equal(authorIdentity([normalizedAuthor({ orcid: null })]).status, 'missing-orcid');
  assert.equal(authorIdentity([]).status, 'missing-orcid');
  assert.equal(authorIdentity([normalizedAuthor({ given: 'Another', family: 'Person' })]).status, 'conflicting-orcid');
  assert.equal(authorIdentity([normalizedAuthor(), normalizedAuthor({ orcid: '0000-0001-2345-6789' })]).status, 'conflicting-orcid');
});

test('posted-content, preprint subtype, journal candidate, and unknown types remain review-only', () => {
  assert.equal(observed().publicationClass, 'journal-version-of-record-candidate');
  for (const override of [{ type: 'posted-content' }, { type: 'journal-article', subtype: 'preprint' }]) {
    const record = observed(override);
    assert.equal(record.publicationClass, 'preprint-or-posted-content');
    assert.equal(record.autoApproved, false);
    assert.ok(record.reviewReasons.some((reason) => reason.includes('must not be promoted')));
  }
  assert.equal(observed({ type: 'book-chapter' }).publicationClass, 'unknown');
  assert.equal(observed({ type: undefined }).publicationClass, 'unknown');
});

test('retains article numbers and actual Crossref version-of-record link evidence', () => {
  const record = observed({ 'article-number': '136291', link: [
    { URL: 'https://publisher.example/article/136291', 'content-version': 'vor', 'content-type': 'text/html', 'intended-application': 'text-mining' },
    { URL: 'https://publisher.example/preprint', 'content-version': 'am' },
    { URL: 'javascript:bad', 'content-version': 'vor' },
  ] });
  assert.equal(record.articleNumber, '136291');
  assert.equal(record.versionEvidence.vorLinks.length, 1);
  assert.equal(record.versionEvidence.vorLinks[0].contentVersion, 'vor');
  assert.equal(record.versionEvidence.publisherVerificationRequired, true);
  assert.equal(observed().versionEvidence.vorLinks.length, 0);
});

test('dates preserve day/month/year precision and separate online and issue evidence', () => {
  const record = observed({ 'journal-issue': { 'published-print': { 'date-parts': [[2026, 11]] } }, issued: { 'date-parts': [[2026]] }, created: { 'date-parts': [[2025, 12, 12]] }, deposited: { 'date-parts': [[2026, 1, 2]] } });
  assert.deepEqual(record.dates.online, { value: '2026-09-18', precision: 'day', source: 'published-online' });
  assert.deepEqual(record.dates.issue, { value: '2026-11', precision: 'month', source: 'journal-issue.published-print' });
  assert.deepEqual(record.dates.issued, { value: '2026', precision: 'year', source: 'issued' });
  const noDates = observed({ 'published-online': undefined, 'published-print': undefined, created: { 'date-parts': [[2026, 2, 1]] }, deposited: { 'date-parts': [[2026, 3]] }, indexed: { 'date-parts': [[2026, 4]] } });
  assert.ok(Object.values(noDates.dates).every((date) => date === null));
  assert.ok(noDates.reviewReasons.some((reason) => reason.includes('deposit timestamps are excluded')));
  assert.equal(readPublicationDate({ 'date-parts': [[2026, 2, 29]] }, 'online'), null);
  assert.equal(readPublicationDate({ 'date-parts': [[2024, 2, 29]] }, 'online').precision, 'day');
  assert.equal(readPublicationDate({ 'date-parts': [['2026', 4]] }, 'online'), null);
  assert.equal(readPublicationDate({ 'date-parts': [[2026, 13]] }, 'online'), null);
});

test('cursor pagination repeats the exact ORCID filter and consumes every page', async () => {
  const calls = [];
  const pages = [response([work(), work({ DOI: '10.1234/two' })], 3, 'next-cursor-A'), response([work({ DOI: '10.1234/three' })], 3)];
  const records = await fetchAllCrossrefWorks({ rows: 2, fetchImpl: async (url) => { calls.push(new URL(url)); return ok(pages.shift()); } });
  assert.equal(records.length, 3);
  assert.equal(calls[0].searchParams.get('cursor'), '*');
  assert.equal(calls[1].searchParams.get('cursor'), 'next-cursor-A');
  for (const call of calls) {
    assert.equal(call.origin, 'https://api.crossref.org');
    assert.equal(call.searchParams.get('filter'), `orcid:https://orcid.org/${TARGET_ORCID}`);
    assert.equal(call.searchParams.get('rows'), '2');
    assert.equal(call.searchParams.has('query.author'), false);
    assert.equal(call.searchParams.has('sort'), false);
  }
});

test('retries 429 and 503 with bounded Retry-After and backoff, then succeeds', async () => {
  const delays = [], stats = {};
  let calls = 0;
  const records = await fetchAllCrossrefWorks({ stats, sleep: async (ms) => delays.push(ms), fetchImpl: async () => {
    calls++;
    if (calls === 1) return { ok: false, status: 429, headers: { get: () => '1000' } };
    if (calls === 2) return { ok: false, status: 503, headers: { get: () => null } };
    return ok(response([work()]));
  } });
  assert.equal(records.length, 1);
  assert.equal(calls, 3);
  assert.deepEqual(delays, [30_000, 2000]);
  assert.equal(stats.retries, 2);
});

test('timeout covers both fetch and body parsing and retries a bounded number of times', async () => {
  for (const fetchImpl of [async () => new Promise(() => {}), async () => ({ ok: true, json: () => new Promise(() => {}) })]) {
    const stats = {};
    await assert.rejects(fetchCrossrefPage('https://api.crossref.org/works', { fetchImpl, stats, timeoutMs: 5, retries: 1, sleep: async () => {} }), { code: 'timeout' });
    assert.equal(stats.requests, 2);
    assert.equal(stats.retries, 1);
  }
});

test('whole discovery time budget bounds repeated slow/rate-limited requests', async () => {
  let time = 1000;
  const stats = {};
  await assert.rejects(fetchAllCrossrefWorks({ timeBudgetMs: 100, now: () => time, stats, sleep: async (ms) => { time += ms; }, fetchImpl: async () => ({ ok: false, status: 429 }) }), { code: 'time-budget-exceeded' });
  assert.equal(stats.requests, 1);
});

test('non-retryable HTTP errors and malformed JSON fail promptly', async () => {
  const stats = {};
  await assert.rejects(fetchCrossrefPage('https://api.crossref.org/works', { stats, fetchImpl: async () => ({ ok: false, status: 400 }) }), { code: 'http-400' });
  assert.equal(stats.requests, 1);
  await assert.rejects(fetchCrossrefPage('https://api.crossref.org/works', { fetchImpl: async () => ({ ok: true, json: async () => { throw new SyntaxError('no'); } }) }), { code: 'malformed-response' });
});

test('empty, malformed, incomplete, duplicate, changing, and unbounded pagination fail closed', async () => {
  const cases = [
    [response([], 0), 'empty-response'],
    [response([], 3), 'empty-response'],
    [{ status: 'ok', message: { items: [work()], 'total-results': 1 } }, 'malformed-response'],
    [{ ...response([work()]), message: { items: [work()] } }, 'malformed-response'],
    [response([work()], 2), 'incomplete-response'],
    [response([work({ title: [] })]), 'incomplete-record'],
    [response([work({ DOI: undefined })]), 'incomplete-record'],
    [response([work({ author: [ { given: 'Ying-Fan', family: 'Lin' } ] })]), 'identity-mismatch'],
    [response([work({ author: [ { ...author, ORCID: 'https://orcid.org/0000-0001-2345-6789' } ] })]), 'identity-mismatch'],
    [response([work(), work({ DOI: 'https://doi.org/10.1234/NEW.ARTICLE' })]), 'duplicate-response-doi'],
  ];
  for (const [payload, code] of cases) await assert.rejects(fetchAllCrossrefWorks({ fetchImpl: always(payload) }), { code });
  await assert.rejects(fetchAllCrossrefWorks({ rows: 1, fetchImpl: always(response([work()], 2)) }), { code: 'incomplete-response' });
  let pages = [response([work()], 2, 'next'), response([work({ DOI: '10.1234/two' })], 3)];
  await assert.rejects(fetchAllCrossrefWorks({ rows: 1, fetchImpl: async () => ok(pages.shift()) }), { code: 'changing-result-set' });
  await assert.rejects(fetchAllCrossrefWorks({ rows: 1, maxPages: 1, fetchImpl: always(response([work()], 2, 'next')) }), { code: 'pagination-limit' });
});

test('merge deduplicates DOI variants, is idempotent, and never drops absent prior candidates', () => {
  const prior = queue({ DOI: '10.1234/old' });
  prior.candidates.push({ ...prior.candidates[0], doi: 'HTTPS://DOI.ORG/10.1234/OLD' });
  const records = [observed(), { ...observed(), doi: 'doi:10.1234/NEW.ARTICLE' }];
  const first = mergeCandidates(prior, records, catalog, at);
  const second = mergeCandidates(first.state, records, catalog, at);
  assert.equal(first.state.candidates.length, 2);
  assert.equal(first.newlyDiscovered, 1);
  assert.deepEqual(second.state, first.state);
  assert.equal(second.newlyDiscovered, 0);
  assert.ok(second.state.candidates.every((candidate) => candidate.reviewRequired && !candidate.autoApproved));
  const changed = mergeCandidates(second.state, [observed({ title: ['Revised metadata'] })], catalog, at);
  assert.equal(changed.state.candidates.find((candidate) => candidate.doi === '10.1234/new.article').history.length, 1);
});

test('existing DOI metadata differences are review-only and approved records remain intact', () => {
  const before = structuredClone(catalog);
  const result = mergeCandidates(emptyCandidateState(), [observed({ DOI: 'https://doi.org/10.1234/KNOWN' })], catalog, at);
  assert.equal(result.state.candidates.length, 0);
  assert.equal(result.metadataDifferences[0].doi, '10.1234/known');
  assert.ok(result.metadataDifferences[0].differences.some((difference) => difference.field === 'title'));
  assert.deepEqual(catalog, before);
  const prior = queue({ DOI: '10.1234/old' });
  prior.candidates[0].doi = '10.1234/known';
  const retained = mergeCandidates(prior, [observed()], catalog, at);
  // A previously queued DOI may become approved; retain its history rather than deleting it.
  assert.equal(retained.state.candidates.find((candidate) => candidate.doi === '10.1234/known').catalogStatus, 'already-approved');
});

test('date and bibliographic enrichment compares explicit fields, never legacy sorting dates', () => {
  const approved = [{ ...catalog[0], year: 1999, month: 1, dates: { online: null, issue: null } }];
  const record = observed({ DOI: '10.1234/known', volume: '12', issue: '10', 'article-number': '230' });
  const result = mergeCandidates(emptyCandidateState(), [record], approved, at);
  const differences = result.metadataDifferences[0].differences;
  assert.ok(differences.some((difference) => difference.field === 'dates.online.value' && difference.kind === 'enrichment' && difference.crossref === '2026-09-18'));
  assert.ok(differences.some((difference) => difference.field === 'dates.issue.value' && difference.crossref === '2026-10'));
  assert.ok(differences.some((difference) => difference.field === 'articleNumber' && difference.crossref === '230'));
  assert.ok(differences.some((difference) => difference.field === 'volume'));
  assert.ok(differences.some((difference) => difference.field === 'issue'));
  assert.ok(differences.every((difference) => !['issueYear', 'issueMonth'].includes(difference.field)));
});

test('mixed missing/conflicting identity records are quarantined for manual review', () => {
  const missing = observed({ DOI: '10.1234/missing', author: [{ given: 'Ying-Fan', family: 'Lin' }] });
  const conflicting = observed({ DOI: '10.1234/conflict', author: [{ ...author, ORCID: '0000-0001-2345-6789' }] });
  const result = mergeCandidates(emptyCandidateState(), [observed(), missing, conflicting], catalog, at);
  assert.equal(result.identityReview.length, 2);
  assert.ok(result.state.candidates.every((candidate) => candidate.reviewRequired && candidate.autoApproved === false));
});

test('successful end-to-end discovery writes review reports only and preserves approved bytes', async (t) => {
  const files = await sandbox(t, queue({ DOI: '10.1234/old' }));
  const report = await discoverPublications({ root: files.root, now: () => new Date(at), fetchImpl: always(response([work()])) });
  assert.equal(report.health, 'healthy');
  assert.equal(report.complete, true);
  assert.equal(report.candidateCount, 2);
  assert.equal(await fs.readFile(files.catalogPath, 'utf8'), files.catalogBytes);
  const json = JSON.parse(await fs.readFile(path.join(files.root, 'reports/publications/latest-report.json'), 'utf8'));
  const markdown = await fs.readFile(path.join(files.root, 'reports/publications/latest-report.md'), 'utf8');
  assert.equal(json.publicCatalogModified, false);
  assert.match(markdown, /Sync health: healthy/);
  assert.match(markdown, /Exact ORCID discovery misses works/);
  assert.match(markdown, /deposit.*timestamps|deposited/);
});

test('429, timeout, empty, malformed, and incomplete runs preserve prior candidate bytes and report failure', async (t) => {
  const cases = [
    { fetchImpl: async () => ({ ok: false, status: 429 }) },
    { fetchImpl: async () => new Promise(() => {}), timeoutMs: 5 },
    { fetchImpl: always(response([], 0)) },
    { fetchImpl: always({ status: 'bad' }) },
    { fetchImpl: always(response([work()], 2)) },
  ];
  for (const options of cases) {
    const files = await sandbox(t, queue({ DOI: '10.1234/old' }));
    const report = await discoverPublications({ root: files.root, now: () => new Date(at), retries: 0, ...options });
    assert.equal(report.health, 'failed');
    assert.equal(report.complete, false);
    assert.equal(report.candidateCount, 1);
    assert.equal(report.lastSuccessfulDiscoveryAt, at);
    assert.equal(await fs.readFile(files.candidatesPath, 'utf8'), files.candidateBytes);
    assert.equal(await fs.readFile(files.catalogPath, 'utf8'), files.catalogBytes);
    assert.equal(JSON.parse(await fs.readFile(path.join(files.root, 'reports/publications/latest-report.json'), 'utf8')).complete, false);
  }
});

test('invalid prior state is not silently replaced and failed first run does not create an empty queue', async (t) => {
  const files = await sandbox(t, '{invalid json');
  let calls = 0;
  const report = await discoverPublications({ root: files.root, now: () => new Date(at), fetchImpl: async () => { calls++; return ok(response([work()])); } });
  assert.equal(report.health, 'failed');
  assert.equal(calls, 0);
  assert.equal(await fs.readFile(files.candidatesPath, 'utf8'), files.candidateBytes);
  const fresh = await sandbox(t);
  assert.equal((await discoverPublications({ root: fresh.root, fetchImpl: always(response([], 0)) })).complete, false);
  await assert.rejects(fs.stat(fresh.candidatesPath), { code: 'ENOENT' });
});

test('daily workflow remains report-only and always uploads current failure artifacts', async () => {
  const workflow = await fs.readFile(new URL('../.github/workflows/daily-research-ingest.yml', import.meta.url), 'utf8');
  assert.match(workflow, /37 20 \* \* \*/);
  assert.doesNotMatch(workflow, /^permissions:/m);
  assert.match(workflow, /npm run publication:discover/);
  assert.match(workflow, /npm run content:report/);
  assert.match(workflow, /if: always\(\)[\s\S]*actions\/upload-artifact@v4/);
  assert.match(workflow, /actions\/cache\/restore@v4/);
  assert.match(workflow, /steps\.discover\.outcome == 'success'/);
  assert.doesNotMatch(workflow, /content:sync|2026-06-12|git commit|git push|create-pull-request|deploy-pages/);
});
