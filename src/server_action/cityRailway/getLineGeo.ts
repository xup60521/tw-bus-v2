"use server"

import { cityRailwayGeo } from "@/lib/LineData"
import type { CityRailwayGeo } from "@/type/cityRailwayType"

export async function getLineGeo(systemList: string[]) {
    const data = {} as { [key: string]: (CityRailwayGeo )[] }
    systemList.forEach(d => {
        data[d] = cityRailwayGeo[d]
    })
    return data
}