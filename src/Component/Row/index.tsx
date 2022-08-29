/**
 * @file Row component
 * @date 2022-08-29
 * @author xuejie.he
 * @lastModify xuejie.he 2022-08-29
 */
/* <------------------------------------ **** DEPENDENCE IMPORT START **** ------------------------------------ */
/** This section will include all the necessary dependence for this tsx file */
import React, { forwardRef } from "react";
import { ColProps } from "../Col";
import "./style.scss";
/* <------------------------------------ **** DEPENDENCE IMPORT END **** ------------------------------------ */
/* <------------------------------------ **** INTERFACE START **** ------------------------------------ */
/** This section will include all the interface for this tsx file */
export interface RowProps extends React.HTMLAttributes<HTMLDivElement> {
    /**
     * children of this component
     */
    children: React.ReactElement<ColProps> | Array<React.ReactElement<ColProps>>;
    /**
     * Vertical align of this component
     */
    align?: "top" | "middle" | "bottom" | "stretch";
    /**
     * justify align of this component
     */
    justify?: "center" | "left" | "right";
    /**
     * className of this component
     */
    className?: string;
    /**
     * style of this component
     */
    style?: React.CSSProperties;
}
/* <------------------------------------ **** INTERFACE END **** ------------------------------------ */
/* <------------------------------------ **** FUNCTION COMPONENT START **** ------------------------------------ */
export const Row: React.FC<RowProps> = forwardRef<HTMLDivElement, RowProps>(
    ({ children, align = "top", justify = "left", className, ...props }, ref) => {
        Row.displayName = "Row";
        /* <------------------------------------ **** STATE START **** ------------------------------------ */
        /************* This section will include this component HOOK function *************/
        /* <------------------------------------ **** STATE END **** ------------------------------------ */
        /* <------------------------------------ **** PARAMETER START **** ------------------------------------ */
        /************* This section will include this component parameter *************/
        /* <------------------------------------ **** PARAMETER END **** ------------------------------------ */
        /* <------------------------------------ **** FUNCTION START **** ------------------------------------ */
        /************* This section will include this component general function *************/
        /* <------------------------------------ **** FUNCTION END **** ------------------------------------ */

        const arr = ["row_wrap"];
        arr.push(`row_align${align}`);
        arr.push(`row_justify${justify}`);
        className && arr.push(className);

        return (
            <div className={arr.join(" ")} ref={ref} {...props}>
                {children}
            </div>
        );
    },
);
/* <------------------------------------ **** FUNCTION COMPONENT END **** ------------------------------------ */
Row.displayName = "Row";
