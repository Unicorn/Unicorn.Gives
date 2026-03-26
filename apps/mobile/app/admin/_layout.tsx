/**
 * Auth gating audit (current phase)
 * Date: 2026-03-25
 *
 * Enforcement rule:
 * - Only `/admin/*` is protected.
 * - All other routes under `apps/mobile/app/**` are treated as public for now.
 *
 * How it's enforced:
 * - `/admin` is wrapped by `RequireAdmin` in this layout.
 * - No other route files apply auth guards yet.
 *
 * Current gated routes:
 * - `/admin/*`
 *
 * Current public routes (existing in this repo):
 * - `/` (from `(tabs)/index.tsx`)
 * - `/the-horn`
 * - `/the-horn/[tab]`
 * - `/the-mane`
 * - `/the-mane/[tab]`
 * - `/help`
 * - `/help/[slug]`
 * - `/contacts`
 * - `/board`
 * - `/board-minutes`
 * - `/news/[slug]`
 * - `/ordinances`
 * - `/ordinances/[slug]`
 * - `/elections`
 * - `/minutes`
 * - `/minutes/[slug]`
 * - `/county/.../(townships|cities|villages)/[entity]/elections.../[entity]` (county election stacks)
 *
 * Auth pages (public, used only for redirect targets):
 * - `/sign-in` (from `(auth)/sign-in.tsx`)
 * - `/sign-up` (from `(auth)/sign-up.tsx`)
 */
import { Stack } from 'expo-router';

import { RequireAdmin } from '@/lib/routeGuards';

export default function AdminLayout() {
  return (
    <RequireAdmin>
      <Stack screenOptions={{ headerShown: false }} />
    </RequireAdmin>
  );
}

