import { useMemo } from 'react';
import { Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Link } from 'expo-router';
import { AppHeader } from '@/components/layout/AppHeader';

type BoardMember = {
  name: string;
  title: string;
  phone: string;
  phoneTel?: string;
  email?: string | null;
  icon: string;
};

function toTelDigits(phone: string): string | undefined {
  // Handles strings like "(989) 588-9841 ext. 4"
  const digits = phone.match(/\d+/g);
  if (!digits || digits.length === 0) return undefined;
  if (digits.length === 1) return `tel:${digits[0]}`;
  const [main, ...rest] = digits;
  return rest.length > 0 ? `tel:${main};ext=${rest.join('')}` : `tel:${main}`;
}

export default function BoardPage() {
  const members = useMemo<BoardMember[]>(
    () => [
      {
        name: 'Troy Kibbey',
        title: 'Supervisor',
        phone: '(989) 588-9841 ext. 4',
        phoneTel: toTelDigits('(989) 588-9841 ext. 4'),
        icon: '👤',
      },
      {
        name: 'Carol Majewski',
        title: 'Clerk',
        phone: '989-588-9069',
        phoneTel: toTelDigits('989-588-9069'),
        email: 'clm@lincolntwp.com',
        icon: '📋',
      },
      {
        name: 'Maggie Carey',
        title: 'Treasurer',
        phone: '989-588-2574',
        phoneTel: toTelDigits('989-588-2574'),
        email: 'mc@lincolntwp.com',
        icon: '💰',
      },
      {
        name: 'Jeff Simons',
        title: 'Trustee',
        phone: '(989) 433-6069',
        phoneTel: toTelDigits('(989) 433-6069'),
        icon: '👤',
      },
      {
        name: 'Mike Tobin',
        title: 'Trustee',
        phone: '989-588-2311',
        phoneTel: toTelDigits('989-588-2311'),
        email: 'mtobin@lincolntwp.com',
        icon: '👤',
      },
    ],
    []
  );

  return (
    <View style={styles.page}>
      <AppHeader title="Board of Trustees" showBack={false} />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Board of Trustees</Text>

        <Text style={styles.intro}>
          The Lincoln Township Board of Trustees governs the township and makes policy decisions for our community.
        </Text>

        <View style={styles.grid}>
          {members.map((m) => (
            <View key={m.name} style={styles.card}>
              <Text style={styles.cardIcon} accessibilityRole="text">
                {m.icon}
              </Text>
              <Text style={styles.cardName}>{m.name}</Text>
              <Text style={styles.cardRole}>{m.title}</Text>
              <TouchableOpacity
                onPress={() => {
                  if (!m.phoneTel) return;
                  Linking.openURL(m.phoneTel);
                }}
                activeOpacity={m.phoneTel ? 0.7 : 1}
              >
                <Text style={styles.phone}>{m.phone}</Text>
              </TouchableOpacity>
              {m.email ? (
                <TouchableOpacity onPress={() => Linking.openURL(`mailto:${m.email}`)} activeOpacity={0.7}>
                  <Text style={styles.email}>{m.email}</Text>
                </TouchableOpacity>
              ) : null}
            </View>
          ))}
        </View>

        <View style={styles.meetingsSection}>
          <Text style={styles.sectionTitle}>Board Meetings</Text>
          <Text style={styles.sectionBody}>
            Regular board meetings are held throughout the year. Special meetings are posted at Township Hall at least 18 hours in advance.
          </Text>

          <Link href="/board-minutes" asChild>
            <TouchableOpacity style={styles.linkButton} activeOpacity={0.85}>
              <Text style={styles.linkButtonText}>View Meeting Minutes & Schedule →</Text>
            </TouchableOpacity>
          </Link>
        </View>

        <View style={styles.infoGrid}>
          <View style={styles.infoCard}>
            <Text style={styles.infoCardTitle}>Contact the Board</Text>
            <Text style={styles.infoCardBody}>
              For questions or concerns, please contact the Township Supervisor or attend a board meeting.
            </Text>
          </View>
          <View style={styles.infoCard}>
            <Text style={styles.infoCardTitle}>Accessibility</Text>
            <Text style={styles.infoCardBody}>
              Individuals with disabilities requiring auxiliary aids or services should contact Carol Majewski at{' '}
              <Text
                style={styles.inlineLink}
                onPress={() => Linking.openURL('tel:989-588-9069')}
              >
                989-588-9069
              </Text>{' '}
              or{' '}
              <Text
                style={styles.inlineLink}
                onPress={() => Linking.openURL('mailto:clm@lincolntwp.com')}
              >
                clm@lincolntwp.com
              </Text>
              .
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: '#fcf9f4' },
  content: { padding: 20, paddingBottom: 40, gap: 14 },
  title: { textAlign: 'center', fontSize: 26, fontWeight: '900', color: '#2d4a4a', marginTop: 6 },
  intro: { textAlign: 'center', fontSize: 15, color: '#43493e', lineHeight: 22, maxWidth: 800, alignSelf: 'center', marginBottom: 8 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 12 },
  card: { flexBasis: '48%', backgroundColor: '#fff', borderRadius: 14, padding: 16, borderWidth: 1, borderColor: '#c3c8bb' },
  cardIcon: { fontSize: 22, marginBottom: 6 },
  cardName: { fontSize: 16, fontWeight: '900', color: '#2d4a4a', marginBottom: 2 },
  cardRole: { fontSize: 13, fontWeight: '700', color: '#8a9a7c', marginBottom: 10 },
  phone: { fontSize: 14, fontWeight: '700', color: '#3d6060' },
  email: { fontSize: 14, fontWeight: '800', color: '#2d4a4a', marginTop: 4 },

  meetingsSection: { marginTop: 4, backgroundColor: '#f0ede8', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#c3c8bb' },
  sectionTitle: { fontSize: 20, fontWeight: '900', color: '#2d4a4a', marginBottom: 8 },
  sectionBody: { fontSize: 14, color: '#43493e', lineHeight: 22, marginBottom: 14 },
  linkButton: { backgroundColor: '#2d4a4a', borderRadius: 12, paddingVertical: 12, paddingHorizontal: 14, alignItems: 'center' },
  linkButtonText: { color: '#fcf9f4', fontWeight: '900' },

  infoGrid: { flexDirection: 'row', gap: 12, flexWrap: 'wrap', marginTop: 14 },
  infoCard: { flexBasis: '48%', backgroundColor: '#fff', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#c3c8bb' },
  infoCardTitle: { fontSize: 18, fontWeight: '900', color: '#2d4a4a', marginBottom: 8 },
  infoCardBody: { fontSize: 14, color: '#43493e', lineHeight: 22 },
  inlineLink: { color: '#3d6060', fontWeight: '900', textDecorationLine: 'underline' },
});

