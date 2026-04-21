import type { DashboardData } from "../types/dashboard";

export async function loadDashboardData(): Promise<DashboardData> {
  const response = await fetch(`${import.meta.env.BASE_URL}data.json`);

  if (!response.ok) {
    throw new Error(`Failed to load dashboard data: ${response.status}`);
  }

  return (await response.json()) as DashboardData;
}
