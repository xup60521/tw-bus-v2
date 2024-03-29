'use server'

import { get_access_token } from "@/lib/get_access_token"
import { InterCityBusScheduleType } from "@/type/interCityBusType"

export async function getInterCityBusSchedule(SubRouteName: string) {
    const access_token_res = (await get_access_token())
    const access_token = access_token_res.access_token
    const res = await fetch(`https://tdx.transportdata.tw/api/basic/v2/Bus/Schedule/InterCity?$filter=SubRouteName/Zh_tw eq '${SubRouteName}'&$select=Direction,RouteName,Frequencys,TimeTables&$format=JSON,`, {
        headers: {
            "Authorization": `Bearer ${access_token}`
        },
        next: {revalidate: 43200}
    }).then(res => {
        return res
    })
    const data = await res.json() as InterCityBusScheduleType[]
    return data
}