"use client";

import { toast } from "@/components/ui/use-toast";
import {    
    // overlayAtom,
    useBusStopsGeoStore,
    useOverlayStore,
} from "@/state/busState";
import { useAtom, useAtomValue } from "jotai";
import { useSearchParams } from "next/navigation";

export const useOverlay = ({ city }: { city: string }) => {
    //   const busStops = useAtomValue(busStopsAtom);
    //   const busShape = useAtomValue(busShapeAtom);
    const { busShape, busStops } = useBusStopsGeoStore();
    const {busOverlay, addOverlay, removeOverlay} = useOverlayStore()
    const searchParams = useSearchParams();
    const direction = searchParams.get("direction") ?? "";
    const bus = searchParams.get("bus") ?? "";
    const add_remove_overlay = () => {
        const thisStops = busStops?.find(
            (d) =>
                d.Direction === Number(direction) && d.RouteName.Zh_tw === bus
        );
        const thisShape = busShape.find(
            (d) =>
                d.Direction === Number(direction) && d.RouteName.Zh_tw === bus
        );
        // add

        if (
            !busOverlay[city]?.find(
                (d) =>
                    d.RouteName.Zh_tw === bus &&
                    d.Direction === Number(direction)
            ) &&
            !!thisStops &&
            !!thisShape
        ) {
            const data = {
                ...thisShape,
                Stops: thisStops.Stops,
                ShowOverlay: true,
            }
            addOverlay(city, data)
            toast({
                title: "新增成功",
                description: `${bus}（${thisStops.Stops[0].StopName.Zh_tw} - ${
                    thisStops.Stops[thisStops.Stops.length - 1].StopName.Zh_tw
                }）`,
                className: "bg-lime-200",
            });
            return;
        }
        //remove
        if (
            busOverlay[city]?.find(
                (d) =>
                    d.RouteName.Zh_tw === bus &&
                    d.Direction === Number(direction)
            )
        ) {
           removeOverlay(city, bus, direction)
            const thisStops = busStops?.find(
                (d) => d.Direction === Number(direction)
            );
            const sign = `${bus}（${thisStops?.Stops[0].StopName.Zh_tw} - ${
                thisStops?.Stops[thisStops?.Stops.length - 1].StopName.Zh_tw
            }）`;
            toast({
                title: "刪除成功",
                description: sign,
                className: "bg-red-100",
            });
            return;
        }
    };
    return add_remove_overlay;
};
