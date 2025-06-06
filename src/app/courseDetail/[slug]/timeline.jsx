'use client'

import { Chrono } from "react-chrono";
import { useEffect, useState } from "react";

export default function Timeline({ timelineStart, timelineFinish, resta, noResta, onDeleteDetail, canUpdate }) {

    const [timelineItems, setTimelineItems] = useState([]);

    // props 기반으로 items 재계산
    useEffect(() => {
        const nodes = [
            ...noResta.map(item => ({
                title: "코멘트",
                cardTitle: "코멘트",
                cardSubtitle: item.start,
                cardDetailedText: item.comment,
                detail_idx: item.detail_idx
            })),
            ...resta.map(item => {
                const restaInfo = item.resta[0];
                return {
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

    }, [resta, noResta, timelineStart, timelineFinish]);

    // 삭제 함수
    const handleDeleteById = (detailIdx, customResta) => {
        if (detailIdx !== undefined) {
            onDeleteDetail(detailIdx, customResta);
            setTimelineItems(prev => prev.filter(item => item.detail_idx !== detailIdx));
        }
    };

    console.log("프롭으로 받은 아이템리스트 : ",timelineItems)
    console.log("timelineItems.length:", timelineItems.length);

    return (
        <Chrono
            key={timelineItems.map(i => i.detail_idx).join("-")}
            items={timelineItems}
            mode="HORIZONTAL"
            disableToolbar
        >
            {timelineItems.map(item => {
                const isStartOrEnd = item.title?.startsWith("시작") || item.title?.endsWith("끝");
                const restaInfo = item.customResta;

                return (
                    <div
                        key={item.detail_idx}
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
                            <p className="detailDel" onClick={() => handleDeleteById(item.detail_idx, item.customResta)}>[삭제]</p>
                        )}
                    </div>
                );
            })
            }
        </Chrono>
    );
}
