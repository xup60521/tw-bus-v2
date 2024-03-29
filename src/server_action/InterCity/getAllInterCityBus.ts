"use server"

import { interCityBusList } from "@/lib/stableData"

export async function getAllInterCityBus() {
    const busList = interCityBusList
    return busList
}