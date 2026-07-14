# Research Brand Copy System

This site should sound like a careful groundwater researcher, not a generic AI assistant or a startup landing page.

## Tool choice

The workflow uses `write-good` because it is a small free npm package that catches passive voice, weasel words, wordiness, and cliches. It is not a final editor. It is a first-pass warning system.

Other usable tools considered:

- Vale: best for a mature style guide and CI enforcement.
- textlint: strong for customizable natural-language linting, especially if the project later needs bilingual rules.
- retext-readability: useful for readability scoring, but less useful than custom rules for this research website.

## Voice Rules

- Lead with the physical problem, not the brand.
- Use concrete nouns: forcing history, drawdown, recovery, thermal response, boundary movement, pumping limit.
- Use cautious verbs: test, compare, check, estimate, trace, review.
- Avoid unsupported status claims: world-leading, universal, revolutionary, guaranteed, proven.
- Avoid AI filler: leverage, robust, seamless, comprehensive, holistic, transformative.
- Keep claims falsifiable: say what data would support the claim and what would weaken it.
- For commercial pages, make the invitation specific: send the forcing history, measured response, suspected mismatch, and decision endpoint.

## Operating Pattern

Run this before polishing or deploying:

```bash
npm run copy:review
```

The report is written to `reports/copy_tone_report_YYYY-MM-DD.md`.

Use the report to rewrite sentences manually. Do not blindly accept every suggestion, because technical terms such as response, uncertainty, and framework are sometimes necessary.
