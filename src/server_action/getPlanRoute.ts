"use server";

import { get_access_token } from "@/lib/get_access_token";
import type { SearchBus } from "@/type/busType";

export async function getPlanRoute(city: string, stop1: string, stop2: string) {
  const access_token_res = await get_access_token();
  const access_token = access_token_res.access_token;
  const res = await fetch(
    `https://tdx.transportdata.tw/api/basic/v2/Bus/StopOfRoute/City/${city}?$select=RouteName,Direction&$filter=Stops/any(d:d/StopName/Zh_tw eq '${stop1}') and Stops/any(d:d/StopName/Zh_tw eq '${stop2}')&$format=JSON`,
    {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
      next: { revalidate: 43200 },
    }
  ).then((res) => {
    return res;
  });
  
  const data = (await res.json()) as SearchBus[];
//   console.log(data);
  return data;
}
