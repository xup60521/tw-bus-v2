"use server"

import { get_access_token } from "@/lib/get_access_token"
import redis from "@/lib/redis"
import { InterCityBusStopsType } from "@/type/interCityBusType"

export async function getInterCityBusStops(bus: string) {
    const cache = await redis.hget(`Stops InterCity`, bus)
    if (cache) {
        return cache as InterCityBusStopsType[]
    }
    const access_token_res = await get_access_token();
  const access_token = access_token_res.access_token;
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
  const data = (await res.json()) as InterCityBusStopsType[];
  await redis.hset(`Stops InterCity`, { [bus]: data })
  return data;
}