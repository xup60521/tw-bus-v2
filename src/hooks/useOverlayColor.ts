"use client"

import seedrandom from "seedrandom";

export function useOverlayColor() {
    function getColor(routeName: string) {
      const color_r = Math.floor(
          256 * seedrandom(routeName + "r")()
        )
          .toString(16)
          .padStart(2, "0");
        const color_g = Math.floor(
          256 * seedrandom(routeName + "g")()
        )
          .toString(16)
          .padStart(2, "0");
        const color_b = Math.floor(
          256 * seedrandom(routeName + "b")()
        )
          .toString(16)
          .padStart(2, "0");
        const color = `#${color_r}${color_g}${color_b}`;
        return color
    }
    return getColor
}