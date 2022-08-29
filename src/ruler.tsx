/**
 * @file
 * @date 2022-08-12
 * @author xuejie.he
 * @lastModify xuejie.he 2022-08-12
 */
/* <------------------------------------ **** DEPENDENCE IMPORT START **** ------------------------------------ */
/** This section will include all the necessary dependence for this tsx file */
import React from "react";
import { comms } from ".";
import { ScaleProps } from "./type";
/* <------------------------------------ **** DEPENDENCE IMPORT END **** ------------------------------------ */
/* <------------------------------------ **** INTERFACE START **** ------------------------------------ */
/** This section will include all the interface for this tsx file */

interface TempProps {
    scales: Array<ScaleProps>;
}
/* <------------------------------------ **** INTERFACE END **** ------------------------------------ */
/* <------------------------------------ **** FUNCTION COMPONENT START **** ------------------------------------ */
const Temp: React.FC<TempProps> = ({ scales }) => {
    return (
        <div className="ruler_wrap">
            {scales.map((item) => {
                if (item.status === 2 || item.status === 1) {
                    return (
                        <div
                            className="scaleItem_big"
                            key={`scale${item.value}`}
                            style={{
                                bottom: `${item.bottom}px`,
                            }}
                        >
                            <div className="scaleItem_icon" />
                            {item.status === 2 && (
                                <div
                                    className="scaleItemValue"
                                    ref={(el) => {
                                        if (item.value !== comms.config.totalScore) {
                                            return;
                                        }
                                        if (!el) {
                                            return;
                                        }
                                    }}
                                >
                                    {item.value}
                                </div>
                            )}
                        </div>
                    );
                }
                return (
                    <div
                        className="scaleItem"
                        key={`scale${item.value}`}
                        style={{
                            bottom: `${item.bottom}px`,
                        }}
                    />
                );
            })}
        </div>
    );
};
/* <------------------------------------ **** FUNCTION COMPONENT END **** ------------------------------------ */
export default Temp;
