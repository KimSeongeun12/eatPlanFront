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
                cardDetailedText: item.comment
            })),
            ...resta.map((item, idx) => {
                const restaInfo = item.resta[0];
                return {
                    title: restaInfo.resta_name,
                    cardTitle: restaInfo.resta_name,
                    url: restaInfo.url,
                    cardSubtitle: item.start,
                    cardDetailedText: item.comment,
                    customResta: restaInfo
                };
            })
        ].sort((a, b) => a.cardSubtitle.localeCompare(b.cardSubtitle));

        const fullItems = [
            { title: `시작 ${timelineStart}`, cardSubtitle: "플랜 시작 시간" },
            ...nodes,
            { title: `${timelineFinish} 끝`, cardSubtitle: "플랜 종료 시간" }
        ];

        setTimelineItems(fullItems);
    }, [resta, noResta, timelineStart, timelineFinish]);

    // 삭제 함수
    const handleDelete = (index) => {
        const item = timelineItems[index];
        const detailIdx = item?.detail_idx;

        if (detailIdx !== undefined) {
            onDeleteDetail(detailIdx); // 상위로 전달
        }
        setTimelineItems(prev => prev.filter((_, i) => i !== index));
    };

    const customContent = timelineItems.map((item, idx) => {
        const isStartOrEnd = item.title?.startsWith("시작") || item.title?.endsWith("끝");
        const restaInfo = item.customResta;

        return (
            <div
                key={idx}
                className={isStartOrEnd ? "hidden" : "customCards"}
                style={{ display: isStartOrEnd ? "none" : "flex", gap: "12px" }}
            >
                <p className="detailContent" style={{ flex: 1, wordBreak: "break-word", whiteSpace: "normal" }}>
                    {item.cardDetailedText}
                </p>

                {restaInfo?.photo?.new_filename && (
                    <img
                        src={`http://localhost/image/${restaInfo.photo.new_filename}`}
                        className="customCardImage"
                        alt="식당 이미지"
                        style={{ width: "120px", objectFit: "cover" }}
                    />
                )}

                {!isStartOrEnd && canUpdate && (
                    <p className="detailDel" onClick={() => handleDelete(idx)}>[삭제]</p>
                )}
            </div>
        );
    });

    return (
        <Chrono
            key={timelineItems.length}
            items={timelineItems}
            mode="HORIZONTAL"
            disableToolbar
        >
            {customContent}
        </Chrono>
    );
}
