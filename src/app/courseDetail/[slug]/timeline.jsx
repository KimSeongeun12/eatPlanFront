'use client'

import { Chrono } from "react-chrono";

export default function Timeline({timelineStart, timelineFinish, resta, noResta}) {

/*    console.log('resta:', resta);
    console.log('noResta:', noResta);*/

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
                media: {
                    type: "IMAGE",
                    source: {
                        url: restaInfo.photo?.new_filename
                            ? `http://localhost/image/${restaInfo.photo.new_filename}`
                            : restaInfo.media
                        // 좀 바꾸긴 햇는데 링크 손상은 안 시켯거든요 제가 사진을 http://localhost/imageIdx/2 이걸로 받아와서
                    }
                }
            };
        })
    ].sort((a, b) => a.cardSubtitle.localeCompare(b.cardSubtitle));

    // 시작과 끝 노드 추가
    const items = [
        {
            title: `시작 ${timelineStart}`,
            cardSubtitle: "플랜 시작 시간",
            cardContent: <p>제발좀</p>
        },
        ...nodes,
        {
            title: `${timelineFinish} 끝`,
            cardSubtitle: "플랜 종료12345677889 시간"
        }
    ];

    return (
        <Chrono
            key={resta.length + "-" + noResta.length}
            items={items}
            mode="HORIZONTAL"
            disableToolbar
        />
    );
}
