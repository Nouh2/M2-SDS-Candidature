import type { Feature, FeatureCollection, Geometry } from "geojson";

type DepartmentProperties = {
  code: string;
  nom: string;
  region: string;
};

export type DepartmentFeature = Feature<
  Geometry,
  DepartmentProperties
>;

export type DepartmentFeatureCollection = FeatureCollection<
  Geometry,
  DepartmentProperties
>;
