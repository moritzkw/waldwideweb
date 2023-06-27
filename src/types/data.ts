export interface Measurement {
  UUID: string;
  measuredAt: string;
  value: string;
}

export interface Data {
  type: string;
  data: [{
    meshNodeUUID: string;
    measurements: Measurement[];
  }];
}
