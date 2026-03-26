import { ElectionsCenter } from '@/components/cms/ElectionsCenter';

export default function ElectionDetail() {
  // The legacy Astro site had a static elections landing page; we render the same center content here.
  return <ElectionsCenter variant="full" />;
}
