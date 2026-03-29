import { Redirect } from 'expo-router';

import { SeoHead } from '@/components/SeoHead';
import { getDefaultDescription } from '@/lib/seo';

export default function TabsIndex() {
  return (
    <>
      <SeoHead
        title="UNI Gives"
        description={getDefaultDescription()}
        appendSiteName={false}
      />
      <Redirect href="/home" />
    </>
  );
}
