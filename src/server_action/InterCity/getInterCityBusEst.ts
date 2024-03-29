"use server";

import { get_access_token } from "@/lib/get_access_token";
import { InterCityBusEstType } from "@/type/interCityBusType";

export async function getInterCityBusEst(bus: string) {
  const access_token_res = await get_access_token();
  const access_token = access_token_res.access_token;
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
  const data = (await res.json()) as InterCityBusEstType[];
  return data;
}
