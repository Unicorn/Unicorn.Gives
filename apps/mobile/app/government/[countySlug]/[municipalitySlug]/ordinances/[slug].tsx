import { MunicipalOrdinancesDetail } from '@/components/municipal/MunicipalOrdinancesDetail';
import { fetchOrdinancesStaticParams, scopeToParent } from '@/lib/static-build-queries';

export async function generateStaticParams(
  props: { params?: Record<string, string | string[]> } = {},
) {
  return scopeToParent(await fetchOrdinancesStaticParams(), props.params);
}

export default function Screen() {
  return <MunicipalOrdinancesDetail />;
}
