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
import { useTouch } from "./Hooks/useTouch";
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

    const touchStatus = useRef(false);

    const globalClass = useRef<HTMLStyleElement>();

    const point = useRef<PointProps>({
        offsetX: 0,
        offsetY: 0,
    });

    const rootRef = useTouch(
        (res) => {
            //开始触摸
            const node = rootRef.current;
            if (!node) {
                return;
            }

            touchStatus.current = true;

            onDragStart?.();
            /******* 阻止hover事件 start *************/
            timer.current.show && window.clearTimeout(timer.current.show);
            timer.current.hidden && window.clearTimeout(timer.current.hidden);
            setShow(false);
            visibleChange(false);
            /******* 阻止hover事件 end *************/
            const rect = node.getBoundingClientRect();
            const scrollData = getScrollValue();
            const rectX = rect.left + scrollData.x;
            const rectY = rect.top + scrollData.y;
            point.current = {
                offsetX: res.pageX - rectX,
                offsetY: res.pageY - rectY,
            };

            const activeEl = document.activeElement;
            if (activeEl !== rootRef.current) {
                node.focus({
                    preventScroll: true,
                });
            }

            const pointerStyle = window.getComputedStyle(node, null).cursor;
            globalClass.current = document.createElement("style");
            globalClass.current.innerHTML = `
            *{
                cursor:${pointerStyle} !important;
            }
            `;
            document.head.append(globalClass.current);
        },
        ({ pageY }) => {
            onDragMove?.(pageY - point.current.offsetY);
        },
        () => {
            point.current = {
                offsetX: 0,
                offsetY: 0,
            };
            onDragEnd?.();
            touchStatus.current = false;
            globalClass.current?.remove();
            globalClass.current = undefined;
        },
        () => {
            point.current = {
                offsetX: 0,
                offsetY: 0,
            };
            onDragEnd?.();
            touchStatus.current = false;
            globalClass.current?.remove();
            globalClass.current = undefined;
        },
    );

    const visibleChange = usePortalPosition(rootRef, id);

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
        if (touchStatus.current) {
            return;
        }

        hoverRef.current.root = true;
        changePortalVisible();
    };

    /**
     * 当root的mouse leave时
     */
    const handleMouseLeave = () => {
        if (touchStatus.current) {
            return;
        }

        hoverRef.current.root = false;
        changePortalVisible();
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
