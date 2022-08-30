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

        for (let i = 0; i < scaleArr.length; i++) {
            arr.push({
                value: scaleArr[i].value,
                min,
                max: scaleArr[i + 1] ? scaleArr[i + 1].bottom : Infinity,
                y: scaleArr[i].bottom,
            });
            min = scaleArr[i].bottom;
        }
        return [scaleData, arr];
    }, []);
};
