/**
 * @file Slider
 * @date 2022-08-29
 * @author xuejie.he
 * @lastModify xuejie.he 2022-08-29
 */
/* <------------------------------------ **** DEPENDENCE IMPORT START **** ------------------------------------ */
/** This section will include all the necessary dependence for this tsx file */
import React, { useState } from "react";
import Bar from "./bar";
import { ScaleAttr, ScoreRange } from "./type";
/* <------------------------------------ **** DEPENDENCE IMPORT END **** ------------------------------------ */
/* <------------------------------------ **** INTERFACE START **** ------------------------------------ */
/** This section will include all the interface for this tsx file */
interface TempProps {
    value: number;

    content: string;

    setValue: (res: number) => void;

    range?: ScoreRange[];
}
/* <------------------------------------ **** INTERFACE END **** ------------------------------------ */
/* <------------------------------------ **** FUNCTION COMPONENT START **** ------------------------------------ */
const Temp: React.FC<TempProps> = ({ value, content, setValue, range }) => {
    /* <------------------------------------ **** STATE START **** ------------------------------------ */
    /************* This section will include this component HOOK function *************/
    /* <------------------------------------ **** STATE END **** ------------------------------------ */
    /* <------------------------------------ **** PARAMETER START **** ------------------------------------ */
    /************* This section will include this component parameter *************/
    /* <------------------------------------ **** PARAMETER END **** ------------------------------------ */
    /* <------------------------------------ **** FUNCTION START **** ------------------------------------ */
    /************* This section will include this component general function *************/
    console.log("ruler", JSON.stringify(range));
    /* <------------------------------------ **** FUNCTION END **** ------------------------------------ */
    return (
        <div className="slider_wrap">
            <div className="sliderValue">{value}</div>
            <div className="slider_main">
                <Bar>
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
