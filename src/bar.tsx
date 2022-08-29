/**
 * @file
 * @date 2022-08-29
 * @author xuejie.he
 * @lastModify xuejie.he 2022-08-29
 */
/* <------------------------------------ **** DEPENDENCE IMPORT START **** ------------------------------------ */
/** This section will include all the necessary dependence for this tsx file */
import React from "react";
import { createPortal } from "react-dom";
import { createPortalEl } from "./unit";
/* <------------------------------------ **** DEPENDENCE IMPORT END **** ------------------------------------ */
/* <------------------------------------ **** INTERFACE START **** ------------------------------------ */
/** This section will include all the interface for this tsx file */
interface TempProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;

    active?: boolean;
}
/* <------------------------------------ **** INTERFACE END **** ------------------------------------ */
/* <------------------------------------ **** FUNCTION COMPONENT START **** ------------------------------------ */
const Temp: React.FC<TempProps> = ({ children, active, className, ...props }) => {
    /* <------------------------------------ **** STATE START **** ------------------------------------ */
    /************* This section will include this component HOOK function *************/
    /* <------------------------------------ **** STATE END **** ------------------------------------ */
    /* <------------------------------------ **** PARAMETER START **** ------------------------------------ */
    /************* This section will include this component parameter *************/
    /* <------------------------------------ **** PARAMETER END **** ------------------------------------ */
    /* <------------------------------------ **** FUNCTION START **** ------------------------------------ */
    /************* This section will include this component general function *************/
    /* <------------------------------------ **** FUNCTION END **** ------------------------------------ */
    return (
        <>
            <div className={`bar_wrap${className ? ` ${className}` : ""}`} {...props}>
                <div className="bar_bg">
                    <div className="bar_bgStart" />
                    <div className="bar_bgContent" />
                    <div className="bar_bgEnd" />
                </div>
                <div className="bar_btn">
                    <div className="bar_btnStart" />
                    <div className="bar_btnContent">{children}</div>
                    <div className="bar_btnEnd" />
                </div>
            </div>
            {createPortal(<div className="bar_titleContent">{children}</div>, createPortalEl())}
        </>
    );
};
/* <------------------------------------ **** FUNCTION COMPONENT END **** ------------------------------------ */
export default Temp;
