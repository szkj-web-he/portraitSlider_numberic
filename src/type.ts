export interface OptionProps {
    code: string;
    content: string;
}

export interface PointProps {
    offsetX: number;
    offsetY: number;
    x: number;
    y: number;
    width: number;
    height: number;
}

export interface DragPramsProps extends PointProps {
    clientX: number;
    clientY: number;
}

export interface DragMoveProps extends DragPramsProps {
    name?: string;
}

/**
 * 每个分数所对应的像素范围
 */
export interface ScoreRange {
    value: number;
    min: number;
    max: number;
    x: number;
}

export type ActiveOptionProps = { [key: string]: OptionProps } | undefined;

export interface ActiveTempProps {
    setActive: (res: OptionProps | undefined) => void;

    activeOption?: OptionProps;
}

export interface ScaleProps {
    value: number;
    bottom: number;
    status: 0 | 1 | 2;
}

export interface ScaleAttr {
    scale: ScaleProps[];
    margin: number;
    incrementVal: number;
    v: number;
}
