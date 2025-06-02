'use client'

import { Chrono } from "react-chrono";

export default function Timeline({
                                     timelineStart,
                                     timelineFinish,
                                     courseList = []
                                 }) {

    console.log("업데이트: ", courseList[0]);

// <<<<<<< HEAD
//     const validCourseList = courseList.filter(course => course != null);
// =======
//     // 세부일정 배열 꺼내고 합친다음 시간순으로 정렬
//     const nodes = [
//         ...noResta.map(item => ({
//             title: "코멘트",
//             cardTitle: "코멘트",
//             cardSubtitle: item.start,
//             cardDetailedText: item.comment
//         })),
//         ...resta.map(item => {
//             const restaInfo = item.resta[0]; // 배열에서 첫 번째 식당 정보 사용
//             return {
//                 title: restaInfo.resta_name,
//                 cardTitle: restaInfo.resta_name,
//                 url: restaInfo.url,
//                 cardSubtitle: item.start,
//                 cardDetailedText: item.comment,
//                 media: {
//                     type: "IMAGE",
//                     source: {
//                         url: `http://localhost/image/${restaInfo.photo.new_filename}`
//                     }
//                 }
//             };
//         })
//     ].sort((a, b) => a.cardSubtitle.localeCompare(b.cardSubtitle));
// >>>>>>> origin/master

    const nodes = validCourseList.map((course) => ({
        title: course.timeline_resta_name, //첫번째 모달에서 입력하는 값
        cardTitle: course.resta?.resta_name || course.noResta || "식당 제목", // 두번째 모달에서 검색해서 나오는 식당 이름
        cardSubtitle: course.timeline_time || "", // 세번째 모달에서 입력하는 시간
        cardDetailedText: course.timeline_coment || "", // 세번째 모달에서 입력하는 자유 코멘트
        url: course.resta?.url?.startsWith("http")
            ? course.resta.url
            : `https://${course.resta?.url}`, // 두번째 모달에서 식당 검색할 때 같이 나오는 url
        // media: course.new_filename
        //     ? {
        //         type: "IMAGE",
        //         source: {
        //             url: `http://localhost/image/rest${course.new_filename}`
        //         }
        //     }
        //     : null
    }));

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
            onItemSelected={index => {
                console.log("Clicked item index:", index);
            }}
        />
    );
}
