import { useQuery } from 'react-query';
import { getChileLocations, listProvincesByRegion, listCommunesByProvince } from '../services/chileLocationsService';

export function useChileLocations() {
  const query = useQuery(['chile-locations'], () => getChileLocations(), {
    staleTime: 1000 * 60 * 60 * 24, // 24h
    cacheTime: 1000 * 60 * 60 * 24,
  });

  return {
    ...query,
    regions: query.data?.regions ?? [],
    allCommunes: query.data?.communes ?? [],
    getProvinces: (regionCode: string) => query.data ? listProvincesByRegion(regionCode, query.data) : [], // legacy (puede seguir usándose)
    getCommunes: (provinceCode: string) => query.data ? listCommunesByProvince(provinceCode, query.data) : [],
  };
}
