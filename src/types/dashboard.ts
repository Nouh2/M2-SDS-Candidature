export type DepartmentMetrics = {
  code: string;
  name: string;
  pm25_mean: number;
  asthma_hospitalization_rate: number;
};

export type DashboardData = {
  metadata: {
    generated_at: string;
    seed: number;
    scope: string;
    is_mock_data: boolean;
    units: {
      pm25_mean: string;
      asthma_hospitalization_rate: string;
    };
  };
  global_metrics: {
    department_count: number;
    pearson_r: number;
    p_value: number;
    interpretation: string;
  };
  departments: DepartmentMetrics[];
};
