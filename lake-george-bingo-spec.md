# Lake George Summer Bingo — Build Spec & Content

> Single source of truth. Feed this whole file to Claude Code. It contains the
> build prompt, the generator spec, every square, the game rules, and the legal
> disclaimer. The rules and disclaimer text are also app content (render them in
> an "About / How to Play" screen and a footer).

---

## 1. PROMPT FOR CLAUDE CODE (paste this as your instruction)

> Build a **Lake George Summer Bingo** feature inside our existing Expo SDK 52 /
> Expo Router v4 app, using `@scaffald/ui` components and our existing theme
> tokens. Implement it against the spec in Section 2, the square data in Section
> 3, and surface the rules (Section 4) and disclaimer (Section 5) in the UI.
>
> Acceptance criteria:
> 1. A `buildBoard(seed: string)` pure function that returns 25 cells (center =
>    FREE) drawn from the pool in Section 3, respecting category minimums and the
>    hard-task cap, then shuffled into random positions. Same seed = same board.
> 2. A `detectWins(marked: boolean[])` pure function returning every line hit
>    plus the highest win tier (see Section 2.4). Center counts as marked.
> 3. A board screen: 5x5 grid, tap to mark, the FREE center pre-marked, a "New
>    board" action, a seed/board-ID display, and a win banner showing the tier.
> 4. An "About / How to Play" screen rendering Section 4 verbatim.
> 5. A persistent footer or modal rendering the Section 5 disclaimer, plus an
>    18+ confirmation gate on first open (store acceptance locally).
> 6. Print/share: export a clean printable card (one per page) and a shareable
>    board ID so players can compare boards on Labor Day.
> 7. Keep both functions framework-agnostic (no React imports) so they can be
>    unit-tested. Add tests: every generated board has >= the category minimums,
>    <= the hard cap, exactly one FREE center, and 24 unique tasks.
>
> Do NOT add any square that encourages illegal or unsafe acts. Treat Section 3
> as the complete, approved list.

---

## 2. GENERATOR SPEC

### 2.1 Board shape
- 5x5 grid, 25 cells. Index 12 (center) is always the **FREE** unicorn space,
  pre-marked, never shuffled.
- The other 24 cells are unique tasks drawn from the pool.

### 2.2 Selection rules (this is what makes boards balanced, not just random)
Per board, before filling randomly, guarantee these category minimums so every
board still promotes local business and good deeds while keeping the adult flavor:

```
MINS = { biz: 3, civic: 2, nature: 3, raunch: 3, adv: 1, social: 1 }  // = 13
HARD_CAP = 6   // max difficulty-3 tasks per board, so boards stay winnable
```

Algorithm:
1. Group the pool by category, shuffle each group with a seeded RNG.
2. For each category, take its minimum (skip a hard task if HARD_CAP is hit).
3. Fill the remaining slots up to 24 from a shuffled global pool (still honoring
   HARD_CAP).
4. Shuffle the 24 into positions, insert FREE at index 12.

### 2.3 Seeding (reproducible, shareable, verifiable)
Use a string seed hashed into a 32-bit integer, fed to a small PRNG
(e.g. mulberry32). Same seed always rebuilds the same board. Surface a short
human board ID like `LG-7K2QX`. For real-money or prize play, generate seeds
server-side, store issued seeds, and use crypto-grade randomness so boards can't
be reverse-engineered.

### 2.4 Win patterns and tiers (highest achieved wins)
- **BINGO** — any full row, column, or diagonal.
- **FOUR CORNERS** — indices 0, 4, 20, 24.
- **THE PLUS** — full center row + full center column.
- **THE X** — both diagonals.
- **BLACKOUT** — all 25 (cover-all). Grand prize.

`detectWins` returns the list of lines hit and the single highest tier label so
prizes can be driven off the tier name.

### 2.5 Label style
All square labels are kept to roughly 15 to 29 characters, imperative phrasing,
understandable without explanation. Keep this constraint if you add squares.

---

## 3. SQUARE DATA (drop-in)

```ts
// cat: "biz" | "civic" | "nature" | "social" | "raunch" | "adv"
// d: 1 easy | 2 medium | 3 hard
export type BingoTask = { t: string; cat: BingoTask["cat"]; d: 1 | 2 | 3 };

export const POOL: BingoTask[] = [
  // --- LOCAL BUSINESS (promote local spend) ---
  { t: "Day drink at the Horn", cat: "biz", d: 1 },
  { t: "Grab ice cream at the Depot", cat: "biz", d: 1 },
  { t: "Bar-hop five townie bars", cat: "biz", d: 3 },
  { t: "Win at trivia night", cat: "biz", d: 2 },
  { t: "Sing one karaoke song", cat: "biz", d: 1 },
  { t: "Play a round of golf", cat: "biz", d: 2 },
  { t: "Join a dance party", cat: "biz", d: 1 },
  { t: "Enter the bar gun raffle", cat: "biz", d: 2 },
  { t: "Visit the famous shoe tree", cat: "biz", d: 1 },
  { t: "Tip a bartender double", cat: "biz", d: 1 },
  { t: "Hit the farmers market", cat: "biz", d: 1 },

  // --- GOOD DEEDS / CIVIC ---
  { t: "Five-star a local business", cat: "civic", d: 1 },
  { t: "Pay it forward to a stranger", cat: "civic", d: 1 },
  { t: "Compliment a total stranger", cat: "civic", d: 1 },
  { t: "Drive a townie safely home", cat: "civic", d: 2 },
  { t: "Reunite a lost pet and owner", cat: "civic", d: 3 },
  { t: "Babysit for a couple hours", cat: "civic", d: 2 },
  { t: "Fill a bag with trash", cat: "civic", d: 2 },
  { t: "Plant a native plant", cat: "civic", d: 2 },
  { t: "Meet a founding family", cat: "civic", d: 3 },
  { t: "Earn a local nickname", cat: "civic", d: 3 },
  { t: "Debate a township official", cat: "civic", d: 2 },

  // --- WILD / NATURE ---
  { t: "Catch a fish bare-handed", cat: "nature", d: 3 },
  { t: "Land a fish over a foot", cat: "nature", d: 2 },
  { t: "Spot a wild porcupine", cat: "nature", d: 2 },
  { t: "Spot a flying squirrel", cat: "nature", d: 3 },
  { t: "Find wild peppermint", cat: "nature", d: 2 },
  { t: "Hear a loon call at night", cat: "nature", d: 1 },
  { t: "Watch a meteor shower", cat: "nature", d: 2 },
  { t: "See sunrise and sunset today", cat: "nature", d: 2 },
  { t: "Pluck a tick off yourself", cat: "nature", d: 1 },
  { t: "Walk barefoot through woods", cat: "nature", d: 1 },
  { t: "Stargaze from the lake", cat: "nature", d: 1 },
  { t: "See fireworks over water", cat: "nature", d: 1 },

  // --- ADVENTURE / MISCHIEF ---
  { t: "Swim in seven county lakes", cat: "adv", d: 3 },
  { t: "Find a lake with no houses", cat: "adv", d: 3 },
  { t: "Slide into the Muskegon", cat: "adv", d: 2 },
  { t: "Paddle a kayak after dark", cat: "adv", d: 2 },
  { t: "Hike to the white birch", cat: "adv", d: 2 },
  { t: "Cook a meal over fire", cat: "adv", d: 1 },
  { t: "Crash a stranger's bonfire", cat: "adv", d: 2 },
  { t: "Split a stack of firewood", cat: "adv", d: 1 },
  { t: "Ride passenger on a Harley", cat: "adv", d: 2 },
  { t: "Cruise back roads at dusk", cat: "adv", d: 1 },
  { t: "Go off-road two-tracking", cat: "adv", d: 1 },
  { t: "Take a secret back way", cat: "adv", d: 1 },
  { t: "Hit the range and shoot", cat: "adv", d: 2 },
  { t: "Pose with a goofy sign", cat: "adv", d: 1 },
  { t: "Return a pocketed lighter", cat: "adv", d: 1 },
  { t: "Get pulled over for nothing", cat: "adv", d: 2 },
  { t: "Stay up for the sunrise", cat: "adv", d: 2 },

  // --- SOCIAL / SILLY ---
  { t: "Trauma-dump on a stranger", cat: "social", d: 1 },
  { t: "Kiss a total stranger", cat: "social", d: 2 },
  { t: "Crash on someone's couch", cat: "social", d: 2 },
  { t: "Survive someone's drama", cat: "social", d: 1 },
  { t: "Meet a local legend", cat: "social", d: 1 },
  { t: "Fake-laugh at a joke", cat: "social", d: 1 },
  { t: "Get scolded by a Karen", cat: "social", d: 2 },
  { t: "Scream at the sky", cat: "social", d: 1 },
  { t: "Go phone-free for a day", cat: "social", d: 3 },
  { t: "Sleep in past noon", cat: "social", d: 1 },
  { t: "Lose a shoe somewhere", cat: "social", d: 1 },

  // --- 18+ / RAUNCH ---
  { t: "Do a penis windmill", cat: "raunch", d: 1 },
  { t: "Skinny dip with a crowd", cat: "raunch", d: 2 },
  { t: "Let someone suck a toe", cat: "raunch", d: 2 },
  { t: "Rub a nipple (consensual)", cat: "raunch", d: 2 },
  { t: "Give a solid back rub", cat: "raunch", d: 1 },
  { t: "Let someone shave you", cat: "raunch", d: 2 },
  { t: "Wax a body part", cat: "raunch", d: 2 },
  { t: "Take a consensual slap", cat: "raunch", d: 1 },
  { t: "Hear neighbors get busy", cat: "raunch", d: 1 },
  { t: "Skinny dip off a pontoon", cat: "raunch", d: 2 },
  { t: "Share an ex with a stranger", cat: "raunch", d: 3 },
];
```

---

## 4. HOW TO PLAY (render this verbatim in-app)

**Lake George Summer Bingo — Land of the Unicorns**

You get a unique board with a random mix of squares. Center is a free space.
Get out there this summer and knock them out.

**The rules**
1. **18 and older only.** Everything here is for grown folks.
2. **Consent is the whole game.** Any square involving another person needs an
   enthusiastic yes from them, every time. No yes, no square. Period.
3. **Obey every law and every "no."** Trespassing, impaired driving, and
   anything illegal does not count, and we will not honor it. If a square needs
   private land, get permission first.
4. **Mark a square only after you actually do it.** Honor system. A photo or a
   witness makes for a better story anyway.
5. **Keep your stories.** Save a note, a photo, or a memory for each square you
   mark. You will need them (see below).
6. **Ways to win:** a full line (row, column, or diagonal) is a Bingo. Four
   corners is a quick win. The Plus or the X is a bigger win. Cover the whole
   board (blackout) for the grand prize.
7. **No two boards are the same.** Your board has an ID like `LG-7K2QX`. Hang
   onto it.

**The Labor Day Story Party (required to claim a win)**
On Labor Day weekend we throw a party, lay all the boards out, and compare. To
claim any win, **you have to show up and tell the story behind each square you
marked.** No story, no credit for that square. The best, weirdest, and most
wholesome stories take home extra. Bring your board, bring your receipts, and
bring the tales. Winners are confirmed at the party, not before.

Be good to each other, tip your bartenders, pick up some litter, and leave Lake
George better than you found it.

---

## 5. LEGAL DISCLAIMER (render in footer + first-run gate; require 18+ "I agree")

*The following is a plain-language disclaimer, not legal advice. Before you
publish, have a licensed Michigan attorney review it and adapt it to the
nonprofit's actual name and insurance.*

**Lake George Summer Bingo — Terms of Participation & Release**

This game is offered for entertainment by [Nonprofit Legal Name] ("the
Organizer"). By participating, you agree to the following:

1. **Adults only.** You confirm you are 18 years of age or older.

2. **Voluntary participation, assumption of risk.** Participation is entirely
   voluntary. Many activities suggested in this game carry inherent risks,
   including activities in or near water, around fire, outdoors, with animals,
   and with alcohol. You knowingly and freely assume all risks, known and
   unknown, and you participate at your own risk.

3. **Your responsibility, your choices.** You alone are responsible for your
   conduct. The squares are lighthearted suggestions, not instructions or
   encouragement. You decide what, if anything, you actually do. Skip any square
   you are not comfortable with.

4. **Obey the law.** You agree to comply with all applicable federal, state, and
   local laws and the rights of others, including private property, trespass,
   noise, public conduct, firearm, boating, and traffic laws. Do not drink and
   drive, and never operate a vehicle, boat, or watercraft while impaired.
   Nothing in this game authorizes, requests, or rewards any illegal or unsafe
   act, and no such act will be recognized as a completed square.

5. **Consent.** Any square involving another person requires that person's clear,
   voluntary consent. You will not touch, photograph, or involve anyone without
   their permission.

6. **No liability.** To the fullest extent permitted by law, the Organizer and
   its officers, directors, volunteers, sponsors, and partners are not liable for
   any injury, loss, damage, or claim arising out of or related to your
   participation, including the acts or omissions of other participants or third
   parties. The game is provided "as is" with no warranties.

7. **Release and indemnity.** You release and agree to hold harmless and
   indemnify the Organizer and the people listed above from any and all claims
   arising from your participation, to the fullest extent permitted by Michigan
   law.

8. **Property and businesses.** Mentions of local businesses, places, and
   landmarks do not imply their endorsement, sponsorship, or involvement. Respect
   every business, their staff, and their rules.

9. **Conduct.** Be respectful and lawful. The Organizer may disqualify any
   participant for unsafe, unlawful, or harmful behavior.

By tapping "I agree" you confirm you are 18+, you have read and accept these
terms, and you participate at your own risk.

---

*End of spec.*
