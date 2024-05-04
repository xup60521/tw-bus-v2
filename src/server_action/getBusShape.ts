"use server";

import { get_access_token } from "@/lib/get_access_token";
import redis from "@/lib/redis";
import type { BusGeo, Name } from "@/type/busType";

export async function getBusShape(bus: string, city: string) {
    const cache = await redis.hget(`Geo ${city}`, bus);
    if (cache && !Array.isArray(cache)) {
        await redis.hdel(`Geo ${city}`, bus);
    }
    if (Array.isArray(cache)) {
        return cache as BusGeo[];
    }
    const access_token_res = await get_access_token();
    const access_token = access_token_res.access_token;
    if (city === "InterCity") {
        const res = await fetch(
            `
    https://tdx.transportdata.tw/api/basic/v2/Bus/Shape/InterCity?$select=Direction,RouteName,Geometry,SubRouteName&$format=JSON&$filter=SubRouteName/Zh_tw eq '${bus}'
    `,
            {
                headers: {
                    Authorization: `Bearer ${access_token}`,
                },
                next: { revalidate: 43200 },
            }
        ).then((res) => {
            return res;
        });
        const data = (await res.json()) as (BusGeo & { SubRouteName: Name })[];
        const addedName = data.map(d => {
            d.RouteName = d.SubRouteName
            return d
        })
        if (Array.isArray(addedName)) {
            await redis.hset(`Geo InterCity`, { [bus]: addedName });
            return addedName;
        }
        return undefined
    }
    const res = await fetch(
        `https://tdx.transportdata.tw/api/basic/v2/Bus/Shape/City/${city}/${bus}?$select=Direction,RouteName,Geometry&$filter=RouteName/Zh_tw eq '${bus}'&$format=JSON`,
        {
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
            next: { revalidate: 43200 },
        }
    ).then((res) => {
        return res;
    });
    const data = (await res.json()) as BusGeo[];
    if (Array.isArray(data)) {
        await redis.hset(`Geo ${city}`, { [bus]: data });
        return data;
    }
    return undefined
}
