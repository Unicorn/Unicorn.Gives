import { MunicipalMinutesDetail } from '@/components/municipal/MunicipalMinutesDetail';
import { fetchMinutesStaticParams, scopeToParent } from '@/lib/static-build-queries';

export async function generateStaticParams(
  props: { params?: Record<string, string | string[]> } = {},
) {
  return scopeToParent(await fetchMinutesStaticParams(), props.params);
}

export default function Screen() {
  return <MunicipalMinutesDetail />;
}
