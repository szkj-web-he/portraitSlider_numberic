/**
 * @file
 * @date 2022-08-29
 * @author xuejie.he
 * @lastModify xuejie.he 2022-08-29
 */
/* <------------------------------------ **** DEPENDENCE IMPORT START **** ------------------------------------ */
/** This section will include all the necessary dependence for this tsx file */
import React, { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { comms } from ".";
import { Col } from "./Component/Col";
import { Row } from "./Component/Row";
import { useRuler } from "./Hooks/useRuler";
import Ruler from "./ruler";
import Slider from "./slider";
import { OptionProps } from "./type";
import { deepCloneData, initScore, splitCol } from "./unit";
import { useLayoutEffect } from "react";
import { Group } from "./Component/Group";
/* <------------------------------------ **** DEPENDENCE IMPORT END **** ------------------------------------ */
/* <------------------------------------ **** INTERFACE START **** ------------------------------------ */
/** This section will include all the interface for this tsx file */
/* <------------------------------------ **** INTERFACE END **** ------------------------------------ */
/* <------------------------------------ **** FUNCTION COMPONENT START **** ------------------------------------ */
const Temp: React.FC = () => {
    /* <------------------------------------ **** STATE START **** ------------------------------------ */
    /************* This section will include this component HOOK function *************/

    const scoreDataRef = useRef<ReturnType<typeof initScore>>({});

    const [scoreData, setScoreData] = useState(() => {
        const data = initScore();
        scoreDataRef.current = deepCloneData(data);
        return data;
    });

    const rulerData = useRuler();

    const [colNumber, setColNumber] = useState(splitCol);

    const options = useMemo(() => {
        const arr = comms.config.options?.[1] ?? [];

        if (!colNumber) {
            return [deepCloneData(arr)];
        }

        const mapArr: Array<Array<OptionProps>> = [];

        let index = -1;
        for (let i = 0; i < arr.length; i++) {
            const item = deepCloneData(arr[i]);
            if (i % colNumber.splitValue) {
                mapArr[index].push({ ...item });
            } else {
                ++index;
                mapArr[index] = [{ ...item }];
            }
        }
        return [...mapArr];
    }, [colNumber]);

    const selectOptionRef = useRef<{ row: string; col: string }>();
    const [selectOption, setSelectOption] = useState<{ row: string; col: string }>();

    const rangeRef = useRef(deepCloneData(rulerData?.[1]));

    /* <------------------------------------ **** STATE END **** ------------------------------------ */
    /* <------------------------------------ **** PARAMETER START **** ------------------------------------ */
    /************* This section will include this component parameter *************/

    useEffect(() => {
        let end = false;
        const timer = setTimeout(() => {
            if (end) {
                return;
            }
            const data: Record<string, Record<string, number | null>> = {};
            for (const key in scoreData) {
                const item: Record<string, number | null> = {};
                for (const subKey in scoreData[key]) {
                    const val = scoreData[key][subKey];
                    if (typeof val === "number") {
                        item[subKey] = val;
                    } else {
                        item[subKey] = null;
                    }
                }
                data[key] = item;
            }
            comms.state = data;
        });
        return () => {
            end = true;
            clearTimeout(timer);
        };
    }, [scoreData]);

    useLayoutEffect(() => {
        rangeRef.current = deepCloneData(rulerData?.[1]);
    }, [rulerData]);

    useEffect(() => {
        const fn = (status: 1 | -1) => {
            if (!selectOptionRef.current || !rangeRef.current) {
                return;
            }
            const scoreVal =
                scoreDataRef.current?.[selectOptionRef.current.row][selectOptionRef.current.col] ??
                0;

            let n = -1;
            for (let i = 0; i < rangeRef.current.length; ) {
                const item = rangeRef.current[i];
                if (item.value === scoreVal) {
                    n = i;
                    i = rangeRef.current.length;
                } else {
                    ++i;
                }
            }

            if (n >= 0) {
                scoreDataRef.current[selectOptionRef.current.row][selectOptionRef.current.col] =
                    rangeRef.current?.[n + status]
                        ? rangeRef.current[n + status].value
                        : rangeRef.current[n].value;
                setScoreData({ ...scoreDataRef.current });
            }
        };

        const mainKeyDownFn = (e: KeyboardEvent) => {
            const code = e.key;
            if (!selectOptionRef.current) {
                return;
            }

            if (!["ArrowUp", "ArrowDown"].includes(code)) {
                return;
            }
            e.preventDefault();
            if (code === "ArrowUp") {
                fn(1);
            } else {
                fn(-1);
            }
        };

        const mainWheelFn = (e: WheelEvent) => {
            if (!selectOptionRef.current) {
                return;
            }
            let status: 1 | -1 | 0 = 0;
            if (e.deltaY > 0) {
                status = -1;
            } else if (e.deltaY < 0) {
                status = 1;
            }
            if (status === 0) {
                return;
            }

            e.preventDefault();
            fn(status);
        };

        document.addEventListener("keydown", mainKeyDownFn);
        const optionAttr = { passive: false };
        document.addEventListener("wheel", mainWheelFn, optionAttr);
        return () => {
            document.removeEventListener("keydown", mainKeyDownFn);
            document.removeEventListener("wheel", mainWheelFn, optionAttr);
        };
    }, []);

    useEffect(() => {
        const fn = () => {
            setColNumber(splitCol);
        };

        window.addEventListener("resize", fn);
        return () => {
            window.removeEventListener("resize", fn);
        };
    }, []);

    /* <------------------------------------ **** PARAMETER END **** ------------------------------------ */
    /* <------------------------------------ **** FUNCTION START **** ------------------------------------ */
    /************* This section will include this component general function *************/
    const getContentFn = (item: OptionProps, row: OptionProps) => {
        return (
            <Slider
                value={scoreData[row.code][item.code] ?? 0}
                content={item.content}
                range={rulerData?.[1]}
                handleFocus={(status) => {
                    if (status) {
                        selectOptionRef.current = {
                            row: row.code,
                            col: item.code,
                        };
                        setSelectOption({
                            row: row.code,
                            col: item.code,
                        });
                    } else {
                        selectOptionRef.current = undefined;
                        setSelectOption(undefined);
                    }
                }}
                active={selectOption?.row === row.code && selectOption.col === item.code}
                setValue={(res) => {
                    scoreDataRef.current[row.code][item.code] = res;
                    setScoreData({ ...scoreDataRef.current });
                }}
            />
        );
    };

    /* <------------------------------------ **** FUNCTION END **** ------------------------------------ */

    return (
        <div className="main">
            {comms.config.options?.[0].map((item, n) => {
                return (
                    <div key={item.code}>
                        <div
                            className="options_header"
                            dangerouslySetInnerHTML={{
                                __html: item.content,
                            }}
                        />
                        {options.map((row, index) => {
                            return (
                                <Fragment key={index}>
                                    <Group
                                        index={index + n * options.length}
                                        className="options_row"
                                        style={
                                            colNumber
                                                ? {
                                                      padding: "50px 0",
                                                  }
                                                : {}
                                        }
                                    >
                                        {!!rulerData && (
                                            <Ruler
                                                scales={rulerData[0].scale}
                                                style={
                                                    colNumber
                                                        ? {}
                                                        : {
                                                              transform: "translateY(-50px)",
                                                          }
                                                }
                                            />
                                        )}
                                        {colNumber ? (
                                            <Row className="options_items" align="bottom">
                                                {row.map((col) => {
                                                    return (
                                                        <Fragment key={col.code}>
                                                            <Col span={colNumber?.span as 2 | 3}>
                                                                {getContentFn(col, item)}
                                                            </Col>
                                                        </Fragment>
                                                    );
                                                })}
                                            </Row>
                                        ) : (
                                            <div className="options_items_mobile">
                                                {row.map((col) => {
                                                    return (
                                                        <Fragment key={col.code}>
                                                            <div className="options_item_mobile">
                                                                {getContentFn(col, item)}
                                                            </div>
                                                        </Fragment>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </Group>
                                    {options.length !== index + 1 || options.length !== 1 ? (
                                        <div className="options_blank" />
                                    ) : (
                                        <></>
                                    )}
                                </Fragment>
                            );
                        })}
                    </div>
                );
            })}
        </div>
    );
};
/* <------------------------------------ **** FUNCTION COMPONENT END **** ------------------------------------ */
export default Temp;
