/**
 * @file
 * @date 2022-08-29
 * @author xuejie.he
 * @lastModify xuejie.he 2022-08-29
 */
/* <------------------------------------ **** DEPENDENCE IMPORT START **** ------------------------------------ */
/** This section will include all the necessary dependence for this tsx file */
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useHashId } from "./Hooks/useHashId";
import { usePortalPosition } from "./Hooks/usePortalPosition";
import { stopSelect } from "./Scroll/Unit/noSelected";
import { PointProps } from "./type";
import { createPortalEl, getScrollValue } from "./unit";
/* <------------------------------------ **** DEPENDENCE IMPORT END **** ------------------------------------ */
/* <------------------------------------ **** INTERFACE START **** ------------------------------------ */
/** This section will include all the interface for this tsx file */
interface TempProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;

    active?: boolean;

    onDragStart?: () => void;
    onDragMove?: (y: number) => void;
    onDragEnd?: () => void;
}
/* <------------------------------------ **** INTERFACE END **** ------------------------------------ */
/* <------------------------------------ **** FUNCTION COMPONENT START **** ------------------------------------ */
const Temp: React.FC<TempProps> = ({
    children,
    active,
    onDragStart,
    onDragMove,
    onDragEnd,
    className,
    onFocus,
    onBlur,
    ...props
}) => {
    /* <------------------------------------ **** STATE START **** ------------------------------------ */
    /************* This section will include this component HOOK function *************/
    const [show, setShow] = useState(false);

    const showRef = useRef(false);

    const selectedFn = useRef<typeof document.onselectstart>(null);

    const hoverRef = useRef({
        portal: false,
        root: false,
    });

    const timer = useRef<{
        show: null | number;
        hidden: null | number;
    }>({
        show: null,
        hidden: null,
    });

    const id = useHashId("bar");

    const rootRef = useRef<HTMLDivElement | null>(null);

    const visibleChange = usePortalPosition(rootRef, id);

    const touchStartStatus = useRef(false);

    const mouseStartStatus = useRef(false);

    const point = useRef<PointProps>({
        offsetX: 0,
        offsetY: 0,
    });
    /* <------------------------------------ **** STATE END **** ------------------------------------ */
    /* <------------------------------------ **** PARAMETER START **** ------------------------------------ */
    /************* This section will include this component parameter *************/

    useLayoutEffect(() => {
        showRef.current = show;
    }, [show]);

    useEffect(() => {
        const timerData = timer.current;
        return () => {
            for (const key in timerData) {
                if (timerData[key]) {
                    window.clearTimeout(timerData[key]);
                }
            }
        };
    }, []);

    useEffect(() => {
        const node = rootRef.current;
        let timerFocus: null | number = null;
        if (!node) {
            return;
        }

        if (active) {
            timerFocus = window.setTimeout(() => {
                const activeEl = document.activeElement;
                if (activeEl !== node) {
                    node.focus({
                        preventScroll: true,
                    });
                }
            });
        }
        return () => {
            timerFocus && window.clearTimeout(timerFocus);
        };
    }, [active]);

    /* <------------------------------------ **** PARAMETER END **** ------------------------------------ */
    /* <------------------------------------ **** FUNCTION START **** ------------------------------------ */
    /************* This section will include this component general function *************/
    const toOpen = () => {
        timer.current.show = window.setTimeout(() => {
            setShow(true);
            visibleChange(true);
            timer.current.show = null;
        }, 500);
    };

    /**
     * 更改portal 节点的可见度
     */
    const changePortalVisible = () => {
        timer.current.show && window.clearTimeout(timer.current.show);
        timer.current.hidden && window.clearTimeout(timer.current.hidden);
        if (hoverRef.current.portal || hoverRef.current.root) {
            if (showRef.current === false) {
                //延时展示
                toOpen();
            }
        } else {
            timer.current.hidden = window.setTimeout(() => {
                setShow(false);
                visibleChange(false);
                timer.current.hidden = null;
            }, 100);
        }
    };

    /**
     * 当root的mouse enter时
     */
    const handleMouseEnter = () => {
        if (touchStartStatus.current || mouseStartStatus.current) {
            return;
        }

        hoverRef.current.root = true;
        changePortalVisible();
    };

    /**
     * 当root的mouse leave时
     */
    const handleMouseLeave = () => {
        if (touchStartStatus.current || mouseStartStatus.current) {
            return;
        }

        hoverRef.current.root = false;
        changePortalVisible();
    };

    const handleDragStart = (
        res: {
            pageX: number;
            pageY: number;
            clientX: number;
            clientY: number;
        },
        e: React.MouseEvent<HTMLElement> | React.TouchEvent<HTMLDivElement>,
    ) => {
        const rect = rootRef.current?.getBoundingClientRect();
        if (!rect) {
            return;
        }

        stopSelect(e, selectedFn, false);

        onDragStart?.();
        const scrollData = getScrollValue();
        const rectX = rect.left + scrollData.x;
        const rectY = rect.top + scrollData.y;
        point.current = {
            offsetX: res.pageX - rectX,
            offsetY: res.pageY - rectY,
        };
        if (!rootRef.current) {
            return;
        }
        /******* 阻止hover事件 start *************/
        timer.current.show && window.clearTimeout(timer.current.show);
        timer.current.hidden && window.clearTimeout(timer.current.hidden);
        setShow(false);
        visibleChange(false);
        /******* 阻止hover事件 end *************/

        const activeEl = document.activeElement;
        if (activeEl !== rootRef.current) {
            rootRef.current.focus({
                preventScroll: true,
            });
        }
    };

    const handleMouseMove = (e: MouseEvent) => {
        if (!mouseStartStatus.current) {
            return;
        }
        const value = e.pageY - point.current.offsetY;
        onDragMove?.(value);
    };

    const handleMouseUp = () => {
        if (!mouseStartStatus.current) {
            return;
        }

        onDragEnd?.();
        mouseStartStatus.current = false;
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
        window.removeEventListener("blur", handleMouseUp);
        point.current = {
            offsetX: 0,
            offsetY: 0,
        };
    };

    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        if (touchStartStatus.current) {
            return;
        }
        mouseStartStatus.current = true;
        handleDragStart(
            {
                pageX: e.pageX,
                pageY: e.pageY,
                clientX: e.clientX,
                clientY: e.clientY,
            },
            e,
        );
        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
        window.addEventListener("blur", handleMouseUp);
    };

    const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
        if (mouseStartStatus.current) {
            return;
        }

        touchStartStatus.current = true;
        const position = e.targetTouches[0];
        handleDragStart(
            {
                pageX: position.pageX,
                pageY: position.pageY,
                clientX: position.clientX,
                clientY: position.clientY,
            },
            e,
        );
        window.addEventListener("blur", handleTouchEnd);
    };

    const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
        if (!touchStartStatus.current) {
            return;
        }

        const position = e.targetTouches[0];
        const value = position.pageY - point.current.offsetY;
        onDragMove?.(value);
    };

    const handleTouchEnd = () => {
        if (!touchStartStatus.current) {
            return;
        }

        touchStartStatus.current = false;
        window.removeEventListener("blur", handleTouchEnd);
        point.current = {
            offsetX: 0,
            offsetY: 0,
        };
    };

    /* <------------------------------------ **** FUNCTION END **** ------------------------------------ */
    return (
        <>
            <div className={`bar_wrap${className ? ` ${className}` : ""}`} {...props}>
                <div className="bar_bg">
                    <div className="bar_bgStart" />
                    <div className="bar_bgContent" />
                    <div className="bar_bgEnd" />
                </div>
                <div
                    className="bar_btn"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    onMouseDown={handleMouseDown}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                    onTouchCancel={handleTouchEnd}
                    onFocus={onFocus}
                    onBlur={onBlur}
                    tabIndex={-1}
                    ref={rootRef}
                >
                    <div className="bar_btnStart" />
                    <div className={`bar_btnContent${active ? " active" : ""}`}>{children}</div>
                    <div className="bar_btnEnd" />
                </div>
            </div>
            {createPortal(
                <div
                    key={id}
                    className="bar_titleContent"
                    style={show ? {} : { opacity: 0, pointerEvents: "none" }}
                    onMouseEnter={() => {
                        hoverRef.current.portal = true;
                        changePortalVisible();
                    }}
                    onMouseLeave={() => {
                        hoverRef.current.portal = false;
                        changePortalVisible();
                    }}
                >
                    {children}
                </div>,
                createPortalEl(),
            )}
        </>
    );
};
/* <------------------------------------ **** FUNCTION COMPONENT END **** ------------------------------------ */
export default Temp;
