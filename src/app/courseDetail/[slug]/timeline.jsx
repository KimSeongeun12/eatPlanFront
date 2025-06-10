'use client'

import { Chrono } from "react-chrono";
import { useEffect, useState } from "react";

export default function Timeline({ timelineStart, timelineFinish, resta, noResta, onDeleteDetail, canUpdate, onTimelineItemsChange }) {

    const [timelineItems, setTimelineItems] = useState([]);

    // props 기반으로 items 재계산
    useEffect(() => {
        const nodes = [
            ...noResta.map(item => ({
                tmpIdx: item.tmpIdx,
                title: "코멘트",
                cardTitle: "코멘트",
                cardSubtitle: item.start,
                cardDetailedText: item.comment,
                detail_idx: item.detail_idx
            })),
            ...resta.map(item => {
                const restaInfo = item.resta[0];
                return {
                    tmpIdx: item.tmpIdx,
                    title: restaInfo.resta_name,
                    cardTitle: restaInfo.resta_name,
                    url: restaInfo.url,
                    cardSubtitle: item.start,
                    cardDetailedText: item.comment,
                    customResta: restaInfo,
                    detail_idx: item.detail_idx
                };
            })
        ].sort((a, b) => a.cardSubtitle.localeCompare(b.cardSubtitle));

        const fullItems = [
            { title: `시작 ${timelineStart}`, cardSubtitle: "플랜 시작 시간", detail_idx:0 },
            ...nodes,
            { title: `${timelineFinish} 끝`, cardSubtitle: "플랜 종료 시간", detail_idx:99999 }
        ];

        setTimelineItems(fullItems);

        onTimelineItemsChange?.(prev => {
            const prevString = JSON.stringify(prev);
            const nextString = JSON.stringify(fullItems);
            if (prevString !== nextString) {
                return fullItems;
            }
            return prev;
        });

    }, [resta, noResta, timelineStart, timelineFinish]);

    // 삭제 함수
    const handleDeleteById = (detailIdx, customResta, tmpIdx) => {
        if (detailIdx !== undefined) {
            onDeleteDetail(detailIdx, customResta, null);
            setTimelineItems(prev => prev.filter(item => item.detail_idx !== detailIdx));
        } else {
            onDeleteDetail(undefined, customResta, tmpIdx);
            setTimelineItems(prev => prev.filter(item => item.tmpIdx !== tmpIdx || item.tmpIdx == null));
        }
    };

    return (
        <Chrono
            key={timelineItems.map(i => i.detail_idx ?? `tmp-${i.tmpIdx}`).join("-")}
            items={timelineItems}
            mode="HORIZONTAL"
            disableToolbar
        >
            {timelineItems.map(item => {
                const isStartOrEnd = item.title?.startsWith("시작") || item.title?.endsWith("끝");
                const restaInfo = item.customResta;

                return (
                    <div
                        key={item.detail_idx ?? `tmp-${item.tmpIdx}`}
                        className={isStartOrEnd ? "hidden" : "customCards"}
                        style={{ display: isStartOrEnd ? "none" : "flex", gap: "12px" }}
                    >
                        <p className="detailContent" style={{ flex: 1, wordBreak: "break-word", whiteSpace: "normal" }}>
                            {item.cardDetailedText}
                        </p>

                        {restaInfo?.img_idx && (
                            <img
                                src={`http://localhost/imageIdx/${restaInfo.img_idx}`}
                                className="customCardImage"
                                alt="식당 이미지"
                                style={{ width: "120px", objectFit: "cover" }}
                            />
                        )}

                        {!isStartOrEnd && canUpdate && (
                            <p className="detailDel" onClick={() => handleDeleteById(item.detail_idx, item.customResta, item.tmpIdx)}>[삭제]</p>
                        )}
                    </div>
                );
            })
            }
        </Chrono>
    );
}
