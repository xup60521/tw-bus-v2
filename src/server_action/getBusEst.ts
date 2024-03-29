"use server";

import { get_access_token } from "@/lib/get_access_token";
import type { BusEst, Name } from "@/type/busType";

export async function getBusEst(city: string, bus: string) {
  const access_token_res = await get_access_token();
  const access_token = access_token_res.access_token;
  if (city === "InterCity") {
    const res = await fetch(
        `https://tdx.transportdata.tw/api/basic/v2/Bus/EstimatedTimeOfArrival/InterCity?$format=JSON&$select=RouteName,StopName,Direction,NextBusTime,StopStatus,StopSequence,EstimateTime,SubRouteName&$filter=SubRouteName/Zh_tw eq '${bus}'`,
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      ).then((res) => {
        return res;
      });
      const data = (await res.json()) as (BusEst & {SubRouteName: Name})[]
      return data.map(d => {
        d.RouteName = d.SubRouteName
        return d
      })
  }
  const res = await fetch(
    `https://tdx.transportdata.tw/api/basic/v2/Bus/EstimatedTimeOfArrival/City/${city}/${bus}?$select=RouteName,StopName,Direction,NextBusTime,StopStatus,StopSequence,EstimateTime&$filter=RouteName/Zh_tw eq '${bus}'&$format=JSON`,
    {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    }
  ).then((res) => {
    return res;
  });
  const data = (await res.json()) as BusEst[];
  return data;
}
