import { MunicipalOrdinancesDetail } from '@/components/municipal/MunicipalOrdinancesDetail';
import { fetchOrdinancesStaticParams } from '@/lib/static-build-queries';

export async function generateStaticParams() {
  return fetchOrdinancesStaticParams();
}

export default function Screen() {
  return <MunicipalOrdinancesDetail />;
}
