import { useCallback, useEffect, useRef } from "react";
import { Fiber } from "../type";
import { getScrollValue } from "../unit";

const FIBERKEY = "__reactFiber$";

const findKey = (el: HTMLElement) => {
    let fiberKey = "";
    for (const key in el) {
        if (key.startsWith(FIBERKEY)) {
            fiberKey = key;
        }
    }
    const data: Fiber = el[fiberKey];
    return data.key;
};

const findSiblingPortal = (key: string) => {
    const els = document.querySelectorAll(".bar_titleContent");
    let ref: null | HTMLElement = null;
    for (let i = 0; i < els.length; ) {
        const el = els[i];
        if (el instanceof HTMLElement && findKey(el) === key) {
            i = els.length;
            ref = el;
        } else {
            ++i;
        }
    }
    return ref;
};

export const usePortalPosition = (key: string): ((ref: HTMLDivElement | null) => void) => {
    const el = useRef<HTMLDivElement | null>(null);

    const timer = useRef<number>();

    useEffect(() => {
        return () => {
            timer.current && window.clearTimeout(timer.current);
        };
    }, []);

    const setPosition = useCallback(() => {
        timer.current && window.clearTimeout(timer.current);
        timer.current = window.setTimeout(() => {
            const node = el.current;
            if (!node) {
                return;
            }
            const rect = node.getBoundingClientRect();
            const scrollData = getScrollValue();

            const top = rect.top + scrollData.y;
            let left = rect.left + scrollData.x + 13;

            const portalEl = findSiblingPortal(key);
            if (!portalEl) {
                return;
            }
            const { width, height } = portalEl.getBoundingClientRect();
            if (width + left > window.innerWidth) {
                left = window.innerWidth - width - 8;
            }

            portalEl.style.transform = `translate(${left}px,${top - height - 2}px)`;
        });
    }, [key]);

    useEffect(() => {
        return () => {
            window.removeEventListener("resize", setPosition);
            window.removeEventListener("scroll", setPosition, true);
        };
    }, [setPosition]);

    return useCallback(
        (ref: HTMLDivElement | null) => {
            if (el.current === ref) {
                return;
            }
            window.removeEventListener("resize", setPosition);
            window.removeEventListener("scroll", setPosition, true);
            el.current = ref;

            setPosition();
            window.addEventListener("resize", setPosition);
            window.addEventListener("scroll", setPosition, true);
        },
        [setPosition],
    );
};
