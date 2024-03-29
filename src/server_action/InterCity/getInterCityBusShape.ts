'use server'

import { get_access_token } from "@/lib/get_access_token"
import redis from "@/lib/redis"
import { InterCityBusShapeType } from "@/type/interCityBusType"


export async function getInterCityBusShape(bus: string) {
    const cache = await redis.hget(`Geo InterCity`, bus)
    if (cache) {
        return cache as InterCityBusShapeType[]
    }
    const access_token_res = (await get_access_token())
    const access_token = access_token_res.access_token
    const res = await fetch(`
    https://tdx.transportdata.tw/api/basic/v2/Bus/Shape/InterCity?$select=Direction,RouteName,Geometry,SubRouteName&$format=JSON&$filter=SubRouteName/Zh_tw eq '${bus}'
    `, {
        headers: {
            "Authorization": `Bearer ${access_token}`
        },
        next: {revalidate: 43200}
    }).then(res => {
        return res
    })
    const data = await res.json() as InterCityBusShapeType[]
    await redis.hset(`Geo InterCity`, { [bus]: data })
    return data
}