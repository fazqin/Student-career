import { companies as _companies, positions as _positions } from "../data/mockData";

const companies = _companies as any[];
const positions = _positions as any[];

export function getCompany(companyId: string) {
  return companies.find((c: any) => c.id === companyId);
}

export function getPosition(positionId: string) {
  return positions.find((p: any) => p.id === positionId);
}

export function getPositionCompany(positionId: string) {
  const pos = getPosition(positionId);
  if (!pos) return undefined;
  return getCompany(pos.companyId);
}
