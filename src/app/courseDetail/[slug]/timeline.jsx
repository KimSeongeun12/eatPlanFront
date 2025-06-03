'use client'

import { Chrono } from "react-chrono";

export default function Timeline({timelineStart, timelineFinish, resta, noResta}) {

    console.log('resta:', resta);
    console.log('noResta:', noResta);

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
                // media: {
                //     type: "IMAGE",
                //     source: {
                //         url: `http://localhost/image/${restaInfo.photo.new_filename}`
                //     }
                // }
            };
        })
    ].sort((a, b) => a.cardSubtitle.localeCompare(b.cardSubtitle));

    // 시작과 끝 노드 추가
    const items = [
        {
            title: `시작 ${timelineStart}`,
            cardSubtitle: "플랜 시작 시간"
        },
        ...nodes,
        {
            title: `${timelineFinish} 끝`,
            cardSubtitle: "플랜 종료12345677889 시간"
        }
    ];

    return (
        <Chrono
            key={JSON.stringify(items)}
            items={items}
            mode="HORIZONTAL"
            disableToolbar
        />
    );
}
