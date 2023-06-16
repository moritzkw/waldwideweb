export interface AggregateMeasurement {
    firstMeasurementAt: string,
    lastMeasurementAt: string,
    value: string,
}

export interface AggregatedData {
    aggregatedFunction: string,
    type: string,
    meshNodeUUIDs: string[],
    samples: AggregateMeasurement[]
}