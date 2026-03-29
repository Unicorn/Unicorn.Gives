import { MunicipalHub } from '@/components/municipal/MunicipalHub';
import { fetchMunicipalityParams } from '@/lib/static-build-queries';

export async function generateStaticParams() {
  return fetchMunicipalityParams();
}

export default function Screen() {
  return <MunicipalHub />;
}
