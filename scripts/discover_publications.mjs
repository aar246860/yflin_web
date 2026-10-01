import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  TARGET_ORCID, DISCOVERY_LIMITATIONS, DiscoveryError, emptyCandidateState,
  validateCandidateState, fetchAllCrossrefWorks, mergeCandidates, renderDiscoveryReport,
} from './lib/publication_discovery.mjs';

async function readJson(file) { return JSON.parse(await fs.readFile(file, 'utf8')); }
async function writeAtomic(file, contents) {
  const temporary = `${file}.${process.pid}.tmp`;
  try { await fs.writeFile(temporary, contents, 'utf8'); await fs.rename(temporary, file); }
  finally { await fs.rm(temporary, { force: true }); }
}
const json = (value) => `${JSON.stringify(value, null, 2)}\n`;

// Deliberately has no public-catalog writer, importer invocation, or approval path.
export async function discoverPublications({ root = process.cwd(), now = () => new Date(), ...requestOptions } = {}) {
  const directory = path.join(root, 'reports', 'publications');
  const candidatesPath = path.join(directory, 'candidates.json');
  const catalogPath = path.join(root, 'src', 'data', 'publications.generated.json');
  const checkedAt = now().toISOString();
  const stats = {};
  let previous = emptyCandidateState();
  const report = { schemaVersion: 1, targetOrcid: TARGET_ORCID, checkedAt, health: 'failed', complete: false, reviewOnly: true, publicCatalogModified: false, stats, limitations: DISCOVERY_LIMITATIONS };
  await fs.mkdir(directory, { recursive: true });
  try {
    try { previous = validateCandidateState(await readJson(candidatesPath)); }
    catch (error) { if (error.code !== 'ENOENT') throw error; }
    const approved = await readJson(catalogPath);
    const records = await fetchAllCrossrefWorks({ ...requestOptions, stats });
    const merged = mergeCandidates(previous, records, approved, checkedAt);
    Object.assign(report, {
      health: merged.identityReview.length ? 'healthy-with-review-warnings' : 'healthy', complete: true,
      lastSuccessfulDiscoveryAt: checkedAt, candidateCount: merged.state.candidates.length,
      newlyDiscovered: merged.newlyDiscovered, exactOrcidResults: records.filter((record) => record.identity.status === 'exact-orcid').length,
      candidates: merged.state.candidates, metadataDifferences: merged.metadataDifferences,
      identityReview: merged.identityReview, catalogDoisNotReturned: merged.catalogDoisNotReturned,
    });
    await writeAtomic(candidatesPath, json(merged.state));
  } catch (error) {
    Object.assign(report, {
      health: 'failed', complete: false, lastSuccessfulDiscoveryAt: previous.lastSuccessfulDiscoveryAt,
      candidateCount: previous.candidates.length, candidates: previous.candidates,
      error: { code: error instanceof DiscoveryError ? error.code : error.code || 'discovery-error', message: error.message },
    });
  }
  await writeAtomic(path.join(directory, 'latest-report.json'), json(report));
  await writeAtomic(path.join(directory, 'latest-report.md'), renderDiscoveryReport(report));
  return report;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  if (process.argv.length > 2) {
    console.error('Usage: node scripts/discover_publications.mjs (read-only Crossref discovery; writes only reports/publications/)');
    process.exitCode = process.argv.includes('--help') ? 0 : 1;
  } else {
    try {
      const report = await discoverPublications();
      console.log(`Publication discovery: ${report.health}; ${report.candidateCount} review candidates; reports/publications/latest-report.md`);
      if (!report.complete) { console.error(`${report.error.code}: ${report.error.message}`); process.exitCode = 1; }
    } catch (error) { console.error(`Unable to write discovery report: ${error.message}`); process.exitCode = 1; }
  }
}
