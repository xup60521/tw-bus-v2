"use client";

import type { BusEst, BusStops } from "@/type/busType";

export function useSeparateStops(busStops?: BusStops[], busEst?: BusEst[]) {
  const busStops0 = busStops?.find((item) => item.Direction === 0)?.Stops;
  const headto0 = busStops0?.sort((a, b) => b.StopSequence - a.StopSequence)[0]
    ?.StopName.Zh_tw;
  const busStops1 = busStops?.find((item) => item.Direction === 1)?.Stops;
  const headto1 = busStops1?.sort((a, b) => b.StopSequence - a.StopSequence)[0]
    ?.StopName.Zh_tw;
  const direction0 = busEst?.filter((item) => item.Direction === 0);
  const direction1 = busEst?.filter((item) => item.Direction === 1);
  const isOneWay =
    (busStops0?.length ?? 0) > 0 && (busStops1?.length ?? 0) > 0 ? false : true;
  return {
    busStops0,
    headto0,
    busStops1,
    headto1,
    direction0,
    direction1,
    isOneWay,
  };
}
