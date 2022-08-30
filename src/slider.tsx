/**
 * @file Slider
 * @date 2022-08-29
 * @author xuejie.he
 * @lastModify xuejie.he 2022-08-29
 */
/* <------------------------------------ **** DEPENDENCE IMPORT START **** ------------------------------------ */
/** This section will include all the necessary dependence for this tsx file */
import React, { useEffect, useRef, useState } from "react";
import Bar from "./bar";
import { ScoreRange } from "./type";
import { getScrollValue } from "./unit";
/* <------------------------------------ **** DEPENDENCE IMPORT END **** ------------------------------------ */
/* <------------------------------------ **** INTERFACE START **** ------------------------------------ */
/** This section will include all the interface for this tsx file */
interface TempProps {
    value: number;

    content: string;

    setValue: (res: number) => void;

    range?: ScoreRange[];

    handleFocus: (status: boolean) => void;

    active: boolean;
}
/* <------------------------------------ **** INTERFACE END **** ------------------------------------ */
/* <------------------------------------ **** FUNCTION COMPONENT START **** ------------------------------------ */
const Temp: React.FC<TempProps> = ({ value, content, setValue, range, handleFocus, active }) => {
    /* <------------------------------------ **** STATE START **** ------------------------------------ */
    /************* This section will include this component HOOK function *************/

    const ref = useRef<HTMLDivElement | null>(null);

    const [bottom, setBottom] = useState(() => {
        if (!range) {
            return 0;
        }
        let val = 0;
        for (let i = 0; i < range.length; ) {
            const item = range[i];
            if (item.value === value) {
                val = item.y;
                i = range.length;
            } else {
                ++i;
            }
        }
        return val;
    });

    /* <------------------------------------ **** STATE END **** ------------------------------------ */
    /* <------------------------------------ **** PARAMETER START **** ------------------------------------ */
    /************* This section will include this component parameter *************/

    useEffect(() => {
        setBottom(() => {
            if (!range) {
                return 0;
            }

            let val = 0;
            for (let i = 0; i < range.length; ) {
                const item = range[i];
                if (item.value === value) {
                    val = item.y;
                    i = range.length;
                } else {
                    ++i;
                }
            }
            return val;
        });
    }, [value, range]);

    /* <------------------------------------ **** PARAMETER END **** ------------------------------------ */
    /* <------------------------------------ **** FUNCTION START **** ------------------------------------ */
    /************* This section will include this component general function *************/

    const handleDragMove = (y: number) => {
        if (!range) {
            return;
        }
        const rect = ref.current?.getBoundingClientRect();
        if (!rect) {
            return;
        }
        const scrollData = getScrollValue();
        const bottom = rect.bottom + scrollData.y - y;
        let score = 0;
        for (let i = 0; i < range.length; ) {
            const item = range[i];
            if (item.min <= bottom && item.max > bottom) {
                i = range.length;
                score = item.value;
            } else {
                ++i;
            }
        }
        setValue(score);
    };

    /* <------------------------------------ **** FUNCTION END **** ------------------------------------ */
    return (
        <div className="slider_wrap">
            <div className="sliderValue">
                <span className="sliderValue_content">{value}</span>
            </div>
            <div className="slider_main" ref={ref}>
                <div className="slider_progress" style={{ height: `${bottom}px` }} />
                <Bar
                    onDragMove={handleDragMove}
                    active={active}
                    style={{ transform: `translateY(-${bottom}px)` }}
                    onBlur={() => handleFocus(false)}
                    onFocus={() => handleFocus(true)}
                >
                    <span
                        dangerouslySetInnerHTML={{
                            __html: content,
                        }}
                    />
                </Bar>
            </div>
        </div>
    );
};
/* <------------------------------------ **** FUNCTION COMPONENT END **** ------------------------------------ */
export default Temp;
