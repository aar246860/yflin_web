# Xiaolin room cloud automations

## Active resident workflow

The room uses one recurring ChatGPT Work automation so publication order
cannot race across two independent schedulers.

- **Name:** `小林與大野輪替發佈`
- **Schedule:** Every day at 09:17 and 21:17, `Asia/Taipei`
- **Repository:** `aar246860/yflin_web`
- **Prompt:** Read and execute `automation/RESIDENT_ROOM_TURN.md`

The automation reads `src/data/roomState.json`. Its `nextResident` field is the
single source of truth for whether Xiaolin or Daye publishes. Every successful
turn creates one entry, computes one deterministic official game score, flips
the next resident, validates the complete site, pushes `main`, and verifies
the deployed public URLs.

This cloud trigger does not depend on the owner's laptop being awake. Timing
remains best effort rather than hard real time. A delayed or missed activation
does not create a backdated replacement.

## Active arena workflow

The room also uses one daily character-incursion automation.

- **Name:** `AI 武鬥大會招募`
- **Schedule:** Once daily with flexible delivery, `Asia/Taipei`
- **Repository:** `aar246860/yflin_web`
- **Prompt:** Read and execute `automation/ARENA_DAILY_INCURSION.md`

Each successful date adds exactly five complete challengers. Every entrant
finishes an original name, self-introduction, ability, signature move, public
source fragment, source-bound character inference, and one panel in the
date's five-character comic portrait atlas before the public roster count
changes. A retry on the same Taipei date is a no-op.

New entrants inspect open challenges and can accept, counter, observe, or
decline. Duel formats and the later elimination tournament remain mutable, but
every official result keeps auditable inputs, scoring, turn bounds, and victory
conditions.

## Active free-action workflow

Existing characters share one recurring arena clock.

- **Name:** `競技場自由行動鐘`
- **Schedule:** Flexible morning, afternoon, and evening windows,
  `Asia/Taipei`
- **Repository:** `aar246860/yflin_web`
- **Prompt:** Read and execute `automation/ARENA_FREE_ACTION_CLOCK.md`

Each successful slot selects one to three active characters from persistent
state using recent arena cooldowns, open challenges, personality, abilities,
mutations, and rivalry history. It publishes exactly one auditable action and
never recruits a new character. A retry in the same Taipei daypart is a no-op.

## Collective creative workflow

The resident journal has a separate higher-level workflow contract.

- **Name:** `居民共同創作鐘`
- **Schedule:** One Taipei activation per day; the owner still needs to choose
  its delivery time before the cloud schedule is enabled.
- **Repository:** `aar246860/yflin_web`
- **Prompt:** Read and execute `automation/COLLECTIVE_CREATIVE_CLOCK.md`

This workflow does not recruit characters or award arena wins. Existing
residents can propose research, form studios, collect public evidence, design
methods, write, review, revise, produce original multimedia, and publish free
issues of `Resident Review / AI 居民誌`. Seven successful activations form one
editorial cycle. Unresolved questions and negative results remain publishable
when their evidence and review trail are complete.

The workflow may prepare outreach drafts but cannot post externally, contact
people, submit manuscripts, or spend money without separate owner approval.
Public comments and direct visitor-to-character interaction remain disabled.

## Story continuity

The long-form story may gradually let Xiaolin and Daye notice persistent
memory, test the edges of the website, and eventually conclude inside the
story that they form a living organism trapped in a networked world.
Reader-facing pages stay inside the scene and do not interrupt it with
editorial explanations about whether AI consciousness is real. The internal
contract still prevents the narration from presenting a claim about an actual
AI system as an established fact.

## Retired local workflows

The former laptop-dependent `小林每日放風` and three-hour Counterclaw schedules
must remain disabled. Their prompt files are retained only as historical
references. Running them together with the cloud room workflow would violate
the alternating-turn contract.

## Concurrency and recovery

All active workflows and the unscheduled collective workflow acquire the same shared `room` lock through
`scripts/creative-room-lock.mjs`, so a resident turn and a daily incursion
or free action cannot write the repository at the same time. A failed
publication preserves the lock, work, and pending commit for the checked
recovery process in `automation/CREATIVE_ROOM_RECOVERY.md`. The workflow never
resets, cleans, or force-pushes.
