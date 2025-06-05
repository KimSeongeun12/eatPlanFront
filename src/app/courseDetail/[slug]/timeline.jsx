'use client'

import { Chrono } from "react-chrono";

export default function Timeline({timelineStart, timelineFinish, resta, noResta}) {

    // 세부일정 배열 꺼내고 합친다음 시간순으로 정렬
    const nodes = [
        ...noResta.map(item => ({
            title: "코멘트",
            cardTitle: "코멘트",
            cardSubtitle: item.start,
            cardDetailedText: item.comment
        })),
        ...resta
            .map(item => {
            const restaInfo = item.resta[0]; // 배열에서 첫 번째 식당 정보 사용
            return {
                title: restaInfo.resta_name,
                cardTitle: restaInfo.resta_name,
                url: restaInfo.url,
                cardSubtitle: item.start,
                cardDetailedText: item.comment,
            };
        })
    ].sort((a, b) => a.cardSubtitle.localeCompare(b.cardSubtitle));

    // 시작과 끝 노드 추가
    const items = [
        {
            title: `시작 ${timelineStart}`,
            cardSubtitle: "플랜 시작 시간",
        },
        ...nodes.map((node, idx) => ({
            ...node,
            customResta: resta[idx]?.resta?.[0] || null
        })),
        {
            title: `${timelineFinish} 끝`,
            cardSubtitle: "플랜 종료 시간"
        }
    ];

    const customContent = items.map((item, idx) => {
        const isStartOrEnd = item.title?.startsWith("시작") || item.title?.endsWith("끝");
        const restaInfo = item.customResta;

        return (
            <div
                key={idx}
                className={isStartOrEnd ? "hidden" : "customCards"}
            >
                <p className={"detailContent"}>{item.cardDetailedText}</p>

                {restaInfo?.photo?.new_filename && (
                    <img
                        src={`http://localhost/image/${restaInfo.photo.new_filename}`}
                        className={"customCardImage"}
                        alt="식당 이미지"
                    />
                )}

                {!isStartOrEnd && (
                    <p className={"detailDel"}>삭제</p>
                )}
            </div>
        );
    });

    return (
        <Chrono
            key={resta.length + "-" + noResta.length}
            items={items}
            mode="HORIZONTAL"
            disableToolbar
        >
            {customContent}
        </Chrono>
    );
}
