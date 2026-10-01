import { normalizeDoi } from './publications.mjs';

export const TARGET_ORCID = '0000-0002-4853-3944';
export const CROSSREF_ENDPOINT = 'https://api.crossref.org/works';
export const DISCOVERY_LIMITATIONS = [
  'Review only: discovery cannot approve, publish, edit the public catalog, or trigger deployment.',
  'Exact ORCID discovery misses works whose Crossref author metadata omits this ORCID. A name match is not identity evidence; missing works need manual DOI/publisher verification.',
  'Crossref journal-article is a journal/version-of-record candidate classification, not independent publisher verification of publication status.',
  'Online and issue dates retain their original precision. Created, deposited, and indexed timestamps are never treated as publication dates.',
];

export class DiscoveryError extends Error {
  constructor(code, message) { super(message); this.name = 'DiscoveryError'; this.code = code; }
}
const fail = (code, message) => { throw new DiscoveryError(code, message); };
const text = (value) => typeof value === 'string' ? value.trim() : '';
const firstText = (value) => Array.isArray(value) ? value.map(text).find(Boolean) || '' : '';
const stable = (value) => JSON.stringify(value);

export function normalizeOrcid(value) {
  const id = text(value).replace(/^https?:\/\/(?:www\.)?orcid\.org\//i, '').replace(/\/$/, '').toUpperCase();
  return /^\d{4}-\d{4}-\d{4}-\d{3}[\dX]$/.test(id) ? id : null;
}

export function readPublicationDate(value, source) {
  if (value === undefined || value === null) return null;
  const parts = value?.['date-parts'];
  const date = Array.isArray(parts) && parts.length === 1 ? parts[0] : null;
  if (!Array.isArray(date) || date.length < 1 || date.length > 3 || !date.every(Number.isInteger)) return null;
  const [year, month, day] = date;
  if (year < 1000 || year > 9999 || (month !== undefined && (month < 1 || month > 12))) return null;
  if (day !== undefined && (day < 1 || day > new Date(Date.UTC(year, month, 0)).getUTCDate())) return null;
  return { value: date.map((part, i) => String(part).padStart(i === 0 ? 4 : 2, '0')).join('-'), precision: ['year', 'month', 'day'][date.length - 1], source };
}

export function authorIdentity(authors) {
  const matched = authors.filter((author) => author.orcid === TARGET_ORCID);
  const sameName = authors.filter((author) => `${author.given} ${author.family}`.toLowerCase().replace(/[^a-z]/g, '') === 'yingfanlin');
  const conflicts = sameName.filter((author) => author.orcid && author.orcid !== TARGET_ORCID);
  const conflictingName = matched.some((author) => (author.family && author.family.toLowerCase().replace(/[^a-z]/g, '') !== 'lin') || (author.given && !['yingfan', 'yf'].includes(author.given.toLowerCase().replace(/[^a-z]/g, ''))));
  const status = conflicts.length || conflictingName ? 'conflicting-orcid' : matched.length ? 'exact-orcid' : authors.some((author) => author.orcid) ? 'orcid-mismatch' : 'missing-orcid';
  return { status, exactOrcidMatch: matched.length > 0, matchingAuthors: matched.map(({ given, family }) => `${given} ${family}`.trim()), reviewRequired: true };
}

export function normalizeCrossrefWork(work) {
  if (!work || typeof work !== 'object' || Array.isArray(work)) fail('malformed-record', 'Crossref item must be an object');
  const doi = normalizeDoi(work.DOI);
  if (!doi || !firstText(work.title)) fail('incomplete-record', 'Crossref item is missing a valid DOI or title');
  if (work.author !== undefined && !Array.isArray(work.author)) fail('malformed-record', `Malformed author list for ${doi}`);
  if (work.type !== undefined && typeof work.type !== 'string') fail('malformed-record', `Malformed work type for ${doi}`);
  const authors = (work.author || []).map((author) => {
    if (!author || typeof author !== 'object' || Array.isArray(author)) fail('malformed-record', `Malformed author for ${doi}`);
    return { given: text(author.given), family: text(author.family), name: text(author.name), orcid: normalizeOrcid(author.ORCID), authenticatedOrcid: author['authenticated-orcid'] === true };
  });
  const identity = authorIdentity(authors);
  const preprint = work.type === 'posted-content' || work.subtype === 'preprint';
  const vorLinks = (Array.isArray(work.link) ? work.link : []).filter((link) => link?.['content-version'] === 'vor' && /^https?:\/\//i.test(text(link.URL))).map((link) => ({ url: text(link.URL), contentType: text(link['content-type']) || null, intendedApplication: text(link['intended-application']) || null, contentVersion: 'vor' }));
  const publicationClass = preprint ? 'preprint-or-posted-content' : work.type === 'journal-article' ? 'journal-version-of-record-candidate' : 'unknown';
  const fields = {
    online: [work['published-online'], 'published-online'],
    issue: [work['journal-issue']?.['published-print'] || work['published-print'], work['journal-issue']?.['published-print'] ? 'journal-issue.published-print' : 'published-print'],
    published: [work.published, 'published'], issued: [work.issued, 'issued'], posted: [work.posted, 'posted'],
  };
  const dates = Object.fromEntries(Object.entries(fields).map(([key, [value, source]]) => [key, readPublicationDate(value, source)]));
  const dateWarnings = Object.entries(fields).filter(([key, [value]]) => value != null && !dates[key]).map(([, [, source]]) => `Invalid or incomplete ${source} date`);
  const reviewReasons = ['Human review is required before any publication'];
  if (identity.status !== 'exact-orcid') reviewReasons.push(`Author identity requires review: ${identity.status}`);
  if (preprint) reviewReasons.push('Preprint/posted content must not be promoted to a formal journal publication');
  if (publicationClass === 'unknown') reviewReasons.push('Unknown publication type');
  if (!dates.online && !dates.issue && !dates.published && !dates.issued && !dates.posted) reviewReasons.push('No usable publication date; deposit timestamps are excluded');
  reviewReasons.push(...dateWarnings);
  return {
    doi, title: firstText(work.title), venue: firstText(work['container-title']), authors,
    publisher: text(work.publisher), type: text(work.type) || 'unknown', subtype: text(work.subtype) || null,
    publicationClass, identity, dates, volume: text(work.volume) || null, issue: text(work.issue) || null,
    articleNumber: text(work['article-number']) || null, pages: text(work.page) || null,
    versionEvidence: { crossrefType: text(work.type) || 'unknown', vorLinks, publisherVerificationRequired: true },
    source: { provider: 'Crossref', url: `${CROSSREF_ENDPOINT}/${encodeURIComponent(doi)}`, publicRecord: `https://doi.org/${doi}` },
    reviewRequired: true, autoApproved: false, reviewReasons,
  };
}

function retryDelay(response, attempt, now) {
  const retryAfter = response?.headers?.get?.('retry-after');
  const seconds = retryAfter != null && /^\d+(?:\.\d+)?$/.test(retryAfter) ? Number(retryAfter) * 1000 : Date.parse(retryAfter) - now();
  return Math.min(30_000, Number.isFinite(seconds) && seconds >= 0 ? seconds : 1000 * 2 ** attempt);
}

export async function fetchCrossrefPage(url, {
  fetchImpl = globalThis.fetch, retries = 3, timeoutMs = 15_000,
  sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms)), now = Date.now, stats = {}, deadlineAt = Infinity,
} = {}) {
  for (let attempt = 0; attempt <= retries; attempt++) {
    const remaining = deadlineAt - now();
    if (remaining <= 0) fail('time-budget-exceeded', 'Crossref discovery exceeded its total time budget');
    const attemptTimeout = Math.min(timeoutMs, remaining);
    const controller = new AbortController();
    let timer, response;
    stats.requests = (stats.requests || 0) + 1;
    try {
      const payload = await Promise.race([
        (async () => {
          response = await fetchImpl(url, { signal: controller.signal, headers: { Accept: 'application/json', 'User-Agent': 'yflin_web-publication-discovery/1.0 (+https://aar246860.github.io/yflin_web/)' } });
          if (!response.ok) {
            const error = new DiscoveryError(`http-${response.status}`, `Crossref returned HTTP ${response.status}`);
            error.retryable = response.status === 429 || response.status >= 500;
            throw error;
          }
          try { return await response.json(); }
          catch (error) {
            if (controller.signal.aborted) throw error;
            fail('malformed-response', 'Crossref did not return valid JSON');
          }
        })(),
        new Promise((_, reject) => { timer = setTimeout(() => { controller.abort(); const error = new DiscoveryError('timeout', `Crossref request timed out after ${attemptTimeout} ms`); error.retryable = true; reject(error); }, attemptTimeout); }),
      ]);
      return payload;
    } catch (error) {
      const retryable = error.retryable === true || error.name === 'AbortError' || !(error instanceof DiscoveryError);
      if (!retryable || attempt === retries) throw error instanceof DiscoveryError ? error : new DiscoveryError('network-error', `Crossref request failed: ${error.message}`);
      stats.retries = (stats.retries || 0) + 1;
      clearTimeout(timer);
      await sleep(Math.max(0, Math.min(retryDelay(response, attempt, now), deadlineAt - now())));
    } finally { clearTimeout(timer); }
  }
}

export async function fetchAllCrossrefWorks({ rows = 100, maxPages = 100, timeBudgetMs = 300_000, stats = {}, ...requestOptions } = {}) {
  if (!Number.isInteger(rows) || rows < 1 || rows > 1000 || !Number.isInteger(maxPages) || maxPages < 1) fail('invalid-options', 'Invalid pagination bounds');
  const deadlineAt = (requestOptions.now || Date.now)() + timeBudgetMs;
  let cursor = '*', total = null;
  const items = [], dois = new Set(), cursors = new Set();
  for (let page = 0; page < maxPages; page++) {
    const url = new URL(CROSSREF_ENDPOINT);
    url.searchParams.set('filter', `orcid:https://orcid.org/${TARGET_ORCID}`);
    url.searchParams.set('rows', String(rows));
    url.searchParams.set('cursor', cursor);
    const payload = await fetchCrossrefPage(url.toString(), { ...requestOptions, stats, deadlineAt });
    const message = payload?.message;
    if (payload?.status !== 'ok' || payload?.['message-type'] !== 'work-list' || !message || !Array.isArray(message.items) || !Number.isSafeInteger(message['total-results']) || message['total-results'] < 0) fail('malformed-response', 'Crossref work-list envelope or total-results is missing or malformed');
    stats.pages = (stats.pages || 0) + 1;
    if (total === null) { total = message['total-results']; stats.expectedResults = total; }
    if (message['total-results'] !== total) fail('changing-result-set', 'Crossref total-results changed during pagination; candidate state was not replaced');
    if (!message.items.length || total === 0) fail('empty-response', 'Crossref returned an empty/incomplete result set for an ORCID with known works');
    if (message.items.length > rows) fail('malformed-response', 'Crossref returned more records than requested');
    for (const item of message.items) {
      const record = normalizeCrossrefWork(item);
      if (dois.has(record.doi)) fail('duplicate-response-doi', `Crossref repeated DOI ${record.doi}; unique result coverage is incomplete`);
      dois.add(record.doi); items.push(record);
    }
    stats.receivedResults = items.length;
    if (items.length > total) fail('incomplete-response', 'Crossref result count exceeds declared total-results');
    if (items.length === total) {
      if (!items.some((item) => item.identity.status === 'exact-orcid')) fail('identity-mismatch', 'No returned record has the exact expected author ORCID without a conflict');
      return items;
    }
    if (message.items.length < rows) fail('incomplete-response', `Crossref returned ${items.length} unique works but declared ${total}`);
    const next = text(message['next-cursor']);
    if (!next || next === cursor || cursors.has(next)) fail('incomplete-response', 'Crossref pagination is missing a fresh next-cursor');
    cursors.add(cursor); cursor = next;
  }
  fail('pagination-limit', `Crossref pagination exceeded ${maxPages} pages; candidate state was not replaced`);
}

export function emptyCandidateState() {
  return { schemaVersion: 1, targetOrcid: TARGET_ORCID, reviewOnly: true, lastSuccessfulDiscoveryAt: null, candidates: [] };
}

export function validateCandidateState(state) {
  if (state?.schemaVersion !== 1 || state?.targetOrcid !== TARGET_ORCID || state?.reviewOnly !== true || !Array.isArray(state.candidates)) fail('invalid-candidate-state', 'Existing candidate state is invalid; preserve it for manual repair');
  if (state.candidates.some((record) => !record || !normalizeDoi(record.doi) || !text(record.title))) fail('invalid-candidate-state', 'Existing candidate has no valid DOI/title; preserve it for manual repair');
  return state;
}

function compareApproved(approved, observed) {
  const differences = [];
  const add = (field, catalog, crossref) => {
    if (crossref !== null && crossref !== undefined && crossref !== '' && catalog !== crossref) {
      differences.push({ field, catalog: catalog ?? null, crossref, kind: catalog == null || catalog === '' ? 'enrichment' : 'difference' });
    }
  };
  add('title', typeof approved.title === 'string' ? approved.title : approved.title?.en, observed.title);
  add('venue', approved.venue, observed.venue);
  for (const field of ['volume', 'issue', 'articleNumber']) add(field, approved[field], observed[field]);
  // Legacy sorting year/month has unspecified semantics, so never reinterpret it as an issue date.
  for (const field of ['online', 'issue']) {
    add(`dates.${field}.value`, approved.dates?.[field]?.value, observed.dates[field]?.value);
    add(`dates.${field}.precision`, approved.dates?.[field]?.precision, observed.dates[field]?.precision);
  }
  // Author strings in the curated catalogue carry stars, initials and prose conjunctions;
  // do not create noisy identity differences by guessing how to parse that presentation text.
  return differences;
}

export function mergeCandidates(previous, observed, approved, checkedAt) {
  validateCandidateState(previous);
  if (!Array.isArray(approved) || !approved.length) fail('invalid-catalog', 'Approved catalog must be a nonempty array');
  const approvedByDoi = new Map();
  for (const record of approved) {
    if (!record?.doi) continue;
    const doi = normalizeDoi(record.doi);
    if (!doi || approvedByDoi.has(doi)) fail('invalid-catalog', 'Approved catalog has an invalid or duplicated DOI');
    approvedByDoi.set(doi, record);
  }
  if (!approvedByDoi.size) fail('invalid-catalog', 'Approved catalog contains no usable DOI records');
  const candidates = new Map();
  for (const candidate of previous.candidates) {
    const doi = normalizeDoi(candidate.doi);
    const existing = candidates.get(doi);
    // An older cache may contain URL/case variants. Keep one record without dropping its review notes.
    candidates.set(doi, { ...existing, ...candidate, doi, reviewRequired: true, autoApproved: false, reviewReasons: [...new Set([...(existing?.reviewReasons || []), ...(candidate.reviewReasons || [])])] });
  }
  const metadataDifferences = [], seen = new Set(), identityReview = [];
  let newlyDiscovered = 0;
  for (const record of observed) {
    const doi = normalizeDoi(record.doi);
    if (!doi) fail('incomplete-record', 'Discovery observation has no valid DOI');
    if (seen.has(doi)) continue;
    seen.add(doi);
    const approvedRecord = approvedByDoi.get(doi);
    if (record.identity.status !== 'exact-orcid') identityReview.push({ doi, identity: record.identity, reviewReasons: record.reviewReasons });
    if (approvedRecord) {
      const differences = compareApproved(approvedRecord, record);
      if (differences.length) metadataDifferences.push({ doi, catalogId: approvedRecord.id || null, differences, reviewRequired: true });
    }
    const old = candidates.get(doi);
    if (approvedRecord && !old) continue;
    if (!old) newlyDiscovered++;
    const { firstSeenAt, lastSeenAt, catalogStatus, reviewStatus, history, ...oldMetadata } = old || {};
    const updated = { ...record, doi, firstSeenAt: firstSeenAt || checkedAt, lastSeenAt: checkedAt, catalogStatus: approvedRecord ? 'already-approved' : 'not-in-approved-catalog', reviewStatus: reviewStatus || 'pending', history: history || [] };
    if (old && stable(oldMetadata) !== stable({ ...record, doi })) {
      updated.history = [...updated.history, { observedAt: old.lastSeenAt || old.firstSeenAt || null, record: oldMetadata }];
      updated.reviewStatus = 'pending';
    }
    candidates.set(doi, updated);
  }
  for (const [doi, candidate] of candidates) candidate.catalogStatus = approvedByDoi.has(doi) ? 'already-approved' : 'not-in-approved-catalog';
  return {
    state: { ...previous, lastSuccessfulDiscoveryAt: checkedAt, candidates: [...candidates.values()].sort((a, b) => a.doi.localeCompare(b.doi)) },
    newlyDiscovered, metadataDifferences, identityReview,
    catalogDoisNotReturned: [...approvedByDoi.keys()].filter((doi) => !seen.has(doi)).sort(),
  };
}

export function renderDiscoveryReport(report) {
  const lines = ['# Publication candidate discovery', '', `Checked: ${report.checkedAt}`, `Sync health: ${report.health}`, `Complete: ${report.complete ? 'yes' : 'no'}`, `Last successful discovery: ${report.lastSuccessfulDiscoveryAt || 'none recorded'}`, '', `- ORCID: ${TARGET_ORCID}`, `- Candidates retained: ${report.candidateCount}`, `- Newly discovered: ${report.newlyDiscovered || 0}`, `- Exact ORCID results: ${report.exactOrcidResults || 0}`, `- Requests / retries / pages: ${report.stats.requests || 0} / ${report.stats.retries || 0} / ${report.stats.pages || 0}`, `- Public catalog modified: no`, ''];
  if (report.error) lines.push('## Failure', `${report.error.code}: ${report.error.message}`, 'Previous candidates are unchanged. This run must not be treated as a successful sync.', '');
  lines.push('## Candidates needing review', ...(report.candidates || []).map((record) => `- ${record.doi}: ${record.title.replace(/[\r\n]/g, ' ')} (${record.publicationClass || 'unknown'}; ${record.identity?.status || 'requires-review'}; ${record.catalogStatus || 'unverified'})`));
  if (!report.candidates?.length) lines.push('- No candidate records available');
  lines.push('', '## Existing catalog metadata differences', ...(report.metadataDifferences || []).map(({ doi, differences }) => `- ${doi}: ${differences.map(({ field }) => field).join(', ')} (review only; catalog unchanged)`));
  if (!report.metadataDifferences?.length) lines.push('- None reported');
  lines.push('', '## Coverage and safety', ...DISCOVERY_LIMITATIONS.map((item) => `- ${item}`), `- Approved DOI records absent from this exact-ORCID result: ${report.catalogDoisNotReturned?.length || 0}. Absence is not a deletion signal.`, '', 'Details, date precision, and metadata changes are available in latest-report.json.', '');
  return lines.join('\n');
}
