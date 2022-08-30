/**
 * @file
 * @date 2022-08-25
 * @author xuejie.he
 * @lastModify xuejie.he 2022-08-25
 */
/* <------------------------------------ **** DEPENDENCE IMPORT START **** ------------------------------------ */
/** This section will include all the necessary dependence for this tsx file */
import React, { useEffect, useRef, useState } from "react";
import { ScrollComponent, ScrollProps } from "../../Scroll";
import Triangle from "./Unit/triangle";
import { JumpContext, JumpContextType } from "../Group/Unit/context";
import { getActiveStatus } from "./Unit/getActiveStatus";
import { getScrollBody } from "./Unit/getScrollBody";
import "./style.scss";
/* <------------------------------------ **** DEPENDENCE IMPORT END **** ------------------------------------ */
/* <------------------------------------ **** INTERFACE START **** ------------------------------------ */
/** This section will include all the interface for this tsx file */
/* <------------------------------------ **** INTERFACE END **** ------------------------------------ */
/* <------------------------------------ **** FUNCTION COMPONENT START **** ------------------------------------ */
const JumpWrap: React.FC<ScrollProps> = ({ children, style, ...props }) => {
    /* <------------------------------------ **** STATE START **** ------------------------------------ */
    /************* This section will include this component HOOK function *************/

    const [show, setShow] = useState(false);
    const [topActive, setTopActive] = useState(false);
    const [bottomActive, setBottomActive] = useState(false);

    const activeIndex = useRef(0);

    const ref = useRef<HTMLDivElement | null>(null);

    const timer = useRef<number>();

    const rowsRef = useRef<Array<HTMLElement | null>>([]);

    const rowTimer = useRef<number>();

    const [loading, setLoading] = useState(true);

    const [isBottom, setIsBottom] = useState(false);

    /* <------------------------------------ **** STATE END **** ------------------------------------ */
    /* <------------------------------------ **** PARAMETER START **** ------------------------------------ */
    /************* This section will include this component parameter *************/

    useEffect(() => {
        void document.fonts.ready.then(() => {
            setLoading(false);
        });
    }, []);

    useEffect(() => {
        return () => {
            timer.current && window.clearTimeout(timer.current);
            rowTimer.current && window.clearTimeout(rowTimer.current);
        };
    }, []);

    useEffect(() => {
        if (!loading) {
            const data = getActiveStatus(ref.current, rowsRef.current);
            setShow(data.overflow);
            setIsBottom(data.isBottom);
            activeIndex.current = data.active;
            setTopActive(data.active > 0);
            setBottomActive(data.active < rowsRef.current.length - 1);
        }
    }, [loading]);

    useEffect(() => {
        const fn = () => {
            const data = getActiveStatus(ref.current, rowsRef.current);
            setShow(data.overflow);
            activeIndex.current = data.active;
            setTopActive(data.active > 0);
            setBottomActive(data.active < rowsRef.current.length - 1);
        };
        let timer: null | number = null;
        const mainFn = () => {
            timer && window.clearTimeout(timer);
            timer = window.setTimeout(fn);
        };

        window.addEventListener("resize", mainFn);
        return () => {
            window.removeEventListener("resize", mainFn);
            timer && window.clearTimeout(timer);
        };
    }, []);

    /* <------------------------------------ **** PARAMETER END **** ------------------------------------ */
    /* <------------------------------------ **** FUNCTION START **** ------------------------------------ */
    /************* This section will include this component general function *************/
    const handleScroll = () => {
        timer.current && window.clearTimeout(timer.current);
        timer.current = window.setTimeout(() => {
            const data = getActiveStatus(ref.current, rowsRef.current);
            activeIndex.current = data.active;
            setTopActive(data.active > 0);
            setIsBottom(data.isBottom);
            setBottomActive(data.active < rowsRef.current.length - 1);
        });
    };

    const callback: JumpContextType = (index, el) => {
        if (loading) {
            return;
        }
        rowsRef.current[index] = el;
        rowTimer.current && window.clearTimeout(rowTimer.current);
        rowTimer.current = window.setTimeout(() => {
            const data = getActiveStatus(ref.current, rowsRef.current);
            setShow(data.overflow);
            activeIndex.current = data.active;
            setTopActive(data.active > 0);
            setIsBottom(data.isBottom);
            setBottomActive(data.active < rowsRef.current.length - 1);
        }, 17);
    };

    /* <------------------------------------ **** FUNCTION END **** ------------------------------------ */
    return (
        <JumpContext.Provider value={callback}>
            <ScrollComponent
                handleBarChange={handleScroll}
                style={style}
                ref={ref}
                hidden={{ x: true }}
                {...props}
            >
                {children}
            </ScrollComponent>
            {show && (
                <div className="floating_button">
                    <div
                        className="toTop_button"
                        onClick={() => {
                            if (!topActive) {
                                return;
                            }

                            const scrollBody = getScrollBody(ref.current);
                            if (!scrollBody) {
                                return;
                            }
                            scrollBody.scrollTo({
                                top: rowsRef.current[activeIndex.current - 1]?.offsetTop ?? 0,
                                behavior: "smooth",
                            });
                        }}
                    >
                        <Triangle
                            className="top_triangle"
                            color={topActive ? "#4D4D4D" : "#EBEBEB"}
                        />
                    </div>
                    <div
                        className="toBottom_button"
                        onClick={() => {
                            if (!bottomActive || isBottom) {
                                return;
                            }

                            const scrollBody = getScrollBody(ref.current);
                            if (!scrollBody) {
                                return;
                            }
                            scrollBody.scrollTo({
                                top: rowsRef.current[activeIndex.current + 1]?.offsetTop ?? 0,
                                behavior: "smooth",
                            });
                        }}
                    >
                        <Triangle
                            className="bottom_triangle"
                            color={bottomActive && !isBottom ? "#4D4D4D" : "#EBEBEB"}
                        />
                    </div>
                </div>
            )}
        </JumpContext.Provider>
    );
};
/* <------------------------------------ **** FUNCTION COMPONENT END **** ------------------------------------ */
export default JumpWrap;
