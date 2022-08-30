export interface OptionProps {
    code: string;
    content: string;
}

export interface PointProps {
    offsetX: number;
    offsetY: number;
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
    y: number;
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

export interface Fiber {
    alternate: null;
    child: Fiber;
    childLanes: 0;
    dependencies: null;
    elementType: string;
    firstEffect: null;
    flags: 0;
    index: 0;
    key: string;
    lanes: 0;
    lastEffect: null;
    memoizedProps: "";
    memoizedState: null;
    mode: 0;
    nextEffect: null;
    pendingProps: "";
    ref: null;
    return: Fiber;
    sibling: null;
    stateNode: "";
    tag: 5;
    type: "div";
    updateQueue: null;
}
