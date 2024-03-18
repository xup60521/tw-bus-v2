"use client";

import { toast } from "@/components/ui/use-toast";
import { busStopsAtom, busShapeAtom, overlayAtom } from "@/state/busState";
import { useAtom, useAtomValue } from "jotai";
import { useSearchParams } from "next/navigation";

export const useOverlay = ({ city }: { city: string }) => {
  const busStops = useAtomValue(busStopsAtom);
  const busShape = useAtomValue(busShapeAtom);
  const [busOverlay, setBusOverlay] = useAtom(overlayAtom);
  const searchParams = useSearchParams();
  const direction = searchParams.get("direction") ?? "";
  const bus = searchParams.get("bus") ?? "";
  const add_remove_overlay = () => {
    const thisStops = busStops?.find((d) => d.Direction === Number(direction) && d.RouteName.Zh_tw === bus);
    const thisShape = busShape.find((d) => d.Direction === Number(direction) && d.RouteName.Zh_tw === bus);
    // add
    
    if (
      !busOverlay[city]?.find(
        (d) => d.RouteName.Zh_tw === bus && d.Direction === Number(direction)
      ) &&
      !!thisStops &&
      !!thisShape
    ) {
      setBusOverlay((prev) => {
        prev[city] = [
          ...(prev[city] ?? []),
          {
            ...thisShape,
            Stops: thisStops.Stops,
            ShowOverlay: true,
          },
        ];
        return {
          ...prev,
        };
      });
      toast({
        title: "新增成功",
        description: `${bus}（${thisStops.Stops[0].StopName.Zh_tw} - ${
          thisStops.Stops[thisStops.Stops.length - 1].StopName.Zh_tw
        }）`,
        className: "bg-lime-200",
      });
      return ;
    }
    //remove
    if (
      busOverlay[city]?.find(
        (d) => d.RouteName.Zh_tw === bus && d.Direction === Number(direction)
      )
    ) {
      setBusOverlay((prev) => {
        const filtered = (prev[city] ?? []).filter(
          (item) =>
            item.Direction !== Number(direction) || item.RouteName.Zh_tw !== bus
        );
        prev[city] = filtered;
        return { ...prev };
      });
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
      return ;
    }
  };
  return add_remove_overlay;
};
