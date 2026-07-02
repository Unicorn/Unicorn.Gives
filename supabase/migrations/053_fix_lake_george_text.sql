-- =============================================================================
-- Fix: re-store Lake George rules/disclaimer as unwrapped markdown
-- =============================================================================
-- The original seed (052) hard-wrapped list items across multiple lines. The
-- lightweight markdown renderer keeps only lines that start a list marker and
-- drops wrapped continuation lines, which truncated several rules/terms. This
-- rewrites the same text with one line per list item / paragraph so it renders
-- in full. Words are unchanged; only line wrapping differs.

UPDATE public.bingo_games
SET
  rules_md = $md$**Lake George Summer Bingo — Land of the Unicorns**

You get a unique board with a random mix of squares. Center is a free space. Get out there this summer and knock them out.

**The rules**

1. **18 and older only.** Everything here is for grown folks.
2. **Consent is the whole game.** Any square involving another person needs an enthusiastic yes from them, every time. No yes, no square. Period.
3. **Obey every law and every "no."** Trespassing, impaired driving, and anything illegal does not count, and we will not honor it. If a square needs private land, get permission first.
4. **Mark a square only after you actually do it.** Honor system. A photo or a witness makes for a better story anyway.
5. **Keep your stories.** Save a note, a photo, or a memory for each square you mark. You will need them (see below).
6. **Ways to win:** a full line (row, column, or diagonal) is a Bingo. Four corners is a quick win. The Plus or the X is a bigger win. Cover the whole board (blackout) for the grand prize.
7. **No two boards are the same.** Your board has an ID like LG-7K2QX. Hang onto it.

**The Labor Day Story Party (required to claim a win)**

On Labor Day weekend we throw a party, lay all the boards out, and compare. To claim any win, **you have to show up and tell the story behind each square you marked.** No story, no credit for that square. The best, weirdest, and most wholesome stories take home extra. Bring your board, bring your receipts, and bring the tales. Winners are confirmed at the party, not before.

Be good to each other, tip your bartenders, pick up some litter, and leave Lake George better than you found it.$md$,
  disclaimer_md = $md$**Lake George Summer Bingo — Terms of Participation & Release**

This game is offered for entertainment by [Nonprofit Legal Name] ("the Organizer"). By participating, you agree to the following:

1. **Adults only.** You confirm you are 18 years of age or older.
2. **Voluntary participation, assumption of risk.** Participation is entirely voluntary. Many activities suggested in this game carry inherent risks, including activities in or near water, around fire, outdoors, with animals, and with alcohol. You knowingly and freely assume all risks, known and unknown, and you participate at your own risk.
3. **Your responsibility, your choices.** You alone are responsible for your conduct. The squares are lighthearted suggestions, not instructions or encouragement. You decide what, if anything, you actually do. Skip any square you are not comfortable with.
4. **Obey the law.** You agree to comply with all applicable federal, state, and local laws and the rights of others, including private property, trespass, noise, public conduct, firearm, boating, and traffic laws. Do not drink and drive, and never operate a vehicle, boat, or watercraft while impaired. Nothing in this game authorizes, requests, or rewards any illegal or unsafe act, and no such act will be recognized as a completed square.
5. **Consent.** Any square involving another person requires that person's clear, voluntary consent. You will not touch, photograph, or involve anyone without their permission.
6. **No liability.** To the fullest extent permitted by law, the Organizer and its officers, directors, volunteers, sponsors, and partners are not liable for any injury, loss, damage, or claim arising out of or related to your participation, including the acts or omissions of other participants or third parties. The game is provided "as is" with no warranties.
7. **Release and indemnity.** You release and agree to hold harmless and indemnify the Organizer and the people listed above from any and all claims arising from your participation, to the fullest extent permitted by Michigan law.
8. **Property and businesses.** Mentions of local businesses, places, and landmarks do not imply their endorsement, sponsorship, or involvement. Respect every business, their staff, and their rules.
9. **Conduct.** Be respectful and lawful. The Organizer may disqualify any participant for unsafe, unlawful, or harmful behavior.

By tapping "I agree" you confirm you are 18+, you have read and accept these terms, and you participate at your own risk.$md$
WHERE slug = 'lake-george-summer-bingo';
