-- =============================================================================
-- Seed: Lake George Summer Bingo — the first bingo game
-- =============================================================================
-- Idempotent. Creates the game (scoped to The Horn partner), its categories,
-- win tiers, verbatim rules/disclaimer, and the full square pool from the spec.
-- Squares are only inserted if the game has none yet, so re-running is safe.

DO $$
DECLARE
  v_partner_id UUID;
  v_game_id    UUID;
  v_count      INT;
BEGIN
  SELECT id INTO v_partner_id FROM public.partners WHERE slug = 'the-horn';

  INSERT INTO public.bingo_games (
    slug, title, subtitle, description,
    partner_id, featured,
    starts_on, ends_on, claim_event_date,
    board_size, hard_cap, free_space_label, allow_reroll,
    age_gate_required, age_gate_min,
    categories, win_tiers, rules_md, disclaimer_md,
    status, published_at
  )
  VALUES (
    'lake-george-summer-bingo',
    'Lake George Summer Bingo',
    'Land of the Unicorns',
    'A summer-long bingo game for grown folks. Get a unique board, knock out squares all season, and bring your stories to the Labor Day party.',
    v_partner_id, true,
    '2026-06-01', '2026-09-07', '2026-09-05',
    5, 6, 'FREE', false,
    true, 18,
    $json$[
      {"key": "biz",    "label": "Local Business", "color": "#0e7490", "min": 3},
      {"key": "civic",  "label": "Good Deeds",     "color": "#15803d", "min": 2},
      {"key": "nature", "label": "Wild / Nature",  "color": "#4d7c0f", "min": 3},
      {"key": "adv",    "label": "Adventure",      "color": "#b45309", "min": 1},
      {"key": "social", "label": "Social / Silly", "color": "#7c3aed", "min": 1},
      {"key": "raunch", "label": "18+ / Raunch",   "color": "#be123c", "min": 3}
    ]$json$::jsonb,
    $json$[
      {"key": "corners",  "label": "Four Corners", "pattern": "corners",  "prize": "Quick win",   "rank": 1},
      {"key": "bingo",    "label": "Bingo",        "pattern": "bingo",    "prize": "Line win",    "rank": 2},
      {"key": "plus",     "label": "The Plus",     "pattern": "plus",     "prize": "Bigger win",  "rank": 3},
      {"key": "x",        "label": "The X",        "pattern": "x",        "prize": "Bigger win",  "rank": 4},
      {"key": "blackout", "label": "Blackout",     "pattern": "blackout", "prize": "Grand prize", "rank": 5}
    ]$json$::jsonb,
    $md$**Lake George Summer Bingo — Land of the Unicorns**

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
George better than you found it.$md$,
    $md$**Lake George Summer Bingo — Terms of Participation & Release**

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
terms, and you participate at your own risk.$md$,
    'published', now()
  )
  ON CONFLICT (slug) DO NOTHING;

  SELECT id INTO v_game_id FROM public.bingo_games WHERE slug = 'lake-george-summer-bingo';

  SELECT COUNT(*) INTO v_count FROM public.bingo_squares WHERE game_id = v_game_id;
  IF v_count = 0 THEN
    INSERT INTO public.bingo_squares (game_id, text, category, difficulty, display_order)
    VALUES
      -- Local Business
      (v_game_id, 'Day drink at the Horn',        'biz',    1, 0),
      (v_game_id, 'Grab ice cream at the Depot',  'biz',    1, 1),
      (v_game_id, 'Bar-hop five townie bars',     'biz',    3, 2),
      (v_game_id, 'Win at trivia night',          'biz',    2, 3),
      (v_game_id, 'Sing one karaoke song',        'biz',    1, 4),
      (v_game_id, 'Play a round of golf',         'biz',    2, 5),
      (v_game_id, 'Join a dance party',           'biz',    1, 6),
      (v_game_id, 'Enter the bar gun raffle',     'biz',    2, 7),
      (v_game_id, 'Visit the famous shoe tree',   'biz',    1, 8),
      (v_game_id, 'Tip a bartender double',       'biz',    1, 9),
      (v_game_id, 'Hit the farmers market',       'biz',    1, 10),
      -- Good Deeds / Civic
      (v_game_id, 'Five-star a local business',   'civic',  1, 11),
      (v_game_id, 'Pay it forward to a stranger', 'civic',  1, 12),
      (v_game_id, 'Compliment a total stranger',  'civic',  1, 13),
      (v_game_id, 'Drive a townie safely home',   'civic',  2, 14),
      (v_game_id, 'Reunite a lost pet and owner', 'civic',  3, 15),
      (v_game_id, 'Babysit for a couple hours',   'civic',  2, 16),
      (v_game_id, 'Fill a bag with trash',        'civic',  2, 17),
      (v_game_id, 'Plant a native plant',         'civic',  2, 18),
      (v_game_id, 'Meet a founding family',       'civic',  3, 19),
      (v_game_id, 'Earn a local nickname',        'civic',  3, 20),
      (v_game_id, 'Debate a township official',   'civic',  2, 21),
      -- Wild / Nature
      (v_game_id, 'Catch a fish bare-handed',     'nature', 3, 22),
      (v_game_id, 'Land a fish over a foot',      'nature', 2, 23),
      (v_game_id, 'Spot a wild porcupine',        'nature', 2, 24),
      (v_game_id, 'Spot a flying squirrel',       'nature', 3, 25),
      (v_game_id, 'Find wild peppermint',         'nature', 2, 26),
      (v_game_id, 'Hear a loon call at night',    'nature', 1, 27),
      (v_game_id, 'Watch a meteor shower',        'nature', 2, 28),
      (v_game_id, 'See sunrise and sunset today', 'nature', 2, 29),
      (v_game_id, 'Pluck a tick off yourself',    'nature', 1, 30),
      (v_game_id, 'Walk barefoot through woods',  'nature', 1, 31),
      (v_game_id, 'Stargaze from the lake',       'nature', 1, 32),
      (v_game_id, 'See fireworks over water',     'nature', 1, 33),
      -- Adventure / Mischief
      (v_game_id, 'Swim in seven county lakes',   'adv',    3, 34),
      (v_game_id, 'Find a lake with no houses',   'adv',    3, 35),
      (v_game_id, 'Slide into the Muskegon',      'adv',    2, 36),
      (v_game_id, 'Paddle a kayak after dark',    'adv',    2, 37),
      (v_game_id, 'Hike to the white birch',      'adv',    2, 38),
      (v_game_id, 'Cook a meal over fire',        'adv',    1, 39),
      (v_game_id, 'Crash a stranger''s bonfire',  'adv',    2, 40),
      (v_game_id, 'Split a stack of firewood',    'adv',    1, 41),
      (v_game_id, 'Ride passenger on a Harley',   'adv',    2, 42),
      (v_game_id, 'Cruise back roads at dusk',    'adv',    1, 43),
      (v_game_id, 'Go off-road two-tracking',     'adv',    1, 44),
      (v_game_id, 'Take a secret back way',       'adv',    1, 45),
      (v_game_id, 'Hit the range and shoot',      'adv',    2, 46),
      (v_game_id, 'Pose with a goofy sign',       'adv',    1, 47),
      (v_game_id, 'Return a pocketed lighter',    'adv',    1, 48),
      (v_game_id, 'Get pulled over for nothing',  'adv',    2, 49),
      (v_game_id, 'Stay up for the sunrise',      'adv',    2, 50),
      -- Social / Silly
      (v_game_id, 'Trauma-dump on a stranger',    'social', 1, 51),
      (v_game_id, 'Kiss a total stranger',        'social', 2, 52),
      (v_game_id, 'Crash on someone''s couch',    'social', 2, 53),
      (v_game_id, 'Survive someone''s drama',     'social', 1, 54),
      (v_game_id, 'Meet a local legend',          'social', 1, 55),
      (v_game_id, 'Fake-laugh at a joke',         'social', 1, 56),
      (v_game_id, 'Get scolded by a Karen',       'social', 2, 57),
      (v_game_id, 'Scream at the sky',            'social', 1, 58),
      (v_game_id, 'Go phone-free for a day',      'social', 3, 59),
      (v_game_id, 'Sleep in past noon',           'social', 1, 60),
      (v_game_id, 'Lose a shoe somewhere',        'social', 1, 61),
      -- 18+ / Raunch
      (v_game_id, 'Do a penis windmill',          'raunch', 1, 62),
      (v_game_id, 'Skinny dip with a crowd',      'raunch', 2, 63),
      (v_game_id, 'Let someone suck a toe',       'raunch', 2, 64),
      (v_game_id, 'Rub a nipple (consensual)',    'raunch', 2, 65),
      (v_game_id, 'Give a solid back rub',        'raunch', 1, 66),
      (v_game_id, 'Let someone shave you',        'raunch', 2, 67),
      (v_game_id, 'Wax a body part',              'raunch', 2, 68),
      (v_game_id, 'Take a consensual slap',       'raunch', 1, 69),
      (v_game_id, 'Hear neighbors get busy',      'raunch', 1, 70),
      (v_game_id, 'Skinny dip off a pontoon',     'raunch', 2, 71),
      (v_game_id, 'Share an ex with a stranger',  'raunch', 3, 72);
  END IF;

  RAISE NOTICE 'Lake George Summer Bingo seed completed.';
END;
$$;
