import { useEffect, useState } from "react";
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

export const usePortalPosition = (
    ref: React.MutableRefObject<HTMLDivElement | null>,
    key: string,
): React.Dispatch<React.SetStateAction<boolean>> => {
    const [show, setShow] = useState(false);

    useEffect(() => {
        let timer: null | number = null;
        const setPosition = () => {
            timer && window.clearTimeout(timer);
            timer = window.setTimeout(() => {
                const node = ref.current;
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
        };

        const fn = () => {
            if (!show) {
                return;
            }
            setPosition();
        };
        window.addEventListener("resize", fn);
        window.addEventListener("scroll", fn, true);
        setPosition();
        return () => {
            window.removeEventListener("resize", fn);
            window.removeEventListener("scroll", fn, true);
            timer && window.clearTimeout(timer);
        };
    }, [key, ref, show]);

    return setShow;
};
