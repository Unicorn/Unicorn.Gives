import { MunicipalMinutesDetail } from '@/components/municipal/MunicipalMinutesDetail';
import { fetchMinutesStaticParams } from '@/lib/static-build-queries';

export async function generateStaticParams() {
  return fetchMinutesStaticParams();
}

export default function Screen() {
  return <MunicipalMinutesDetail />;
}
