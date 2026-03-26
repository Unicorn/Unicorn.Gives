export {
  toHref,
  hrefToPathString,
  paths,
  routes,
  regionSubsegments,
  municipalSubsegments,
  isRegionStackDetailPath,
  isMunicipalStackDetailPath,
  isPathActive,
} from './paths';

export type { RegionSubsegment, MunicipalSubsegment, MunicipalSegment } from './paths';

export {
  navigationTree,
  authNav,
  type NavPillar,
  type NavLayer,
  type NavNodeMeta,
} from './routes.config';
