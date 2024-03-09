"use client";

import { Icon } from "leaflet";
import type L from "leaflet";
import { useEffect, useRef } from "react";
import { Marker, Popup, Tooltip } from "react-leaflet";
import { useAtomValue } from "jotai";
import type { Unpacked } from "@/type/unpacked";
import type { BusStops } from "@/type/busType";
import { toggleStopAtom } from "@/state/busState";

export default function ShowMarker({
  item,
  station
}: {
  item: Unpacked<BusStops["Stops"]>;
  station: string;
}) {
  const ref = useRef<L.Marker>(null);
  const toggleStop = useAtomValue(toggleStopAtom)
  const icon = new Icon({
    iconUrl: "/pin_inv.png",
    iconSize: [16, 48],
  });
  const icon_blue = new Icon({
    iconUrl: "/pin_blue.png",
    iconSize: [32, 96],
  });

  useEffect(() => {
    if (toggleStop?.stopName === item.StopName.Zh_tw) {
      ref.current?.openPopup();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toggleStop]);

  return (
    <Marker
      ref={ref}
      riseOffset={-12}
      icon={station === item.StopName.Zh_tw ? icon_blue : icon}
      key={`${item.StopSequence}`}
      position={[item.StopPosition.PositionLat, item.StopPosition.PositionLon]}
    >
      <Popup>
        <div>
          <p>{`${item.StopSequence} ${item.StopName.Zh_tw}`}</p>
        </div>
      </Popup>
      <Tooltip permanent direction="bottom">
        <div>
          <p>{`${item.StopSequence}`}</p>
        </div>
      </Tooltip>
    </Marker>
  );
}
