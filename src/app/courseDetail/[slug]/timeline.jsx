'use client'

import {Chrono} from "react-chrono";

export default function Timeline () {
    return (
        <Chrono
            items={[
                {
                    title: "대련집",
                    cardTitle: "대련집",
                    url: "https://naver.me/Gj6lnook",
                    cardSubtitle: "12:00~",
                    cardDetailedText: "보쌈 양이 조금 적은거같기도 아닌거같기도 다음엔 칼국수도 먹어보자 " +
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
                    title: "따릉이타고 이동",
                    cardTitle: "따릉이 타고 이동",
                    cardSubtitle: "13:00~",
                    cardDetailedText: "식당정보가 없는 상세일정"
                },
                {
                    title: "June 1941",
                    cardTitle: "Operation Barbarossa",
                    cardSubtitle: `A column of Red Army prisoners taken during the first days of the German invasion`,
                    cardDetailedText: `Since the 1920s, Hitler had seen Russia, with its immense natural resources, as the principal target for conquest and expansion. It would provide, he believed, the necessary ‘Lebensraum’, or living space, for the German people. And by conquering Russia, Hitler would also destroy the “Jewish pestilential creed of Bolshevism”. His non-aggression pact with Stalin in August 1939 he regarded as a mere temporary expedient.
        Barely a month after the fall of France, and while the Battle of Britain was being fought, Hitler started planning for the Blitzkrieg campaign against Russia, which began on 22 June 1941. Despite repeated warnings, Stalin was taken by surprise, and for the first few months the Germans achieved spectacular victories, capturing huge swathes of land and hundreds of thousands of prisoners. But they failed to take Moscow or Leningrad before winter set in.
        On 5/6 December, the Red Army launched a counter-offensive which removed the immediate threat to the Soviet capital. It also brought the German high command to the brink of a catastrophic military crisis. Hitler stepped in and took personal command. His intervention was decisive and he later boasted, “That we overcame this winter and are today in a position again to proceed victoriously… is solely attributable to the bravery of the soldiers at the front and my firm will to hold out…”`,
                },
            ]}
            mode="HORIZONTAL"
            disableToolbar
        />
    );
};