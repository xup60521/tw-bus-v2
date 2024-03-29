"use server";

import { get_access_token } from "@/lib/get_access_token";
import redis from "@/lib/redis";
import type { BusStops, Name } from "@/type/busType";

export async function getBusStops(bus: string, city: string) {
    const cache = await redis.hget(`Stops ${city}`, bus)
    if (cache) {
        return cache as BusStops[]
    }
  const access_token_res = await get_access_token();
  const access_token = access_token_res.access_token;
  if (city === "InterCity") {
    const res = await fetch(
        `https://tdx.transportdata.tw/api/basic/v2/Bus/StopOfRoute/InterCity?$filter=SubRouteName/Zh_tw eq '${bus}'&$select=RouteName,SubRouteName,Direction,Stops`,
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
          next: { revalidate: 43200 },
        }
      ).then((res) => {
        return res;
      });
      const data = (await res.json()) as (BusStops & {SubRouteName: Name})[];
      const addedName = data.map(d => {
        d.RouteName = d.SubRouteName
        return d
      })
      await redis.hset(`Stops InterCity`, { [bus]: addedName })
      return addedName;
  }
  const res = await fetch(
    `https://tdx.transportdata.tw/api/basic/v2/Bus/StopOfRoute/City/${city}/${bus}?$select=RouteName,Direction,Stops&$filter=RouteName/Zh_tw eq '${bus}'&$format=JSON`,
    {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
      next: { revalidate: 43200 },
    }
  ).then((res) => {
    return res;
  });
  const data = (await res.json()) as BusStops[];
  await redis.hset(`Stops ${city}`, { [bus]: data })
  return data;
}
