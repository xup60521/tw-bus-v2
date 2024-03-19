"use client";

import type { BusRoutePassBy } from "@/type/busType";

export default function RemainningTime({
    EstimateTime,
    NextBusTime,
    StopStatus,
}: {
    StopStatus?: number;
    EstimateTime: BusRoutePassBy["EstimateTime"];
    NextBusTime: BusRoutePassBy["NextBusTime"];
}) {
    const min = Math.floor(Number(EstimateTime ?? 0) / 60);
    const color =
        min > 5 ? "bg-slate-100 text-slate-600" : "bg-red-200 text-red-900";

    if (EstimateTime) {
        return (
            <div className={`w-20 p-1 text-center h-full rounded ${color}`}>
                {`${min}`.padEnd(3, " ")}分鐘
            </div>
        );
    }

    if (EstimateTime === 0) {
        return (
            <div className={`w-20 p-1 text-center h-full rounded ${color}`}>
                進站中
            </div>
        );
    }

    if (!EstimateTime && NextBusTime) {
        const date = new Date(NextBusTime);
        const time = `${date.getHours()}:${date
            .getMinutes()
            .toString()
            .padStart(2, "0")}`;

        return (
            <div className="w-20 p-1 py-[0.125rem] text-center rounded-md border-slate-100 border-[1px] text-white">
                {time}
            </div>
        );
    }
    if (StopStatus === 1) {
        return <div className="w-20 rounded-md border-[1px] border-slate-100 p-1 py-[0.125rem] text-center text-white">
            未發車
        </div>
    }
    return (
        <div className="w-20 rounded-md border-[1px] border-slate-100 p-1 py-[0.125rem] text-center text-white">
            末班駛離
        </div>
    );
}
