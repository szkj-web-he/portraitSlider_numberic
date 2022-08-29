/**
 * @file col components
 * @date 2022-08-29
 * @author xuejie.he
 * @lastModify xuejie.he 2022-08-29
 */
/* <------------------------------------ **** DEPENDENCE IMPORT START **** ------------------------------------ */
/** This section will include all the necessary dependence for this tsx file */
import React, { forwardRef } from "react";
import "./style.scss";
/* <------------------------------------ **** DEPENDENCE IMPORT END **** ------------------------------------ */
/* <------------------------------------ **** INTERFACE START **** ------------------------------------ */
/** This section will include all the interface for this tsx file */
export interface ColProps {
    /**
     * span of this component
     */
    span?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
    /**
     * order of this component
     */
    order?: number;
    /**
     * children of this component
     */
    children?: React.ReactNode;
    /**
     * className of this component
     */
    className?: string;
    /**
     * style of this component
     */
    style?: React.CSSProperties;
    /**
     * margin-left of this component
     */
    left?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;
    /**
     * margin-right of this component
     */
    right?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;
}
/* <------------------------------------ **** INTERFACE END **** ------------------------------------ */
/* <------------------------------------ **** FUNCTION COMPONENT START **** ------------------------------------ */
export const Col = forwardRef<HTMLDivElement, ColProps>(
    ({ span = 0, order, children, className, style, left, right }, ref) => {
        Col.displayName = "Col";
        /* <------------------------------------ **** STATE START **** ------------------------------------ */
        /************* This section will include this component HOOK function *************/
        /* <------------------------------------ **** STATE END **** ------------------------------------ */
        /* <------------------------------------ **** PARAMETER START **** ------------------------------------ */
        /************* This section will include this component parameter *************/
        /* <------------------------------------ **** PARAMETER END **** ------------------------------------ */
        /* <------------------------------------ **** FUNCTION START **** ------------------------------------ */
        /************* This section will include this component general function *************/

        const arr = [`col_wrap${span}`];
        className && arr.push(className);
        left && arr.push(`col_left${left}`);
        right && arr.push(`col_right${right}`);

        /* <------------------------------------ **** FUNCTION END **** ------------------------------------ */
        return (
            <div
                className={arr.join(" ")}
                ref={ref}
                style={Object.assign({}, style, {
                    order,
                })}
            >
                {children}
            </div>
        );
    },
);
/* <------------------------------------ **** FUNCTION COMPONENT END **** ------------------------------------ */
Col.displayName = "Col";
