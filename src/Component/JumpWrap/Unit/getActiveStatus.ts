import { getScrollBody } from "./getScrollBody";

export const getActiveStatus = (
    scrollEl: HTMLElement | null,
    els: (HTMLElement | null)[] | null,
): {
    overflow: boolean;
    active: number;
    isBottom: boolean;
} => {
    const scrollBody = getScrollBody(scrollEl);

    const arr = els ?? [];
    let n = -1;
    const scrollTop = scrollBody?.scrollTop ?? 0;
    for (let i = 0; i < arr.length; ) {
        const item = arr[i];
        if (i === arr.length - 1) {
            if (item && item?.offsetTop + item.offsetHeight > scrollTop) {
                n = i;
                i = arr.length;
            } else {
                ++i;
            }
        } else if (item && item?.offsetTop >= scrollTop) {
            n = i;
            i = arr.length;
        } else {
            ++i;
        }
    }
    return {
        overflow: !!(scrollBody && scrollBody.offsetHeight < scrollBody.scrollHeight),
        active: n,
        isBottom: !!(
            scrollBody && scrollBody.offsetHeight + scrollBody.scrollTop >= scrollBody.scrollHeight
        ),
    };
};
