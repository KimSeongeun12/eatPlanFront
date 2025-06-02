'use client'

import {Chrono} from "react-chrono";
import {useEffect, useState} from "react";

export default function Timeline ({timelineStart, timelineFinish, noResta, resta}) {

    const [start, setStart] = useState("");
    const [finish, setFinish] = useState("");

    // 세부일정 배열 꺼내고 합친다음 시간순으로 정렬
    const nodes = [
        ...noResta.map(item => ({
            title: "코멘트",
            cardTitle: "코멘트",
            cardSubtitle: item.start,
            cardDetailedText: item.comment
        })),
        ...resta.map(item => {
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
                        url: `http://localhost/image/rest${restaInfo.new_filename}`
                    }
                }
            };
        })
    ].sort((a, b) => a.cardSubtitle.localeCompare(b.cardSubtitle));


    useEffect(() => {
        setStart(timelineStart);
        setFinish(timelineFinish);
    }, [timelineStart, timelineFinish]);

    return (
        <Chrono
            items={[
                {
                    title: `시작 ${start}`,
                    cardSubtitle: "!플랜 시작시간 13:00!",
                },
                ...nodes,
                {
                    title: `${finish} 끝`,
                    cardSubtitle: "!플랜 끝 시간 18:00!",
                },
            ]}
            mode="HORIZONTAL"
            disableToolbar

        />
    );
};