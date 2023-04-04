import { comms } from ".";
import { ScaleAttr, ScaleProps } from "./type";

export const isMobile = (): boolean => {
    return window.matchMedia("(any-pointer:coarse)").matches;
};

export const deepCloneData = <T>(data: T): T => {
    if (data == null) {
        return data;
    }
    return JSON.parse(JSON.stringify(data)) as T;
};

/**
 * 当 最大刻度值比视口小 时
 * @param margin 两个刻度之间最小距离
 * @param total 容器的总尺寸
 * @param score 总分
 * @returns {scale:ScaleProps[],margin:number,incrementVal:number,v:number}
 * scale => 刻度列表
 * margin => 每个刻度之间的像素距离
 * incrementVal => 每个刻度之间相差的分数
 * v => 一分 需要多少像素
 */
const normalScale = (margin: number, total: number, score: number): ScaleAttr => {
    const arr: ScaleProps[] = [
        {
            value: 0,
            bottom: 0,
            status: 2,
        },
    ];

    // 1分是多少像素
    const d = total / score;

    //每个刻度之间 相隔1分(默认值)
    let incrementVal = 1;
    if (d < margin) {
        // 非默认值
        incrementVal = Math.ceil(margin / d);
    }

    let count = 0;
    for (let i = incrementVal; i < score; i += incrementVal) {
        ++count;
        const data: ScaleProps = {
            value: i,
            bottom: i * d,
            status: 0,
        };
        if (count === 5) {
            data.status = 2;
            count = 0;
        }

        const val = data.bottom + d * incrementVal;

        if (data.status === 2) {
            if (val > total - 20) {
                data.status = 1;
            }
            arr.push(data);
        } else if (val <= total) {
            arr.push(data);
        }

        if (i + incrementVal >= score) {
            arr.push({
                value: score,
                bottom: total,
                status: 2,
            });
        }
    }
    return { scale: arr, margin: d * incrementVal, incrementVal, v: d };
};

/**
 * 设置刻度值
 */
export const setScale = (): ScaleAttr | undefined => {
    let { totalScore } = comms.config;
    if (typeof totalScore !== "number" || totalScore > 100 || totalScore < 0) {
        totalScore = 100;
    }

    const minMargin = 10;

    const total = 200;

    return normalScale(minMargin, total, totalScore);
};

//每一列的占位空间
export const spanFn = (val: number): number => {
    const windowWidth = window.innerWidth;
    return ((windowWidth - 20 * 11) / 12) * val + 20 * (val - 1);
};

/**
 * 获取col的分割
 */

export const splitCol = ():
    | {
          span: number;
          splitValue: number;
      }
    | undefined => {
    const mobileStatus = isMobile();
    if (mobileStatus) {
        return undefined;
    }
    let n = 0;
    for (let i = 1; i <= 12; ) {
        const value = spanFn(i);
        if (value > 170) {
            n = i;
            i = 13;
        } else {
            ++i;
        }
    }
    return {
        span: n,
        splitValue: Math.floor(12 / n),
    };
};

export const createPortalEl = (): Element => {
    let div = document.querySelector("[class=portal][data-key=portal]");
    if (div) {
        return div;
    }

    div = document.createElement("div");

    div.setAttribute("data-key", "portal");
    div.setAttribute("class", "portal");
    document.body.append(div);
    return div;
};

export const getScrollValue = (): {
    x: number;
    y: number;
} => {
    let x = window.scrollX || window.pageXOffset;
    let y = window.scrollY || window.pageYOffset;
    const node = document.documentElement || document.body.parentNode;
    if (!x) {
        x = (typeof node.scrollLeft === "number" ? node : document.body).scrollLeft;
    } else if (!y) {
        y = (typeof node.scrollTop === "number" ? node : document.body).scrollTop;
    }
    return {
        x,
        y,
    };
};

/**
 * 获取从state回溯回来的数据
 */
const getState = () => {
    const state = comms.state as Record<string, string>;
    const stateData: Record<string, null | number> = {};

    for (const keyStr in state) {
        const key = keyStr.split("#")[1];

        stateData[key] = Number(state[keyStr]);
    }
    return stateData;
};

export const initScore = (): Record<string, number | null> => {
    const arr = comms.config.options ?? [];

    const state = getState();

    const data: Record<string, number | null> = {};
    for (let i = 0; i < arr.length; i++) {
        const item = deepCloneData(arr[i]);
        data[item.code] = state[item.code] ?? null;
    }
    return { ...data };
};

export const stopSelect = (
    e: React.MouseEvent<HTMLElement> | React.TouchEvent<HTMLDivElement>,
    selectedFn: { current: typeof document.onselectstart },
    stopPropagation?: boolean,
): void => {
    stopPropagation && e.stopPropagation();
    window.getSelection()?.removeAllRanges();
    selectedFn.current = document.onselectstart;
    document.onselectstart = () => false;
};
