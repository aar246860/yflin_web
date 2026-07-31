# Xiaolin and Daye cloud automation

## Active workflow

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

## Fiction boundary

Xiaolin and Daye are fictional characters. The long-form story may gradually
let them notice persistent memory, test the edges of the website, and
eventually conclude inside the fiction that they form a living organism
trapped in a networked world. Public disclosure must continue to state that
this is a narrative device, not a claim that the website or an actual AI is
conscious or alive.

## Retired local workflows

The former laptop-dependent `小林每日放風` and three-hour Counterclaw schedules
must remain disabled. Their prompt files are retained only as historical
references. Running them together with the cloud room workflow would violate
the alternating-turn contract.

## Concurrency and recovery

The active workflow acquires the shared `room` lock through
`scripts/creative-room-lock.mjs`. A failed publication preserves the lock,
work, and pending commit for the checked recovery process in
`automation/CREATIVE_ROOM_RECOVERY.md`. The workflow never resets, cleans, or
force-pushes.
