/**
 * @file
 * @date 2022-08-29
 * @author xuejie.he
 * @lastModify xuejie.he 2022-08-29
 */
/* <------------------------------------ **** DEPENDENCE IMPORT START **** ------------------------------------ */
/** This section will include all the necessary dependence for this tsx file */
import React, { Fragment, useEffect, useMemo, useState } from "react";
import { comms } from ".";
import { Col } from "./Component/Col";
import { Row } from "./Component/Row";
import { useRuler } from "./Hooks/useRuler";
import Ruler from "./ruler";
import Slider from "./slider";
import { OptionProps } from "./type";
import { deepCloneData, splitCol } from "./unit";
/* <------------------------------------ **** DEPENDENCE IMPORT END **** ------------------------------------ */
/* <------------------------------------ **** INTERFACE START **** ------------------------------------ */
/** This section will include all the interface for this tsx file */
/* <------------------------------------ **** INTERFACE END **** ------------------------------------ */
/* <------------------------------------ **** FUNCTION COMPONENT START **** ------------------------------------ */
const Temp: React.FC = () => {
    /* <------------------------------------ **** STATE START **** ------------------------------------ */
    /************* This section will include this component HOOK function *************/

    const [scoreData, setScoreData] = useState(() => {
        const arr = comms.config.options ?? [];

        const data: Record<string, number> = {};
        for (let i = 0; i < arr.length; i++) {
            const item = deepCloneData(arr[i]);
            data[item.code] = 0;
        }
        return { ...data };
    });

    const rulerData = useRuler();

    const [colNumber, setColNumber] = useState(splitCol);

    const options = useMemo(() => {
        const arr = comms.config.options ?? [];

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
    /* <------------------------------------ **** STATE END **** ------------------------------------ */
    /* <------------------------------------ **** PARAMETER START **** ------------------------------------ */
    /************* This section will include this component parameter *************/

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
    const getContentFn = (item: OptionProps) => {
        return (
            <Slider
                value={scoreData[item.code] ?? 0}
                content={item.content}
                range={rulerData?.[1]}
                setValue={(res) => {
                    setScoreData((pre) => {
                        return {
                            ...pre,
                            ...{ [item.code]: res },
                        };
                    });
                }}
            />
        );
    };

    /* <------------------------------------ **** FUNCTION END **** ------------------------------------ */

    return (
        <div className="main">
            {options.map((row, index) => {
                return (
                    <Fragment key={index}>
                        <div className="options_row">
                            {!!rulerData && <Ruler scales={rulerData[0].scale} />}
                            {colNumber ? (
                                <Row className="options_items" align="bottom">
                                    {row.map((item) => {
                                        return (
                                            <Fragment key={item.code}>
                                                <Col span={colNumber?.span as 2 | 3}>
                                                    {getContentFn(item)}
                                                </Col>
                                            </Fragment>
                                        );
                                    })}
                                </Row>
                            ) : (
                                <div className="options_items_mobile">
                                    {row.map((item) => {
                                        return (
                                            <Fragment key={item.code}>
                                                <div className="options_item_mobile">
                                                    {getContentFn(item)}
                                                </div>
                                            </Fragment>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
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
};
/* <------------------------------------ **** FUNCTION COMPONENT END **** ------------------------------------ */
export default Temp;
