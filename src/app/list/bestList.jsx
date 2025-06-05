'use client'
import {useEffect, useState} from "react";
import axios from "axios";

export default function bestList() {
    const [page, setPage] = useState(1);
    const [items, setItems] = useState([]);
    const [totalItems, setTotalItems] = useState(0);

    // useEffect(() => {
    //     renderList(page);
    // }, [page]);
    //
    // const renderList = async (p) => {
    //     try {
    //         const res = await axios.get(`http://localhost/course_list/${p}`);
    //         const data = res.data;
    //         setItems(data.list);
    //         setTotalItems(data.pages);
    //     } catch (error) {
    //         console.error('데이터 로딩 실패:', error);
    //     }
    // };

    /**/

    // const [weekly, setWeekly] = useState([]);
    // const [monthly, setMonthly] = useState([]);
    // const count = [1, 2, 3, 4, 5, 6];
    //
    // useEffect(() => {
    //     weeklyList();
    //     monthlyList();
    // }, []);
    //
    // const weeklyList = () => {
    //     const content = count.map((item, index) => {
    //         return (
    //             <div key={index}>
    //                 <div className={"mainImage"}></div>
    //                 <span className={"courseTitle"}>제목 {item}</span>
    //                 <span className={"courseComment"}>[댓글]</span><br />
    //                 <span className={"courseAuthor"}>작성자</span>
    //                 <span className={"courseViews"}>조회 숫자</span><br />
    //                 <span className={"courseScope"}>별점 숫자</span>
    //                 <span className={"courseLike"}>좋아요 숫자</span><br />
    //                 <span className={"courseDate"}>작성날짜</span>
    //             </div>
    //         );
    //     });
    //     setWeekly(content);
    // }
    //
    // const monthlyList = () => {
    //     const content = count.map((item, index) => {
    //         return (
    //             <div key={index}>
    //                 <div className={"mainImage"}></div>
    //                 <span className={"courseTitle"}>제목 {item}</span>
    //                 <span className={"courseComment"}>[댓글]</span><br />
    //                 <span className={"courseAuthor"}>작성자</span>
    //                 <span className={"courseViews"}>조회 숫자</span><br />
    //                 <span className={"courseScope"}>별점 숫자</span>
    //                 <span className={"courseLike"}>좋아요 숫자</span><br />
    //                 <span className={"courseDate"}>작성날짜</span>
    //             </div>
    //         );
    //     });
    //     setMonthly(content);
    // }

    return (
        <>
            <div className={"rightMenu-bottom"}>
                <div className={"weekly"}>
                    <span className={"weeklySpan"}>Weekly 주간 베스트</span>
                    <div className={"weeklyDiv"}></div>
                </div>
                <div className={"length"}></div>
                <div className={"monthly"}>
                    <span className={"monthlySpan"}>Monthly 월간 베스트</span>
                    <div className={"monthlyDiv"}></div>
                </div>
            </div>
        </>
    );
}