'use client'

import {Chrono} from "react-chrono";
import {useEffect, useState} from "react";

export default function Timeline ({timelineStart, timelineFinish, noResta, resta}) {

    const [start, setStart] = useState("");
    const [finish, setFinish] = useState("");
    const [restaName, setRestaName] = useState("");
    const [selectRestaurant, setSelectRestaurant] = useState("");
    const [timelineTime, setTimelineTime] = useState("");
    const [timelineComent, setTimelineComent] = useState("");

    useEffect(() => {
        setStart(timelineStart);
        setFinish(timelineFinish);
        /**/
    }, [timelineStart, timelineFinish]);

    return (
        <Chrono
            items={[
                {
                    title: `시작: ${start}`,
                    cardSubtitle: "!플랜 시작시간 13:00!",
                },
                {
                    title: "타임라인 식당", // 타임라인 표시
                    cardTitle: "상세보기 이름", // 상세보기 이름
                    url: "https://naver.me/Gj6lnook", // 상세보기 url
                    cardSubtitle: "시간", //  상세보기 시간
                    cardDetailedText: `${timelineComent}` +
                        "코멘트 내용이 길어진다면?코멘트 내용이 길어진다면?코멘트 내용이 길어진다면?코멘트 내용이 길어진다면?" +
                        "코멘트 내용이 길어진다면?코멘트 내용이 길어진다면?코멘트 내용이 길어진다면?코멘트 내용이 길어진다면?" +
                        "코멘트 내용이 길어진다면?코멘트 내용이 길어진다면?코멘트 내용이 길어진다면?코멘트 내용이 길어진다면?" +
                        "코멘트 내용이 길어진다면?코멘트 내용이 길어진다면?코멘트 내용이 길어진다면?코멘트 내용이 길어진다면?" +
                        "코멘트 내용이 길어진다면?코멘트 내용이 길어진다면?코멘트 내용이 길어진다면?코멘트 내용이 길어진다면?" +
                        "코멘트 내용이 길어진다면?코멘트 내용이 길어진다면?코멘트 내용이 길어진다면?코멘트 내용이 길어진다면?" +
                        "코멘트 내용이 길어진다면?코멘트 내용이 길어진다면?코멘트 내용이 길어진다면?코멘트 내용이 길어진다면?" +
                        "코멘트 내용이 길어진다면?코멘트 내용이 길어진다면?코멘트 내용이 길어진다면?코멘트 내용이 길어진다면?" +
                        "코멘트 내용이 길어진다면?코멘트 내용이 길어진다면?코멘트 내용이 길어진다면?코멘트 내용이 길어진다면?" +
                        "코멘트 내용이 길어진다면?코멘트 내용이 길어진다면?코멘트 내용이 길어진다면?코멘트 내용이 길어진다면?",
                    media: {
                        type: "IMAGE",
                        source: {
                            url: "http://localhost/image/rest1.jpg"
                        }
                    }
                },
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