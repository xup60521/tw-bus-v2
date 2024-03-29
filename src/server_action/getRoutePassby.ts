"use server";

import { get_access_token } from "@/lib/get_access_token";
import type { BusRoutePassBy, Name } from "@/type/busType";

export async function getRoutePassBy(city: string, stopName: string) {
  const access_token_res = await get_access_token();
  const access_token = access_token_res.access_token;
  if (city === "InterCity") {
    const res = await fetch(
        `https://tdx.transportdata.tw/api/basic/v2/Bus/EstimatedTimeOfArrival/InterCity?$format=JSON&$select=RouteName,StopName,Direction,NextBusTime,StopStatus,StopSequence,EstimateTime,SubRouteName&$filter=StopName/Zh_tw eq '${stopName}'`,
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      ).then((res) => {
        return res;
      });
      const data = (await res.json()) as (BusRoutePassBy & {SubRouteName: Name})[];
      const changeNamed = data.map(d => {
        d.RouteName = d.SubRouteName
        return d
      })
      return changeNamed;  
  }
  const res = await fetch(
    `https://tdx.transportdata.tw/api/basic/v2/Bus/EstimatedTimeOfArrival/City/${city}?$filter=StopName/Zh_tw eq '${stopName}'&$select=Direction,RouteName,NextBusTime,EstimateTime&$format=JSON`,
    {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    }
  ).then((res) => {
    return res;
  });
  const data = (await res.json()) as BusRoutePassBy[];
  return data;
}
