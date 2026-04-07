/**
 * Public-facing bookings section for partner landing pages.
 * Displays available services synced from Square with search, sort, filter,
 * and optional grouping by Square catalog category.
 * Square remains the source of truth — all controls operate on cached data.
 */
import { useMemo, useState } from 'react';
import { View, Text, Pressable, ActivityIndicator, TextInput, ScrollView, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme, fonts, fontSize, spacing, radii, breakpoints, type ThemeColors } from '@/constants/theme';
import { useSquareServices, type SquareService, type SquareCategory } from '@/hooks/useSquareBookings';
import { useHydratedDimensions } from '@/hooks/useHydrated';
import { BookingFlow } from './BookingFlow';

interface BookingsSectionProps {
  partnerId: string;
}

type SortKey = 'default' | 'name' | 'price-asc' | 'price-desc' | 'duration-asc' | 'duration-desc';
const SORT_LABELS: Record<SortKey, string> = {
  'default': 'Featured',
  'name': 'Name (A–Z)',
  'price-asc': 'Price (low → high)',
  'price-desc': 'Price (high → low)',
  'duration-asc': 'Duration (short → long)',
  'duration-desc': 'Duration (long → short)',
};
const SORT_ORDER: SortKey[] = ['default', 'name', 'price-asc', 'price-desc', 'duration-asc', 'duration-desc'];

const UNCATEGORIZED = '__uncategorized__';

function formatDuration(ms: number | undefined): string {
  if (!ms) return '';
  const minutes = Math.round(ms / 60000);
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const rem = minutes % 60;
  return rem > 0 ? `${hours}h ${rem}m` : `${hours}h`;
}

function formatPrice(amount: number | undefined, _currency?: string): string {
  if (amount == null) return '';
  const dollars = (amount / 100).toFixed(2);
  return `$${dollars}`;
}

function getServicePriceCents(s: SquareService): number {
  return s.data.item_data?.variations?.[0]?.item_variation_data?.price_money?.amount ?? Number.POSITIVE_INFINITY;
}
function getServiceDurationMs(s: SquareService): number {
  return s.data.item_data?.variations?.[0]?.item_variation_data?.service_duration ?? Number.POSITIVE_INFINITY;
}
function getServiceCategoryIds(s: SquareService): string[] {
  const item = s.data.item_data;
  if (!item) return [];
  const ids = new Set<string>();
  if (item.category_id) ids.add(item.category_id);
  if (item.reporting_category?.id) ids.add(item.reporting_category.id);
  for (const c of item.categories ?? []) {
    if (c.id) ids.add(c.id);
  }
  return Array.from(ids);
}

export function BookingsSection({ partnerId }: BookingsSectionProps) {
  const { colors } = useTheme();
  const { width } = useHydratedDimensions();
  const columns = width >= breakpoints.desktop ? 3 : width >= breakpoints.tablet ? 2 : 1;
  const styles = useMemo(() => createStyles(colors), [colors]);
  const { services: allServices, teamMembers, categories, loading } = useSquareServices(partnerId);
  // Only show services that have at least one variation bookable online (Square's
  // per-variation `available_for_booking` flag). Square remains source of truth.
  const services = useMemo(
    () =>
      allServices.filter((s) =>
        s.data.item_data?.variations?.some(
          (v) => v.item_variation_data?.available_for_booking === true,
        ),
      ),
    [allServices],
  );
  const [selectedService, setSelectedService] = useState<SquareService | null>(null);

  const [query, setQuery] = useState('');
  const [sort, setSort] = useState<SortKey>('default');
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null); // null = all
  const [groupOverride, setGroupOverride] = useState<boolean | null>(null);

  // Only show categories that are actually referenced by at least one service.
  const activeCategories = useMemo<SquareCategory[]>(() => {
    const referenced = new Set<string>();
    for (const s of services) {
      for (const id of getServiceCategoryIds(s)) referenced.add(id);
    }
    return categories.filter((c) => referenced.has(c.square_id));
  }, [services, categories]);

  // Default: group when categories exist and no single-category filter is applied.
  // User can override with the Group toggle.
  const groupByCategory =
    groupOverride ?? (activeCategories.length > 1 && categoryFilter === null);

  const filteredSorted = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = services.filter((s) => {
      if (categoryFilter) {
        const ids = getServiceCategoryIds(s);
        if (!ids.includes(categoryFilter)) return false;
      }
      if (!q) return true;
      const name = s.data.item_data?.name?.toLowerCase() ?? '';
      const desc = s.data.item_data?.description?.toLowerCase() ?? '';
      return name.includes(q) || desc.includes(q);
    });

    const sorted = [...filtered];
    switch (sort) {
      case 'name':
        sorted.sort((a, b) => (a.data.item_data?.name ?? '').localeCompare(b.data.item_data?.name ?? ''));
        break;
      case 'price-asc':
        sorted.sort((a, b) => getServicePriceCents(a) - getServicePriceCents(b));
        break;
      case 'price-desc':
        sorted.sort((a, b) => getServicePriceCents(b) - getServicePriceCents(a));
        break;
      case 'duration-asc':
        sorted.sort((a, b) => getServiceDurationMs(a) - getServiceDurationMs(b));
        break;
      case 'duration-desc':
        sorted.sort((a, b) => getServiceDurationMs(b) - getServiceDurationMs(a));
        break;
      case 'default':
      default:
        sorted.sort((a, b) => a.display_order - b.display_order);
        break;
    }
    return sorted;
  }, [services, query, sort, categoryFilter]);

  const grouped = useMemo(() => {
    if (!groupByCategory) return null;
    const catNameById = new Map(activeCategories.map((c) => [c.square_id, c.display_name ?? 'Untitled']));
    const buckets = new Map<string, SquareService[]>();
    for (const s of filteredSorted) {
      const ids = getServiceCategoryIds(s);
      if (ids.length === 0) {
        const list = buckets.get(UNCATEGORIZED) ?? [];
        list.push(s);
        buckets.set(UNCATEGORIZED, list);
        continue;
      }
      // Put into first category it belongs to (primary).
      const primary = ids[0];
      const list = buckets.get(primary) ?? [];
      list.push(s);
      buckets.set(primary, list);
    }
    // Order groups: by category display_order, Uncategorized last.
    const orderedIds = activeCategories.map((c) => c.square_id).filter((id) => buckets.has(id));
    if (buckets.has(UNCATEGORIZED)) orderedIds.push(UNCATEGORIZED);
    return orderedIds.map((id) => ({
      id,
      name: id === UNCATEGORIZED ? 'Other' : (catNameById.get(id) ?? 'Untitled'),
      items: buckets.get(id)!,
    }));
  }, [filteredSorted, groupByCategory, activeCategories]);

  const cycleSort = () => {
    const idx = SORT_ORDER.indexOf(sort);
    setSort(SORT_ORDER[(idx + 1) % SORT_ORDER.length]);
  };

  const cardWidthStyle = { width: columns === 1 ? ('100%' as const) : (`${(100 - (columns - 1) * 1.5) / columns}%` as const) };

  const renderCard = (service: SquareService) => {
    const variation = service.data.item_data?.variations?.[0];
    const price = variation?.item_variation_data?.price_money;
    const duration = variation?.item_variation_data?.service_duration;
    return (
      <View key={service.id} style={cardWidthStyle}>
        <View style={styles.serviceCard}>
          <View style={styles.serviceInfo}>
            <Text style={styles.serviceName}>
              {service.data.item_data?.name ?? service.display_name}
            </Text>
            <View style={styles.serviceMeta}>
              {duration != null && (
                <View style={styles.metaItem}>
                  <MaterialIcons name="schedule" size={14} color={colors.neutralVariant} />
                  <Text style={styles.metaText}>{formatDuration(duration)}</Text>
                </View>
              )}
              {price?.amount != null && (
                <View style={styles.metaItem}>
                  <Text style={styles.priceText}>{formatPrice(price.amount, price.currency)}</Text>
                </View>
              )}
            </View>
            {service.data.item_data?.description && (
              <Text style={styles.serviceDesc} numberOfLines={2}>
                {service.data.item_data.description}
              </Text>
            )}
          </View>
          <Pressable style={styles.bookBtn} onPress={() => setSelectedService(service)}>
            <Text style={styles.bookBtnText}>Book</Text>
          </Pressable>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.inner}>
          <ActivityIndicator color={colors.primary} />
        </View>
      </View>
    );
  }

  if (services.length === 0) return null;

  return (
    <View style={styles.container}>
      <View style={styles.inner}>
        <Text style={styles.heading}>Book an Appointment</Text>
        <Text style={styles.subheading}>Select a service to get started</Text>

        {/* Toolbar: search + sort + group toggle */}
        <View style={styles.toolbar}>
          <View style={styles.searchWrap}>
            <MaterialIcons name="search" size={18} color={colors.neutralVariant} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search services"
              placeholderTextColor={colors.neutralVariant}
              value={query}
              onChangeText={setQuery}
            />
            {query.length > 0 && (
              <Pressable onPress={() => setQuery('')} hitSlop={8}>
                <MaterialIcons name="close" size={18} color={colors.neutralVariant} />
              </Pressable>
            )}
          </View>
          <Pressable style={styles.toolbarBtn} onPress={cycleSort}>
            <MaterialIcons name="swap-vert" size={16} color={colors.neutral} />
            <Text style={styles.toolbarBtnText}>{SORT_LABELS[sort]}</Text>
          </Pressable>
          {activeCategories.length > 1 && (
            <Pressable
              style={[styles.toolbarBtn, groupByCategory && styles.toolbarBtnActive]}
              onPress={() => setGroupOverride(!groupByCategory)}
            >
              <MaterialIcons
                name="view-agenda"
                size={16}
                color={groupByCategory ? colors.onPrimary : colors.neutral}
              />
              <Text style={[styles.toolbarBtnText, groupByCategory && styles.toolbarBtnTextActive]}>
                Group
              </Text>
            </Pressable>
          )}
        </View>

        {/* Category filter chips */}
        {activeCategories.length > 0 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.chipsRow}
          >
            <Pressable
              style={[styles.chip, categoryFilter === null && styles.chipActive]}
              onPress={() => setCategoryFilter(null)}
            >
              <Text style={[styles.chipText, categoryFilter === null && styles.chipTextActive]}>
                All ({services.length})
              </Text>
            </Pressable>
            {activeCategories.map((c) => {
              const count = services.filter((s) => getServiceCategoryIds(s).includes(c.square_id)).length;
              const active = categoryFilter === c.square_id;
              return (
                <Pressable
                  key={c.square_id}
                  style={[styles.chip, active && styles.chipActive]}
                  onPress={() => setCategoryFilter(active ? null : c.square_id)}
                >
                  <Text style={[styles.chipText, active && styles.chipTextActive]}>
                    {c.display_name ?? 'Untitled'} ({count})
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        )}

        {/* Results */}
        {filteredSorted.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No services match your filters.</Text>
          </View>
        ) : grouped ? (
          grouped.map((group) => (
            <View key={group.id} style={styles.group}>
              <View style={styles.groupHeader}>
                <View style={styles.groupHeadingRow}>
                  <Text style={styles.groupHeading}>{group.name}</Text>
                  <View style={styles.groupCountBadge}>
                    <Text style={styles.groupCountText}>{group.items.length}</Text>
                  </View>
                </View>
                <View style={styles.groupRule} />
              </View>
              <View style={styles.serviceGrid}>{group.items.map(renderCard)}</View>
            </View>
          ))
        ) : (
          <View style={styles.serviceGrid}>{filteredSorted.map(renderCard)}</View>
        )}
      </View>

      {selectedService && (
        <BookingFlow
          partnerId={partnerId}
          service={selectedService}
          teamMembers={teamMembers}
          onClose={() => setSelectedService(null)}
        />
      )}
    </View>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      paddingHorizontal: spacing.xl,
      paddingVertical: spacing.xxxl + 16,
      backgroundColor: colors.surfaceContainer,
    },
    inner: {
      maxWidth: 1000,
      alignSelf: 'center',
      width: '100%' as any,
    },
    heading: {
      fontFamily: fonts.sansBold,
      fontSize: 32,
      color: colors.neutral,
      marginBottom: spacing.xs,
    },
    subheading: {
      fontFamily: fonts.sans,
      fontSize: fontSize.md,
      color: colors.neutralVariant,
      marginBottom: spacing.lg,
    },
    toolbar: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      alignItems: 'center',
      gap: spacing.sm,
      marginBottom: spacing.md,
    },
    searchWrap: {
      flex: 1,
      minWidth: 200,
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.outlineVariant,
      borderRadius: radii.sm,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
    },
    searchInput: {
      flex: 1,
      fontFamily: fonts.sans,
      fontSize: fontSize.md,
      color: colors.neutral,
      padding: 0,
    },
    toolbarBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      borderRadius: radii.sm,
      borderWidth: 1,
      borderColor: colors.outlineVariant,
      backgroundColor: colors.surface,
    },
    toolbarBtnActive: {
      backgroundColor: colors.heroBar,
      borderColor: colors.heroBar,
    },
    toolbarBtnText: {
      fontFamily: fonts.sansMedium,
      fontSize: fontSize.sm,
      color: colors.neutral,
    },
    toolbarBtnTextActive: {
      color: colors.onPrimary,
    },
    chipsRow: {
      gap: spacing.xs,
      paddingBottom: spacing.md,
    },
    chip: {
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.xs + 2,
      borderRadius: radii.pill,
      borderWidth: 1,
      borderColor: colors.outlineVariant,
      backgroundColor: colors.surface,
      marginRight: spacing.xs,
    },
    chipActive: {
      backgroundColor: colors.heroBar,
      borderColor: colors.heroBar,
    },
    chipText: {
      fontFamily: fonts.sansMedium,
      fontSize: fontSize.sm,
      color: colors.neutral,
    },
    chipTextActive: {
      color: colors.onPrimary,
    },
    group: {
      marginTop: spacing.xl,
    },
    groupHeader: {
      marginBottom: spacing.md,
    },
    groupHeadingRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
      marginBottom: spacing.sm,
    },
    groupHeading: {
      fontFamily: fonts.sansBold,
      fontSize: fontSize.lg,
      color: colors.neutral,
    },
    groupCountBadge: {
      paddingHorizontal: spacing.sm,
      paddingVertical: 2,
      borderRadius: radii.pill,
      backgroundColor: colors.surfaceContainerHigh,
      borderWidth: 1,
      borderColor: colors.outlineVariant,
    },
    groupCountText: {
      fontFamily: fonts.sansMedium,
      fontSize: fontSize.xs,
      color: colors.neutralVariant,
    },
    groupRule: {
      height: 1,
      backgroundColor: colors.outlineVariant,
    },
    empty: {
      paddingVertical: spacing.xxl,
      alignItems: 'center',
    },
    emptyText: {
      fontFamily: fonts.sans,
      fontSize: fontSize.md,
      color: colors.neutralVariant,
    },
    serviceGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing.md,
    },
    serviceCard: {
      flex: 1,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.outlineVariant,
      borderRadius: radii.md,
      padding: spacing.lg,
      gap: spacing.lg,
    },
    serviceInfo: {
      flex: 1,
    },
    serviceName: {
      fontFamily: fonts.sansBold,
      fontSize: fontSize.lg,
      color: colors.neutral,
    },
    serviceMeta: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
      marginTop: spacing.xs,
    },
    metaItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    metaText: {
      fontFamily: fonts.sans,
      fontSize: fontSize.sm,
      color: colors.neutralVariant,
    },
    priceText: {
      fontFamily: fonts.sansBold,
      fontSize: fontSize.md,
      color: colors.primary,
    },
    serviceDesc: {
      fontFamily: fonts.sans,
      fontSize: fontSize.sm,
      color: colors.neutralVariant,
      lineHeight: 20,
      marginTop: spacing.xs,
    },
    bookBtn: {
      backgroundColor: colors.primary,
      paddingVertical: spacing.sm + 2,
      borderRadius: radii.sm,
      alignItems: 'center',
    },
    bookBtnText: {
      fontFamily: fonts.sansMedium,
      fontSize: fontSize.md,
      color: colors.onPrimary,
    },
  });
