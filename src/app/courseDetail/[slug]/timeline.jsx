'use client'

import {Chrono} from "react-chrono";
import {useEffect, useState} from "react";

export default function Timeline ({timelineStart, timelineFinish}) {

    const [start, setStart] = useState("");
    const [finish, setFinish] = useState("");

    useEffect(() => {
        setStart(timelineStart);
        setFinish(timelineFinish);
    }, [timelineStart, timelineFinish]);

    return (
        <Chrono
            items={[
                {
                    title: `시작: ${start}`,
                    cardSubtitle: "!플랜 시작시간 13:00!",
                },
                // {
                //
                //     title: "대련집",
                //     cardTitle: "대련집",
                //     url: "https://naver.me/Gj6lnook",
                //     cardSubtitle: "12:00~",
                //     cardDetailedText: "보쌈 양이 조금 적은거같기도 아닌거같기도 다음엔 칼국수도 먹어보자 " +
                //         "코멘트 내용이 길어진다면?코멘트 내용이 길어진다면?코멘트 내용이 길어진다면?코멘트 내용이 길어진다면?" +
                //         "코멘트 내용이 길어진다면?코멘트 내용이 길어진다면?코멘트 내용이 길어진다면?코멘트 내용이 길어진다면?" +
                //         "코멘트 내용이 길어진다면?코멘트 내용이 길어진다면?코멘트 내용이 길어진다면?코멘트 내용이 길어진다면?" +
                //         "코멘트 내용이 길어진다면?코멘트 내용이 길어진다면?코멘트 내용이 길어진다면?코멘트 내용이 길어진다면?" +
                //         "코멘트 내용이 길어진다면?코멘트 내용이 길어진다면?코멘트 내용이 길어진다면?코멘트 내용이 길어진다면?" +
                //         "코멘트 내용이 길어진다면?코멘트 내용이 길어진다면?코멘트 내용이 길어진다면?코멘트 내용이 길어진다면?" +
                //         "코멘트 내용이 길어진다면?코멘트 내용이 길어진다면?코멘트 내용이 길어진다면?코멘트 내용이 길어진다면?" +
                //         "코멘트 내용이 길어진다면?코멘트 내용이 길어진다면?코멘트 내용이 길어진다면?코멘트 내용이 길어진다면?" +
                //         "코멘트 내용이 길어진다면?코멘트 내용이 길어진다면?코멘트 내용이 길어진다면?코멘트 내용이 길어진다면?" +
                //         "코멘트 내용이 길어진다면?코멘트 내용이 길어진다면?코멘트 내용이 길어진다면?코멘트 내용이 길어진다면?",
                //     media: {
                //         type: "IMAGE",
                //         source: {
                //             url: "http://localhost/image/rest1.jpg"
                //         }
                //     }
                // },
                // {
                //     title: "따릉이타고 이동",
                //     cardTitle: "따릉이 타고 이동",
                //     cardSubtitle: "13:00~",
                //     cardDetailedText: "식당정보가 없는 상세일정"
                // },
                {
                    title: `끝: ${finish}`,
                    cardSubtitle: "!플랜 끝 시간 18:00!",
                },
            ]}
            mode="HORIZONTAL"
            disableToolbar

        />
    );
};