import { useMemo } from "react";
import { ScaleAttr, ScoreRange } from "../type";
import { setScale } from "./../unit";

export const useRuler = (): undefined | [ScaleAttr, ScoreRange[]] => {
    return useMemo(() => {
        const scaleData = setScale();
        if (!scaleData) {
            return;
        }

        const scaleArr = scaleData.scale;

        const arr: ScoreRange[] = [];
        let min = -Infinity;

        const start = scaleArr?.[0].bottom ?? 0;
        const end = scaleArr?.[1].bottom ?? 0;
        const s = (end - start) / 2;

        for (let i = 0; i < scaleArr.length; i++) {
            arr.push({
                value: scaleArr[i].value,
                min,
                max: scaleArr[i + 1] ? scaleArr[i].bottom + s : Infinity,
                x: scaleArr[i].bottom,
            });
            min = scaleArr[i].bottom + s;
        }
        return [scaleData, arr];
    }, []);
};
