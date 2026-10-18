# Sprint plan — Horn subscriptions (drafted 2026-10-17)

**Sprint goal:** a visitor can pick a Horn membership tier on unicorn.gives, pay in Square, and
land back on their account page with an **active, recurring** subscription they can pause,
cancel, and update the card for — with no manual reconciliation by staff.

## Where things stand

Most of the machinery already exists (migrations 019/023/027/058, seven `square-*` edge
functions, `SubscriptionsSection`, `/user/account/subscriptions`). It was built and switched on
for **The Mane**; the Horn never got the in-app flow and instead sends people to an external
Square link (`square.link/u/liQwjPlT`, migrations 024–026). The community page still links to
the dead `horn.love` (`constants/hornContent.ts`).

### Defects found in the existing flow (must fix before turning it on)

| # | Severity | Where | Problem |
|---|---|---|---|
| D1 | **Blocker** | `square-subscriptions` `create_checkout` | Builds a `quick_pay` payment link **without `checkout_options.subscription_plan_id`**, so Square takes a one-time payment and never creates a subscription. No `subscription.created` webhook ever fires. |
| D2 | High | `square-subscriptions` + `square-webhooks` | Checkout inserts a `pending` row with no `square_subscription_id`; webhooks/reconcile upsert on `square_subscription_id`, so the pending row is orphaned forever and a second row appears. Need to correlate (store `payment_link.order_id`, match on order/customer) and promote the pending row. |
| D3 | High | `square-webhooks` `resolveUserId` | Square Checkout may create its own customer from the buyer's details, so `customer_id` won't match our `square_customers` row → subscription saved with `user_id = null` and never shows in the member's account. Add fallback: match by email / `reference_id`, then backfill `square_customers`. |
| D4 | High | `square-oauth` disconnect | Disconnecting Square **deletes every `square_subscriptions` row** for the partner — one mis-click wipes the Horn's member records. Soft-detach instead. |
| D5 | Medium | `square-oauth` scopes | No `INVOICES_READ`, so invoice webhooks (`next_billing_at`, failed-charge) won't be delivered. Requires partner to re-authorize. |
| D6 | Medium | `SubscriptionsSection` | Signed-out "Join" redirects to `/partners?join=…` (wrong page) and nothing resumes the checkout after sign-in. |
| D7 | Medium | `square-account` cancel | Square cancels at period end, but we set `status = 'canceled'` immediately — member looks lapsed while still paid up. Show "Active until {date}". |
| D8 | Low | `square-webhooks` | Listens for `subscription.canceled` (not a Square event; harmless). HMAC compare is not constant-time. |
| D9 | Low | Admin | No admin view of the Horn's members/statuses (data exists in `square_subscriptions`, RLS already allows admins). |

> **Progress:** D1–D3 (items 1–2) fixed on `feat/horn-subscription-checkout`: checkout sets
> `subscription_plan_id` and drops Cash App Pay; pending rows store the payment-link order, and a
> shared linker (`_shared/subscriptionLink.ts`, rules in `_shared/subscriptionMatch.ts`) promotes
> them from webhooks, the hourly reconcile, and member refresh. **Deploy migration 059 before the
> functions.** Not yet exercised against the Square sandbox.

## Sprint backlog (≈2 weeks)

Points are rough (1 = hours, 5 = several days).

### Must — the paid path works end to end
1. **Fix checkout to create a real subscription** (D1) — add `subscription_plan_id`, verify the
   plan variation uses STATIC pricing matching `quick_pay`, test in Square **sandbox**. *(3)*
2. **Pending → active correlation** (D2, D3) — store order/payment-link id, match webhook +
   reconcile on it, email fallback for user linking. Unit tests for the matcher. *(5)*
3. **Safe disconnect** (D4) — keep subscription history; mark connection inactive. *(1)*
4. **Re-auth with `INVOICES_READ`** (D5) and confirm webhook subscriptions in the Square
   developer dashboard include `subscription.*`, `invoice.*`, `customer.*`. *(2)*
5. **Turn it on for the Horn** — Horn connects Square (OAuth), creates Individual $40 /
   Couple $60 / Family $100 plans in Square, Sync; migration enabling
   `subscriptions_enabled` + adding `subscriptions` to the Horn's `section_order` and pointing
   the hero CTA at `#section-subscriptions`. *(2)*
6. **Ops prerequisites** — `SQUARE_WEBHOOK_SIGNATURE_KEY`, `SITE_URL` secrets set;
   `square_reconcile_key` added to Vault (migration 058 is a no-op until it is). *(1)*

### Should — member experience
7. **Sign-in resume** (D6) — return to the Horn page and auto-open the chosen plan. *(2)*
8. **Post-checkout landing** — handle `?status=success` on `/user/account/subscriptions`
   with a "Confirming your membership…" state until the webhook lands (realtime is already
   wired in `useMySubscriptions`). *(2)*
9. **Cancel-at-period-end display** (D7). *(1)*
10. **Replace `horn.love` / `square.link` CTAs** in `hornContent.ts`, `membership.md` and Horn
    partner pages with the in-app section; retire migrations 024–026's link. *(1)*

### Could — if time allows
11. **VIP add-on ($20/mo)** — decide: separate plan variations (Individual+VIP …) vs. Square
    add-on. Needs product decision first. *(3)*
12. **Admin members tab** (D9) on the partner admin page — list, status, next billing. *(3)*
13. **Webhook hardening** (D8). *(1)*

**Must total ≈ 14 pts, Should ≈ 6, Could ≈ 7.**

## Definition of done
- Sandbox: subscribe → Square charges → webhook → row `active` with `user_id` set → appears
  in account → pause / resume / cancel / update card all round-trip.
- Reconcile run fixes a deliberately dropped webhook.
- Production: one real staff subscription on the Horn, then canceled.
- `pnpm nx run mobile:typecheck` and `mobile:test` pass; built and deployed with prod env.

## Open questions for the team
- Who owns the Horn's Square account and can complete OAuth + plan setup?
- Keep the existing `square.link` buyers? They're one-off/externally managed — migrate them
  manually into Square subscriptions or leave them?
- VIP: separate tiers or add-on (item 11)?
- Do we need a sandbox Square app/credentials set up for local testing (`SQUARE_ENVIRONMENT`)?

## Rest of the backlog (context)
GitHub has 97 open issues; ~all are the **CYC platform** (Antaris replacement — MVP/Phase 0
milestones, mostly `sme-review` discovery items). None are Horn-related. Items worth pairing
with this sprint because they share the Square plumbing: #59 multiple cards on file, #28 E-POS.
Local-dev papercuts found while setting up: `.claude/launch.json` was macOS-only (Windows entry
added), Expo reports ~12 packages behind the expected SDK 55 patch versions, and `TODO.md`'s
missing-PDF list is still open.
