"use server";

import { get_access_token } from "@/lib/get_access_token";
import type { BusSchedule } from "@/type/busType";

export async function getBusSchedule(city: string, bus: string) {
    const access_token_res = await get_access_token();
    const access_token = access_token_res.access_token;
    if (city === "InterCity") {
        const res = await fetch(
            `https://tdx.transportdata.tw/api/basic/v2/Bus/Schedule/InterCity?$filter=SubRouteName/Zh_tw eq '${bus}'&$select=Direction,RouteName,Frequencys,TimeTables&$format=JSON,`,
            {
                headers: {
                    Authorization: `Bearer ${access_token}`,
                },
                next: { revalidate: 43200 },
            }
        ).then((res) => {
            return res;
        });
        const data = (await res.json()) as BusSchedule[];
        return data;
    }
    const res = await fetch(
        `https://tdx.transportdata.tw/api/basic/v2/Bus/Schedule/City/${city}/${bus}?$select=Direction,RouteName,Frequencys,TimeTables&$filter=RouteName/Zh_tw eq '${bus}'&$format=JSON`,
        {
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
            next: { revalidate: 43200 },
        }
    ).then((res) => {
        return res;
    });
    const data = (await res.json()) as BusSchedule[];
    return data;
}
