---
title: "What If LaTeX Were the Output?"
subtitle: "A working experiment in keeping the everyday manuscript directly editable while reserving LaTeX for final production."
lang: "en"
translationKey: "note-web-first-manuscript-workflow"
date: 2026-07-27
updated: 2026-07-27
concept: "Research workflow"
tags: ["manuscript workflow", "LaTeX", "Overleaf", "GitHub"]
evidenceLevel: "limited"
sourceProjects: ["Web-first manuscript workflow prototype"]
relatedPublications: []
audience: ["researchers", "coauthors", "scientific software developers"]
collaborationRelevance: "A prototype for research teams that want faster manuscript iteration without giving up equation quality, version history, or final human review."
summaryZh: "這是一套仍在開發中的論文工作流程：日常編修先在可直接閱讀與修改的網頁稿進行，待內容穩定後再輸出 LaTeX 與 PDF。目的不是取代 Word 或 Overleaf，而是減少不同工具之間反覆搬移、編譯與同步的摩擦。"
metaDescription: "A prototype web-first manuscript workflow that keeps daily editing direct and produces LaTeX when a paper reaches a submission checkpoint."
draft: false
noteType: "method-note"
---

Word makes tracked review familiar. Overleaf makes equation-heavy collaboration practical. GitHub preserves version history and supports reproducible checks. Each solves a real part of manuscript development.

The friction appears when the same draft repeatedly moves among them.

My current experiment reverses the usual order. The everyday manuscript remains readable and directly editable in a web interface. LaTeX and PDF become controlled outputs produced at submission checkpoints rather than the only place where the argument can be revised.

## What the workflow must preserve

A useful implementation cannot trade scientific control for convenience. It must preserve equations, references, figures, tables, and document structure. Export should be deterministic, revisions should remain visible, and the generated LaTeX should compile without silently changing the scientific content.

Confidential manuscripts and unpublished data must also remain in an appropriate local or private repository. No automated revision is accepted until an author reviews the resulting argument, evidence, and wording.

## Why test this approach

The purpose is not to prove that a web editor is universally better. Different coauthors have different habits, and tracked changes in Word or direct editing in Overleaf may still be the right choice.

The narrower question is whether a web-first draft can reduce the repeated editing, compiling, pushing, and pulling that interrupts scientific reasoning. If it can, the saved effort should be measured in fewer synchronization errors and faster substantive review, not merely in the number of automated steps.

## Current status

This is a working prototype, not a released manuscript platform. The next tests concern citation round-tripping, equation fidelity, reviewer-style diffs, reproducible LaTeX export, and coauthor usability.

The short film introducing the idea is available in the featured-film section on the homepage and in the [original X post](https://x.com/AquiferMemory/status/2081312688182116613).
